#!/bin/bash

# Clear NPM cache
echo "Clearing NPM cache..."
npm cache clean --force

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npx next build

echo "Done! Your application is ready for Vercel deployment."
