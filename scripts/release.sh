#!/usr/bin/env bash
set -euo pipefail

# Script to create a new release using pnpm
# Usage: ./scripts/release.sh [patch|minor|major]

usage() {
    echo "Usage: $0 [patch|minor|major]"
    echo "Example: $0 patch"
    exit 1
}

if [ $# -ne 1 ]; then
    usage
fi

VERSION_TYPE="$1"

# Ensure we're on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Error: Releases must be created from the main branch"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Ensure working tree is clean
if ! git diff-index --quiet HEAD --; then
    echo "Error: There are uncommitted changes"
    echo "Commit or stash your changes before creating a release"
    git status --short
    exit 1
fi

# Read current version
if ! CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null); then
    echo "Error: unable to read version from package.json"
    exit 1
fi
echo "Current version: $CURRENT_VERSION"

# Bump version with pnpm without creating git commit/tag
echo "Bumping version ($VERSION_TYPE) using pnpm --no-git-tag-version..."
pnpm version "$VERSION_TYPE" --no-git-tag-version

# Get updated version
if ! NEW_VERSION=$(node -p "require('./package.json').version" 2>/dev/null); then
    echo "Error: unable to read new version from package.json after bump"
    # Attempt to revert any partial changes
    git checkout -- package.json || true
    exit 1
fi
echo "New version: $NEW_VERSION"

if [ "$CURRENT_VERSION" = "$NEW_VERSION" ]; then
    echo "Error: version did not change ($CURRENT_VERSION)"
    exit 1
fi

TAG_NAME="v$NEW_VERSION"

# If tag already exists locally or remotely, revert local bump and exit with instructions
if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
    echo "Error: Tag $TAG_NAME already exists locally"
    echo "Reverting local version bump..."
    git checkout -- package.json || true
    if [ -f pnpm-lock.yaml ]; then
        git checkout -- pnpm-lock.yaml || true
    fi
    echo "Delete the existing tag with 'git tag -d $TAG_NAME' and 'git push origin :refs/tags/$TAG_NAME' if you want to recreate it"
    exit 1
fi

# Also check remote tags (lightweight check)
if git ls-remote --tags origin | grep -q "refs/tags/$TAG_NAME$"; then
    echo "Error: Tag $TAG_NAME already exists on the remote 'origin'"
    echo "Reverting local version bump..."
    git checkout -- package.json || true
    if [ -f pnpm-lock.yaml ]; then
        git checkout -- pnpm-lock.yaml || true
    fi
    echo "Delete the existing remote tag with 'git push origin :refs/tags/$TAG_NAME' if you want to recreate it"
    exit 1
fi

# Stage changed files
git add package.json
if [ -f pnpm-lock.yaml ]; then
    git add pnpm-lock.yaml
fi

# Commit manually
COMMIT_MSG="chore(release): $TAG_NAME"
git commit -m "$COMMIT_MSG"

# Create tag
git tag "$TAG_NAME"

# Push commit and tag(s)
echo "Pushing commit to origin main..."
git push origin main

echo "Pushing tag $TAG_NAME to origin..."
git push origin "$TAG_NAME"
