#!/usr/bin/env python3
"""
Example usage script for Better Ballot Backend API
"""
import requests
import json
from datetime import date

# API base URL
BASE_URL = "http://localhost:8000"

def print_response(response, title):
    """Helper function to print API responses"""
    print(f"\n=== {title} ===")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
    print("=" * 50)

def main():
    """Main function demonstrating API usage"""
    print("Better Ballot Backend API Example")
    print("Make sure the server is running on http://localhost:8000")
    
    # 1. Health check
    response = requests.get(f"{BASE_URL}/health")
    print_response(response, "Health Check")
    
    # 2. Create an election
    election_data = {
        "name": "Berkeley Municipal Election 2024",
        "date": "2024-11-05",
        "jurisdiction": "Berkeley, CA"
    }
    response = requests.post(f"{BASE_URL}/api/admin/elections", json=election_data)
    print_response(response, "Create Election")
    
    if response.status_code == 200:
        election_id = response.json()["id"]
        
        # 3. Create a candidate
        candidate_data = {
            "election_id": election_id,
            "full_name": "Kate Harrison",
            "office": "Mayor",
            "district": "District 4",
            "party": "Democrat",
            "photo_url": "https://example.com/kate-harrison.jpg"
        }
        response = requests.post(f"{BASE_URL}/api/admin/candidates", json=candidate_data)
        print_response(response, "Create Candidate")
        
        if response.status_code == 200:
            candidate_id = response.json()["id"]
            
            # 4. Create a profile for the candidate
            profile_data = {
                "candidate_id": candidate_id,
                "bio_md": "Kate Harrison has served on the Berkeley City Council since 2017. She is a strong advocate for affordable housing and environmental protection.",
                "policies_json": {
                    "housing": {
                        "title": "Affordable Housing",
                        "description": "Expand affordable housing options and protect renters",
                        "priority": 90
                    },
                    "environment": {
                        "title": "Environmental Protection",
                        "description": "Combat climate change and protect local ecosystems",
                        "priority": 85
                    },
                    "transportation": {
                        "title": "Public Transportation",
                        "description": "Improve public transit and bike infrastructure",
                        "priority": 80
                    }
                },
                "website": "https://www.kateharrison.info",
                "email": "kate@kateharrison.info",
                "twitter": "https://twitter.com/KateHarrisonD4",
                "facebook": "https://facebook.com/kateharrisonberkeley",
                "instagram": "https://instagram.com/kateharrison"
            }
            response = requests.post(f"{BASE_URL}/api/admin/profiles", json=profile_data)
            print_response(response, "Create Profile")
            
            # 5. Get all elections
            response = requests.get(f"{BASE_URL}/api/elections")
            print_response(response, "Get All Elections")
            
            # 6. Get election with candidates
            response = requests.get(f"{BASE_URL}/api/elections/{election_id}")
            print_response(response, "Get Election with Candidates")
            
            # 7. Get all candidates
            response = requests.get(f"{BASE_URL}/api/candidates")
            print_response(response, "Get All Candidates")
            
            # 8. Get specific candidate with profile
            response = requests.get(f"{BASE_URL}/api/candidates/{candidate_id}")
            print_response(response, "Get Candidate with Profile")
            
            # 9. Filter candidates by office
            response = requests.get(f"{BASE_URL}/api/candidates?office=Mayor")
            print_response(response, "Filter Candidates by Office")
            
            # 10. Update candidate
            update_data = {"party": "Democratic Party"}
            response = requests.put(f"{BASE_URL}/api/admin/candidates/{candidate_id}", json=update_data)
            print_response(response, "Update Candidate")
            
            # 11. Update profile
            profile_update = {"bio_md": "Updated biography for Kate Harrison"}
            response = requests.put(f"{BASE_URL}/api/admin/profiles/{candidate_id}", json=profile_update)
            print_response(response, "Update Profile")
            
            print("\n=== API Demo Complete ===")
            print("You can now:")
            print("1. Visit http://localhost:8000/docs for interactive API documentation")
            print("2. Connect to http://localhost:8000/api/updates/candidates for real-time updates")
            print("3. Use the frontend to interact with this data")

if __name__ == "__main__":
    main() 