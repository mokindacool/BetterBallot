import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlalchemy.pool import StaticPool
import asyncio
from datetime import date, datetime
import json

from main import app, update_queue
from database import get_session
from models import Election, Candidate, Profile


# Test database setup
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


# Test data fixtures
@pytest.fixture
def sample_election():
    return {
        "name": "Berkeley Municipal Election",
        "date": "2024-11-05",
        "jurisdiction": "Berkeley, CA"
    }


@pytest.fixture
def sample_candidate():
    return {
        "election_id": 1,
        "full_name": "Kate Harrison",
        "office": "Mayor",
        "district": None,
        "party": "Democrat",
        "photo_url": None
    }


@pytest.fixture
def sample_profile():
    return {
        "candidate_id": 1,
        "bio_md": "Kate Harrison has served on the Berkeley City Council since 2017.",
        "policies_json": {
            "housing": {
                "title": "Affordable Housing",
                "description": "Expand affordable housing",
                "priority": 90
            }
        },
        "website": "https://www.kateharrison.info",
        "email": "kate@kateharrison.info",
        "twitter": "https://twitter.com/KateHarrisonD4"
    }


# Election CRUD tests
def test_create_election(client: TestClient, sample_election):
    response = client.post("/api/admin/elections", json=sample_election)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == sample_election["name"]
    assert data["id"] == 1


def test_get_elections(client: TestClient, sample_election):
    # Create an election first
    client.post("/api/admin/elections", json=sample_election)
    
    response = client.get("/api/elections")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == sample_election["name"]


