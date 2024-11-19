#!/bin/bash

# Build script for DocHandler
echo "Building DocHandler..."

# Clean previous builds
rm -rf dist releases

# Install dependencies
npm install

# Build application
npm run build

# Package for all platforms
npm run package

# Create distribution archives
cd releases
for file in dochandler-*; do
    if [[ $file == *linux* ]]; then
        tar -czf "$file.tar.gz" "$file" "../scripts/install.sh" "../.env.example"
    elif [[ $file == *win* ]]; then
        zip -r "$file.zip" "$file" "../scripts/install.ps1" "../.env.example"
    elif [[ $file == *macos* ]]; then
        tar -czf "$file.tar.gz" "$file" "../scripts/install.sh" "../.env.example"
    fi
done

echo "Build complete! Distribution packages are available in the releases directory."