from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from sse_starlette.sse import EventSourceResponse
from typing import Optional, AsyncGenerator
import asyncio
import json
from datetime import datetime

from models import (
    Election, Candidate, Profile, 
    CandidateWithProfile, ElectionWithCandidates
)
from database import create_db_and_tables, get_session

app = FastAPI(title="Better Ballot API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event queue for SSE
update_queue = asyncio.Queue()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


# Public Read Endpoints
@app.get("/api/elections", response_model=list[Election])
def get_elections(
    jurisdiction: Optional[str] = None,
    session: Session = Depends(get_session)
):
    statement = select(Election)
    if jurisdiction:
        statement = statement.where(Election.jurisdiction == jurisdiction)
    return session.exec(statement).all()


@app.get("/api/elections/{election_id}", response_model=ElectionWithCandidates)
def get_election_with_candidates(
    election_id: int,
    session: Session = Depends(get_session)
):
    election = session.get(Election, election_id)
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    # Get all candidates for this election with their profiles
    candidates_stmt = select(Candidate).where(Candidate.election_id == election_id)
    candidates = session.exec(candidates_stmt).all()
    
    candidates_with_profiles = []
    for candidate in candidates:
        profile = session.get(Profile, candidate.id)
        candidate_dict = candidate.dict()
        candidate_dict["profile"] = profile
        candidates_with_profiles.append(CandidateWithProfile(**candidate_dict))
    
    election_dict = election.dict()
    election_dict["candidates"] = candidates_with_profiles
    return ElectionWithCandidates(**election_dict)


@app.get("/api/candidates", response_model=list[CandidateWithProfile])
def get_candidates(
    election_id: Optional[int] = None,
    office: Optional[str] = None,
    district: Optional[str] = None,
    session: Session = Depends(get_session)
):
    statement = select(Candidate)
    if election_id:
        statement = statement.where(Candidate.election_id == election_id)
    if office:
        statement = statement.where(Candidate.office == office)
    if district:
        statement = statement.where(Candidate.district == district)
    
    candidates = session.exec(statement).all()
    
    candidates_with_profiles = []
    for candidate in candidates:
        profile = session.get(Profile, candidate.id)
        candidate_dict = candidate.dict()
        candidate_dict["profile"] = profile
        candidates_with_profiles.append(CandidateWithProfile(**candidate_dict))
    
    return candidates_with_profiles


@app.get("/api/candidates/{candidate_id}", response_model=CandidateWithProfile)
def get_candidate(
    candidate_id: int,
    session: Session = Depends(get_session)
):
    candidate = session.get(Candidate, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    profile = session.get(Profile, candidate_id)
    candidate_dict = candidate.dict()
    candidate_dict["profile"] = profile
    return CandidateWithProfile(**candidate_dict)


# Admin CRUD Endpoints
@app.post("/api/admin/elections", response_model=Election)
def create_election(
    election: Election,
    session: Session = Depends(get_session)
):
    db_election = Election.from_orm(election)
    session.add(db_election)
    session.commit()
    session.refresh(db_election)
    return db_election


@app.put("/api/admin/elections/{election_id}", response_model=Election)
def update_election(
    election_id: int,
    election: Election,
    session: Session = Depends(get_session)
):
    db_election = session.get(Election, election_id)
    if not db_election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    for key, value in election.dict(exclude_unset=True).items():
        setattr(db_election, key, value)
    
    session.add(db_election)
    session.commit()
    session.refresh(db_election)
    return db_election


@app.delete("/api/admin/elections/{election_id}")
def delete_election(
    election_id: int,
    session: Session = Depends(get_session)
):
    election = session.get(Election, election_id)
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    session.delete(election)
    session.commit()
    return {"message": "Election deleted"}


@app.post("/api/admin/candidates", response_model=Candidate)
async def create_candidate(
    candidate: Candidate,
    session: Session = Depends(get_session)
):
    db_candidate = Candidate.from_orm(candidate)
    session.add(db_candidate)
    session.commit()
    session.refresh(db_candidate)
    
    # Trigger SSE update
    await update_queue.put({
        "event": "candidate_created",
        "data": db_candidate.dict()
    })
    
    return db_candidate


@app.put("/api/admin/candidates/{candidate_id}", response_model=Candidate)
async def update_candidate(
    candidate_id: int,
    candidate: Candidate,
    session: Session = Depends(get_session)
):
    db_candidate = session.get(Candidate, candidate_id)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    for key, value in candidate.dict(exclude_unset=True).items():
        setattr(db_candidate, key, value)
    
    session.add(db_candidate)
    session.commit()
    session.refresh(db_candidate)
    
    # Trigger SSE update
    await update_queue.put({
        "event": "candidate_updated",
        "data": db_candidate.dict()
    })
    
    return db_candidate


@app.delete("/api/admin/candidates/{candidate_id}")
async def delete_candidate(
    candidate_id: int,
    session: Session = Depends(get_session)
):
    candidate = session.get(Candidate, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    session.delete(candidate)
    session.commit()
    
    # Trigger SSE update
    await update_queue.put({
        "event": "candidate_deleted",
        "data": {"id": candidate_id}
    })
    
    return {"message": "Candidate deleted"}


@app.post("/api/admin/profiles", response_model=Profile)
async def create_profile(
    profile: Profile,
    session: Session = Depends(get_session)
):
    # Check if candidate exists
    candidate = session.get(Candidate, profile.candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Check if profile already exists
    existing_profile = session.get(Profile, profile.candidate_id)
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists for this candidate")
    
    db_profile = Profile.from_orm(profile)
    db_profile.last_updated = datetime.utcnow()
    session.add(db_profile)
    session.commit()
    session.refresh(db_profile)
    
    # Trigger SSE update
    await update_queue.put({
        "event": "profile_created",
        "data": db_profile.dict()
    })
    
    return db_profile


@app.put("/api/admin/profiles/{candidate_id}", response_model=Profile)
async def update_profile(
    candidate_id: int,
    profile: Profile,
    session: Session = Depends(get_session)
):
    db_profile = session.get(Profile, candidate_id)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for key, value in profile.dict(exclude_unset=True).items():
        if key != "candidate_id":  # Don't update primary key
            setattr(db_profile, key, value)
    
    db_profile.last_updated = datetime.utcnow()
    session.add(db_profile)
    session.commit()
    session.refresh(db_profile)
    
    # Trigger SSE update
    await update_queue.put({
        "event": "profile_updated",
        "data": db_profile.dict()
    })
    
    return db_profile


@app.delete("/api/admin/profiles/{candidate_id}")
async def delete_profile(
    candidate_id: int,
    session: Session = Depends(get_session)
):
    profile = session.get(Profile, candidate_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    session.delete(profile)
    session.commit()
    
    # Trigger SSE update
    await update_queue.put({
        "event": "profile_deleted",
        "data": {"candidate_id": candidate_id}
    })
    
    return {"message": "Profile deleted"}


# Server-Sent Events endpoint
async def event_generator() -> AsyncGenerator[str, None]:
    while True:
        try:
            # Wait for updates with timeout
            update = await asyncio.wait_for(update_queue.get(), timeout=30.0)
            yield f"event: {update['event']}\ndata: {json.dumps(update['data'])}\n\n"
        except asyncio.TimeoutError:
            # Send heartbeat
            yield f"event: heartbeat\ndata: {json.dumps({'timestamp': datetime.utcnow().isoformat()})}\n\n"


@app.get("/api/updates/candidates")
async def candidate_updates():
    return EventSourceResponse(event_generator())


# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"} 