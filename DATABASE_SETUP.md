# BetterBallot Database Setup Guide

This guide explains how to set up and use the new database-backed candidate management system for BetterBallot.

## 🎯 What Was Changed

### Before
- **Hardcoded Data**: All candidate information was stored directly in React component files
- **Manual Updates**: Adding/editing candidates required code changes and redeployment
- **No Persistence**: Changes weren't saved to a database
- **Security**: Sensitive data was exposed in frontend code

### After
- **Database Storage**: SQLite database stores all candidate information securely on the backend
- **RESTful API**: Backend API endpoints for CRUD operations on candidates
- **Admin Interface**: Web-based UI to add/edit candidates without touching code
- **Secure**: Candidate data only accessible through API, not exposed in frontend bundle

---

## 📁 New File Structure

```
backend/
├── db/
│   ├── schema.sql           # Database schema definition
│   ├── database.js          # Database connection and helpers
│   ├── seed.js              # Script to populate initial data
│   └── betterballot.db      # SQLite database (created automatically)
├── routes/
│   ├── candidates.js        # Candidate API endpoints
│   └── elections.js         # Elections API endpoints (for future use)
├── script.js                # Updated backend server with new routes
├── package.json             # Updated with sqlite3 dependency
└── .env                     # Environment variables (API keys)

src/
└── pages/
    ├── Admin/
    │   ├── Admin.js         # Admin interface for managing candidates
    │   └── Admin.css        # Admin page styling
    ├── CandidateProfile/
    │   └── CandidateProfile.js  # Updated to fetch from API
    └── Home/
        └── Home.js          # Updated with improvements
```

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
# Install backend dependencies (including sqlite3)
cd backend
npm install

# Return to root
cd ..
```

### Step 2: Initialize Database

The database will be created automatically when you start the backend. To populate it with your existing candidate data:

```bash
# From the backend directory
cd backend
npm run seed
```

You should see output like:
```
Starting database seeding...
Inserting candidate: Kate Harrison
Inserting candidate: Terry Taplin
...
Database seeding completed successfully!
```

### Step 3: Start the Servers

**Option A: Run both servers concurrently (recommended)**
```bash
# From root directory
npm run dev
```

**Option B: Run separately in two terminals**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
npm start
```

---

## 🔌 API Endpoints

### Candidates API

**Base URL**: `http://localhost:5002/api/candidates`

#### Get All Candidates
```http
GET /api/candidates
```

**Response**:
```json
[
  {
    "id": "1",
    "name": "Kate Harrison",
    "position": "Mayor Candidate",
    "party": "Democrat",
    "photoUrl": null,
    "biography": "Kate Harrison has served...",
    "education": ["UC Berkeley, Master of Public Policy", "..."],
    "experience": ["Berkeley City Council, District 4", "..."],
    "endorsements": ["Berkeley Progressive Alliance", "..."],
    "policies": [
      {
        "title": "Affordable Housing",
        "description": "Expand affordable housing...",
        "priority": 90
      }
    ],
    "socialMedia": {
      "website": "https://www.kateharrison.info",
      "email": "kate@kateharrison.info",
      "twitter": "...",
      "facebook": "...",
      "instagram": "..."
    },
    "recentPosts": [...]
  }
]
```

#### Get Single Candidate
```http
GET /api/candidates/:id
```

#### Create New Candidate
```http
POST /api/candidates
Content-Type: application/json

{
  "name": "Jane Doe",
  "position": "City Council District 1 Candidate",
  "party": "Independent",
  "biography": "Jane is a community organizer...",
  "education": ["Stanford University, BA in Political Science"],
  "experience": ["Community Organizer, 2020-Present"],
  "endorsements": ["Local Business Association"],
  "policies": [
    {
      "title": "Small Business Support",
      "description": "Support local businesses...",
      "priority": 85
    }
  ],
  "socialMedia": {
    "website": "https://www.janedoe.com",
    "email": "jane@janedoe.com",
    "twitter": "https://twitter.com/janedoe"
  },
  "recentPosts": []
}
```

#### Update Candidate
```http
PUT /api/candidates/:id
Content-Type: application/json

[Same body structure as POST]
```

#### Delete Candidate
```http
DELETE /api/candidates/:id
```

---

## 👨‍💼 Using the Admin Interface

### Access the Admin Page

Navigate to: **http://localhost:3000/admin**

### Features

1. **View All Candidates**: See all candidates in a card grid on the left
2. **Add New Candidate**: Fill out the form on the right and click "Create Candidate"
3. **Edit Candidate**: Click "Edit" on any candidate card to load their data into the form
4. **Delete Candidate**: Click "Delete" on any candidate card (with confirmation)

### Form Sections

- **Basic Information**: Name, position, party, biography
- **Education**: Add multiple education entries
- **Experience**: Add multiple experience entries
- **Endorsements**: Add endorsing organizations
- **Policies**: Add policies with title, description, and priority (0-100%)
- **Social Media**: Website, email, Twitter, Facebook, Instagram links

### Dynamic Fields

- Click "+ Add Education/Experience/Endorsement/Policy" to add more entries
- Click "×" or "Remove" buttons to delete entries
- Use the priority slider to set policy importance (0-100%)

---

## 🗃️ Database Schema

### Tables

