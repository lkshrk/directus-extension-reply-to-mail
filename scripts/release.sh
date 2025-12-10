#!/bin/bash

# Script to create a new release
# Usage: ./scripts/release.sh [patch|minor|major]

if [ -z "$1" ]; then
    echo "Usage: $0 [patch|minor|major]"
    echo "Example: $0 patch"
    exit 1
fi

VERSION_TYPE=$1

# Update version in package.json
npm version $VERSION_TYPE

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")

# Create git tag
git tag v$NEW_VERSION

# Push changes and tags
git push origin main --tags

echo "Release v$NEW_VERSION created and pushed!"
echo "GitHub Actions will now create the release and publish to npm."
