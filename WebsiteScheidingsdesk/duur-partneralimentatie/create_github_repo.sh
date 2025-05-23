#!/bin/bash
# This script creates a GitHub repository and pushes the local content to it
# Usage: GITHUB_TOKEN=your_token ./create_github_repo.sh

if [[ -z "$GITHUB_TOKEN" ]]; then
  echo "Error: GitHub token not set. Please set the GITHUB_TOKEN environment variable."
  echo "Example: GITHUB_TOKEN=your_token ./create_github_repo.sh"
  exit 1
fi

echo "Creating GitHub repository..."
curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{"name":"duur-partneralimentatie","private":true,"description":"Calculator voor het berekenen van de duur van partneralimentatie volgens de wet"}' \
  > /dev/null

if [ $? -ne 0 ]; then
  echo "Failed to create GitHub repository. Please check your token and try again."
  exit 1
fi

echo "Setting up remote..."
git remote add origin https://github.com/HansKurvers/duur-partneralimentatie.git

echo "Pushing to GitHub..."
git push -u origin main

echo "Repository successfully created and code pushed to GitHub!"
echo "Visit https://github.com/HansKurvers/duur-partneralimentatie to see your repository."