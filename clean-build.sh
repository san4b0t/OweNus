#!/bin/bash

# Clean existing build files
rm -rf node_modules package-lock.json
rm -rf android/build android/app/build
rm -rf ios/build

# Install dependencies
npm install --legacy-peer-deps

# Build development client
echo "Starting development build..."
eas build --profile development --platform android
