-- BetterBallot Database Schema
-- SQLite Database for storing candidate and election information

-- Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    party TEXT,
    photo_url TEXT,
    biography TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Education Table
CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    institution TEXT NOT NULL,
    degree TEXT,
    year TEXT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    organization TEXT,
    description TEXT,
    start_year TEXT,
    end_year TEXT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Endorsements Table
CREATE TABLE IF NOT EXISTS endorsements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    organization TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Policies Table
CREATE TABLE IF NOT EXISTS policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority INTEGER DEFAULT 50,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Social Media Table
CREATE TABLE IF NOT EXISTS social_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL UNIQUE,
    website TEXT,
    email TEXT,
    twitter TEXT,
    facebook TEXT,
    instagram TEXT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Recent Posts Table
CREATE TABLE IF NOT EXISTS recent_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    platform TEXT NOT NULL,
    content TEXT NOT NULL,
    link TEXT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Elections Table
CREATE TABLE IF NOT EXISTS elections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    office TEXT NOT NULL,
    description TEXT,
    district TEXT,
    election_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Election Candidates Junction Table
CREATE TABLE IF NOT EXISTS election_candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    election_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE(election_id, candidate_id)
);

-- Zipcodes Table
CREATE TABLE IF NOT EXISTS zipcodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    election_id INTEGER NOT NULL,
    zipcode TEXT NOT NULL,
    FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_candidates_name ON candidates(name);
CREATE INDEX IF NOT EXISTS idx_election_candidates_election ON election_candidates(election_id);
CREATE INDEX IF NOT EXISTS idx_election_candidates_candidate ON election_candidates(candidate_id);
CREATE INDEX IF NOT EXISTS idx_zipcodes_zipcode ON zipcodes(zipcode);
CREATE INDEX IF NOT EXISTS idx_elections_district ON elections(district);