def test_get_election_with_candidates(client: TestClient, sample_election, sample_candidate):
    # Create election and candidate
    election_response = client.post("/api/admin/elections", json=sample_election)
    election_id = election_response.json()["id"]
    
    sample_candidate["election_id"] = election_id
    client.post("/api/admin/candidates", json=sample_candidate)
    
    response = client.get(f"/api/elections/{election_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == sample_election["name"]
    assert len(data["candidates"]) == 1
    assert data["candidates"][0]["full_name"] == sample_candidate["full_name"]


def test_update_election(client: TestClient, sample_election):
    # Create election
    create_response = client.post("/api/admin/elections", json=sample_election)
    election_id = create_response.json()["id"]
    
    # Update election
    update_data = {"name": "Updated Berkeley Election"}
    response = client.put(f"/api/admin/elections/{election_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Berkeley Election"


def test_delete_election(client: TestClient, sample_election):
    # Create election
    create_response = client.post("/api/admin/elections", json=sample_election)
    election_id = create_response.json()["id"]
    
    # Delete election
    response = client.delete(f"/api/admin/elections/{election_id}")
    assert response.status_code == 200
    
    # Verify deletion
    get_response = client.get(f"/api/elections/{election_id}")
    assert get_response.status_code == 404


# Candidate CRUD tests
def test_create_candidate(client: TestClient, sample_election, sample_candidate):
    # Create election first
    election_response = client.post("/api/admin/elections", json=sample_election)
    election_id = election_response.json()["id"]
    
    sample_candidate["election_id"] = election_id
    response = client.post("/api/admin/candidates", json=sample_candidate)
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == sample_candidate["full_name"]
    assert data["id"] == 1


def test_get_candidates(client: TestClient, sample_election, sample_candidate):
    # Create election and candidate
    election_response = client.post("/api/admin/elections", json=sample_election)
    election_id = election_response.json()["id"]
    
    sample_candidate["election_id"] = election_id
    client.post("/api/admin/candidates", json=sample_candidate)
    
    # Test without filters
    response = client.get("/api/candidates")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    
    # Test with election_id filter
    response = client.get(f"/api/candidates?election_id={election_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    
    # Test with office filter
    response = client.get("/api/candidates?office=Mayor")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1


def test_get_candidate(client: TestClient, sample_election, sample_candidate):
    # Create election and candidate
    election_response = client.post("/api/admin/elections", json=sample_election)
    election_id = election_response.json()["id"]
    
    sample_candidate["election_id"] = election_id
    candidate_response = client.post("/api/admin/candidates", json=sample_candidate)
    candidate_id = candidate_response.json()["id"]
    
    response = client.get(f"/api/candidates/{candidate_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == sample_candidate["full_name"]
    assert data["profile"] is None  # No profile created yet


def test_update_candidate(client: TestClient, sample_election, sample_candidate):
    # Create election and candidate
    election_response = client.post("/api/admin/elections", json=sample_election)
    election_id = election_response.json()["id"]
    
    sample_candidate["election_id"] = election_id
    candidate_response = client.post("/api/admin/candidates", json=sample_candidate)
    candidate_id = candidate_response.json()["id"]
    
    # Update candidate
    update_data = {"party": "Independent"}
    response = client.put(f"/api/admin/candidates/{candidate_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["party"] == "Independent"


def test_delete_candidate(client: TestClient, sample_election, sample_candidate):
    # Create election and candidate
    election_response = client.post("/api/admin/elections", json=sample_election)
    election_id = election_response.json()["id"]
    
    sample_candidate["election_id"] = election_id
    candidate_response = client.post("/api/admin/candidates", json=sample_candidate)
    candidate_id = candidate_response.json()["id"]
    
    # Delete candidate
    response = client.delete(f"/api/admin/candidates/{candidate_id}")
    assert response.status_code == 200
    
    # Verify deletion
    get_response = client.get(f"/api/candidates/{candidate_id}")
    assert get_response.status_code == 404


# Profile CRUD tests
def test_create_profile(client: TestClient, sample_election, sample_candidate, sample_profile):
    # Create election and candidate first
    election_response = client.post("/api/admin/elections", json=sample_election)
    election_id = election_response.json()["id"]
    
    sample_candidate["election_id"] = election_id
    candidate_response = client.post("/api/admin/candidates", json=sample_candidate)
    candidate_id = candidate_response.json()["id"]
    
    sample_profile["candidate_id"] = candidate_id
    response = client.post("/api/admin/profiles", json=sample_profile)
    assert response.status_code == 200
    data = response.json()
    assert data["bio_md"] == sample_profile["bio_md"]
    assert data["policies_json"] == sample_profile["policies_json"]


def test_update_profile(client: TestClient, sample_election, sample_candidate, sample_profile):
    # Create election, candidate, and profile
    election_response = client.post("/api/admin/elections", json=sample_election)
    election_id = election_response.json()["id"]
    
    sample_candidate["election_id"] = election_id
    candidate_response = client.post("/api/admin/candidates", json=sample_candidate)
    candidate_id = candidate_response.json()["id"]
    
    sample_profile["candidate_id"] = candidate_id
    client.post("/api/admin/profiles", json=sample_profile)
    
    # Update profile
    update_data = {"bio_md": "Updated biography"}
    response = client.put(f"/api/admin/profiles/{candidate_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["bio_md"] == "Updated biography"


def test_delete_profile(client: TestClient, sample_election, sample_candidate, sample_profile):
    # Create election, candidate, and profile
    election_response = client.post("/api/admin/elections", json=sample_election)
    election_id = election_response.json()["id"]
    
    sample_candidate["election_id"] = election_id
    candidate_response = client.post("/api/admin/candidates", json=sample_candidate)
    candidate_id = candidate_response.json()["id"]
    
    sample_profile["candidate_id"] = candidate_id
    client.post("/api/admin/profiles", json=sample_profile)
    
    # Delete profile
    response = client.delete(f"/api/admin/profiles/{candidate_id}")
    assert response.status_code == 200
    
    # Verify candidate still exists but without profile
    get_response = client.get(f"/api/candidates/{candidate_id}")
    assert get_response.status_code == 200
    data = get_response.json()
    assert data["profile"] is None


# Integration tests
def test_candidate_with_profile_integration(client: TestClient, sample_election, sample_candidate, sample_profile):
    # Create full candidate with profile
    election_response = client.post("/api/admin/elections", json=sample_election)
    election_id = election_response.json()["id"]
    
    sample_candidate["election_id"] = election_id
    candidate_response = client.post("/api/admin/candidates", json=sample_candidate)
    candidate_id = candidate_response.json()["id"]
    
    sample_profile["candidate_id"] = candidate_id
    client.post("/api/admin/profiles", json=sample_profile)
    
    # Get candidate with profile
    response = client.get(f"/api/candidates/{candidate_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == sample_candidate["full_name"]
    assert data["profile"] is not None
    assert data["profile"]["bio_md"] == sample_profile["bio_md"]
    assert data["profile"]["policies_json"] == sample_profile["policies_json"]


# Health check test
def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


# SSE tests would require async testing framework
@pytest.mark.asyncio
async def test_sse_updates():
    # Clear the queue
    while not update_queue.empty():
        await update_queue.get()
    
    # Simulate an update
    test_update = {
        "event": "candidate_updated",
        "data": {"id": 1, "full_name": "Test Candidate"}
    }
    await update_queue.put(test_update)
    
    # Verify update is in queue
    update = await update_queue.get()
    assert update["event"] == "candidate_updated"
    assert update["data"]["full_name"] == "Test Candidate" 