#!/bin/bash

echo "Building and running Kattenfeitjes..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the project
echo "Building project..."
npm run build

# Start the development server
echo "Starting development server..."
npm start