#!/bin/sh

# Create the database if it doesn't exist
echo "Checking and creating database if necessary..."
node dist/utils/create-db.js || { echo "Failed to create the database"; exit 1; }

# Start the application
echo "Starting the app..."
node dist/main || { echo "App failed to start"; exit 1; }
