#!/bin/bash

# Script to create a new release
# Usage: ./scripts/release.sh [patch|minor|major]

if [ -z "$1" ]; then
    echo "Usage: $0 [patch|minor|major]"
    echo "Example: $0 patch"
    exit 1
fi

# Check if we're on the main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Error: Releases must be created from the main branch"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "Error: There are uncommitted changes"
    echo "Commit or stash your changes before creating a release"
    git status --short
    exit 1
fi

VERSION_TYPE=$1

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")

# Update version in package.json
npm version $VERSION_TYPE

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")

echo "Creating release: $CURRENT_VERSION → $NEW_VERSION"

# Create git tag (check if it already exists first)
if git rev-parse "v$NEW_VERSION" >/dev/null 2>&1; then
    echo "Error: Tag v$NEW_VERSION already exists"
    echo "Delete the existing tag with 'git tag -d v$NEW_VERSION' and 'git push origin :refs/tags/v$NEW_VERSION' if you want to recreate it"
    exit 1
fi

git tag v$NEW_VERSION

# Push changes and tags
git push origin main --tags

echo "Release v$NEW_VERSION created and pushed!"
echo "GitHub Actions will now create the release and publish to npm."
