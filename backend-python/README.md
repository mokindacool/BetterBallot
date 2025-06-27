# Better Ballot Backend

A FastAPI backend for the Better Ballot candidate profiles feature with real-time updates.

## Features

- **Election Management**: Create, read, update, and delete elections
- **Candidate Profiles**: Manage candidate information with detailed profiles
- **Real-time Updates**: Server-Sent Events (SSE) for live updates
- **RESTful API**: Clean, documented API endpoints
- **Database Migrations**: Alembic for schema management
- **Comprehensive Testing**: Full test suite with pytest

## Setup

### 1. Install Dependencies

```bash
cd backend-python
pip install -r requirements.txt
```

### 2. Set up PostgreSQL Database

```bash
# Create database
createdb betterballot

# Or if using Docker
docker run --name postgres-betterballot -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=betterballot -p 5432:5432 -d postgres
```

### 3. Configure Environment Variables

Create a `.env` file (optional):
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost/betterballot
```

### 4. Run Database Migrations

```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Run the Application

```bash
# Development mode
uvicorn main:app --reload

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 6. Run Tests

```bash
# Run all tests
pytest -v

# Run with coverage
pytest --cov=. --cov-report=html
```

## API Documentation

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

## API Endpoints

### Public Endpoints

#### Elections
- `GET /api/elections` - List all elections
- `GET /api/elections?jurisdiction=Berkeley,CA` - Filter by jurisdiction
- `GET /api/elections/{id}` - Get election with candidates

#### Candidates
- `GET /api/candidates` - List all candidates
- `GET /api/candidates?election_id=1` - Filter by election
- `GET /api/candidates?office=Mayor` - Filter by office
- `GET /api/candidates?district=District 4` - Filter by district
- `GET /api/candidates/{id}` - Get candidate with profile

#### Real-time Updates
- `GET /api/updates/candidates` - SSE stream for real-time updates

### Admin Endpoints

#### Elections (Admin)
- `POST /api/admin/elections` - Create election
- `PUT /api/admin/elections/{id}` - Update election
- `DELETE /api/admin/elections/{id}` - Delete election

#### Candidates (Admin)
- `POST /api/admin/candidates` - Create candidate
- `PUT /api/admin/candidates/{id}` - Update candidate
- `DELETE /api/admin/candidates/{id}` - Delete candidate

#### Profiles (Admin)
- `POST /api/admin/profiles` - Create profile
- `PUT /api/admin/profiles/{candidate_id}` - Update profile
- `DELETE /api/admin/profiles/{candidate_id}` - Delete profile

### Health Check
- `GET /health` - Health check endpoint

## Data Models

### Election
```json
{
  "id": 1,
  "name": "Berkeley Municipal Election",
  "date": "2024-11-05",
  "jurisdiction": "Berkeley, CA"
}
```

### Candidate
```json
{
  "id": 1,
  "election_id": 1,
  "full_name": "Kate Harrison",
  "office": "Mayor",
  "district": "District 4",
  "party": "Democrat",
  "photo_url": "https://example.com/photo.jpg"
}
```

### Profile
```json
{
  "candidate_id": 1,
  "bio_md": "Kate Harrison has served on the Berkeley City Council since 2017...",
  "policies_json": {
    "housing": {
      "title": "Affordable Housing",
      "description": "Expand affordable housing",
      "priority": 90
    }
  },
  "website": "https://www.kateharrison.info",
  "email": "kate@kateharrison.info",
  "twitter": "https://twitter.com/KateHarrisonD4",
  "facebook": "https://facebook.com/kateharrison",
  "instagram": "https://instagram.com/kateharrison",
  "last_updated": "2024-01-15T10:30:00Z"
}
```

## Real-time Updates

Connect to `/api/updates/candidates` to receive Server-Sent Events when candidates are created, updated, or deleted.

### Example JavaScript Client

```javascript
const eventSource = new EventSource('/api/updates/candidates');

eventSource.addEventListener('candidate_created', (event) => {
    const data = JSON.parse(event.data);
    console.log('Candidate created:', data);
});

eventSource.addEventListener('candidate_updated', (event) => {
    const data = JSON.parse(event.data);
    console.log('Candidate updated:', data);
});

eventSource.addEventListener('candidate_deleted', (event) => {
    const data = JSON.parse(event.data);
    console.log('Candidate deleted:', data);
});

eventSource.addEventListener('profile_created', (event) => {
    const data = JSON.parse(event.data);
    console.log('Profile created:', data);
});

eventSource.addEventListener('heartbeat', (event) => {
    const data = JSON.parse(event.data);
    console.log('Heartbeat:', data.timestamp);
});

eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
};
```

## Example Usage

### Create an Election
```bash
curl -X POST "http://localhost:8000/api/admin/elections" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Berkeley Municipal Election",
       "date": "2024-11-05",
       "jurisdiction": "Berkeley, CA"
     }'
```

### Create a Candidate
```bash
curl -X POST "http://localhost:8000/api/admin/candidates" \
     -H "Content-Type: application/json" \
     -d '{
       "election_id": 1,
       "full_name": "Kate Harrison",
       "office": "Mayor",
       "district": "District 4",
       "party": "Democrat",
       "photo_url": "https://example.com/photo.jpg"
     }'
```

### Create a Profile
```bash
curl -X POST "http://localhost:8000/api/admin/profiles" \
     -H "Content-Type: application/json" \
     -d '{
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
     }'
```

## Development

### Project Structure
```
backend-python/
├── alembic/              # Database migrations
├── models.py             # SQLModel data models
├── database.py           # Database connection and session
├── main.py              # FastAPI application and endpoints
├── test_main.py         # Test suite
├── requirements.txt     # Python dependencies
├── alembic.ini         # Alembic configuration
└── README.md           # This file
```

### Adding New Features

1. **Models**: Add new models to `models.py`
2. **Endpoints**: Add new endpoints to `main.py`
3. **Tests**: Add corresponding tests to `test_main.py`
4. **Migrations**: Run `alembic revision --autogenerate -m "Description"`

### Code Style

The project uses:
- **Black** for code formatting
- **Pytest** for testing
- **SQLModel** for ORM
- **FastAPI** for the web framework

## Deployment

### Docker

Create a `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PYTEST_CURRENT_TEST`: Used for test detection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## License

This project is part of the Better Ballot application. 