1. **candidates**: Core candidate information
2. **education**: Candidate education entries
3. **experience**: Candidate work experience
4. **endorsements**: Organizations endorsing the candidate
5. **policies**: Candidate policy positions
6. **social_media**: Social media links
7. **recent_posts**: Recent social media posts
8. **elections**: Election information
9. **election_candidates**: Junction table linking elections and candidates
10. **zipcodes**: Zipcodes associated with elections

### Key Features

- **Foreign Keys**: Maintain data integrity with CASCADE deletes
- **Indexes**: Optimized queries on frequently searched fields
- **Timestamps**: Track when candidates are created/updated

---

## 🔄 Migration from Hardcoded Data

Your existing 8 candidates have been automatically migrated to the database:

1. Kate Harrison (Mayor)
2. Terry Taplin (District 2)
3. Shoshana O'Keefe (District 5)
4. Logan Bowle (Mayor)
5. Ben Bartlett (District 3)
6. Nilang Gor (District 5)
7. Brent Blackaby (District 6)
8. Andy Katz (District 6)

All their data (education, experience, policies, social media, etc.) has been preserved.

---

## ✅ Testing the Setup

### 1. Test Backend API
```bash
# Get all candidates
curl http://localhost:5002/api/candidates
```

### 2. Test Frontend Integration
1. Go to **http://localhost:3000/candidate_profile**
2. You should see all candidates loaded from the database
3. Click on different candidates to view their profiles

### 3. Test Admin Interface
1. Go to **http://localhost:3000/admin**
2. Try adding a new candidate
3. Edit an existing candidate
4. Refresh the candidate profile page to see changes

---

## 📝 Adding a New Candidate (Step by Step)

### Via Admin Interface (Recommended)

1. Navigate to **http://localhost:3000/admin**
2. Scroll to the "Add New Candidate" form
3. Fill in required fields (marked with *)
   - Name
   - Position (e.g., "Mayor Candidate", "City Council District 1 Candidate")
4. Add optional information:
   - Party affiliation
   - Biography
   - Education (click "+ Add Education" for multiple entries)
   - Experience
   - Endorsements
   - Policies (with priority sliders)
   - Social media links
5. Click "Create Candidate"
6. The candidate will appear in the list and be immediately available on the site

### Via API (For Developers)

```bash
curl -X POST http://localhost:5002/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "position": "City Council District 4 Candidate",
    "party": "Democrat",
    "biography": "John is a longtime Berkeley resident...",
    "education": ["UC Berkeley, JD"],
    "experience": ["Attorney at Law", "Community Board Member"],
    "endorsements": ["Bar Association"],
    "policies": [
      {
        "title": "Legal Reform",
        "description": "Improve access to justice...",
        "priority": 80
      }
    ],
    "socialMedia": {
      "website": "https://www.johnsmith.org",
      "email": "john@johnsmith.org"
    }
  }'
```

---

## 🔒 Security Notes

### What's Secure Now
- API keys stored in `.env` files (not in code)
- Database file stored on backend (not accessible from frontend)
- API endpoints properly validate data before inserting

### TODO for Production
- [ ] Add authentication to admin interface (password protection)
- [ ] Add rate limiting to API endpoints
- [ ] Use a more robust database (PostgreSQL, MySQL)
- [ ] Add API key authentication for write operations
- [ ] Implement HTTPS for production deployment

---

## 🐛 Troubleshooting

### Database doesn't exist
**Solution**: The database is created automatically when you start the backend. If it's missing:
```bash
cd backend
node db/database.js
```

### "No candidates found" on profile page
**Solution**: Run the seed script:
```bash
cd backend
npm run seed
```

### API returns 404
**Solution**: Make sure backend is running on port 5002:
```bash
cd backend
npm start
```

### Seed script says "already contains candidates"
**Solution**: The database already has data. To reset:
```bash
# Delete database and reseed
cd backend
rm db/betterballot.db
npm run seed
```

---

## 📊 Next Steps

### Recommended Enhancements

1. **Elections API Integration**
   - Update `ElectionDetails.js` to fetch from `/api/elections`
   - Seed elections data into database
   - Link candidates to elections via junction table

2. **Photo Upload**
   - Add file upload to admin interface
   - Store photos in `/public/uploads` or cloud storage
   - Update `photo_url` field in database

3. **Authentication**
   - Add login system for admin interface
   - Use JWT tokens for API authentication
   - Implement role-based access control

4. **Search & Filtering**
   - Add search bar to admin interface
   - Filter candidates by position, party, district
   - Add pagination for large candidate lists

5. **Import/Export**
   - Export candidates to CSV/JSON
   - Import candidates from spreadsheet
   - Bulk operations interface

---

## 📞 Support

For questions or issues with the database setup:
1. Check this documentation
2. Review the code comments in `backend/db/database.js`
3. Examine the API routes in `backend/routes/candidates.js`
4. Test API endpoints using tools like Postman or cURL

---

## 🎉 Summary

You now have a fully functional database-backed candidate management system!

**Key Benefits:**
- ✅ Secure storage of candidate data
- ✅ Easy-to-use admin interface
- ✅ RESTful API for programmatic access
- ✅ Automatic candidate profile generation
- ✅ No code changes needed to add/edit candidates
- ✅ Scalable architecture for future enhancements

**Access Points:**
- Admin Interface: `http://localhost:3000/admin`
- Candidate Profiles: `http://localhost:3000/candidate_profile`
- API Documentation: This file
