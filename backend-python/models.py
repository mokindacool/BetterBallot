from datetime import date, datetime
from typing import Optional
from sqlmodel import Field, SQLModel, JSON, Column
from sqlalchemy import DateTime


class Election(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    date: date
    jurisdiction: str


class Candidate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    election_id: int = Field(foreign_key="election.id", index=True)
    full_name: str
    office: str
    district: Optional[str] = None
    party: str
    photo_url: Optional[str] = None


class Profile(SQLModel, table=True):
    candidate_id: int = Field(foreign_key="candidate.id", primary_key=True)
    bio_md: str
    policies_json: dict = Field(sa_column=Column(JSON))
    website: Optional[str] = None
    email: Optional[str] = None
    facebook: Optional[str] = None
    twitter: Optional[str] = None
    instagram: Optional[str] = None
    last_updated: datetime = Field(
        sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    )


# Response models
class CandidateWithProfile(SQLModel):
    id: int
    election_id: int
    full_name: str
    office: str
    district: Optional[str]
    party: str
    photo_url: Optional[str]
    profile: Optional[Profile] = None


class ElectionWithCandidates(SQLModel):
    id: int
    name: str
    date: date
    jurisdiction: str
    candidates: list[CandidateWithProfile] = [] 