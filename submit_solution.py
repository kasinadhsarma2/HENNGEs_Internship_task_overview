#!/usr/bin/env python3
import requests
import json
import base64

# Load the submission JSON
with open('hennge_submission.json', 'r') as f:
    submission_data = json.load(f)

# API endpoint
url = 'https://api.challenge.hennge.com/challenges/frontend-password-validation/001'

# Your credentials with the correct email
email = 'swayampakulavsspavanakasinadha@gmail.com'
password = 'HENNGECHALLENGE'

# Generate the base64 encoded credentials
credentials = base64.b64encode(f"{email}:{password}".encode()).decode()

# Explicitly set the Authorization header with the base64 encoded credentials
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Basic {credentials}'
}

# Make the POST request with explicit Authorization header
response = requests.post(
    url,
    json=submission_data,
    headers=headers
)

# Print the response
print(f"Status code: {response.status_code}")
print(f"Response: {response.text}")