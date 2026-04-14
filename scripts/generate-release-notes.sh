#!/usr/bin/env bash
set -euo pipefail

# Generates categorized release notes from git log.
# Usage: ./scripts/generate-release-notes.sh <from_ref> <to_ref> [title]
#   from_ref: previous tag (empty string for initial release)
#   to_ref:   end of range (e.g. HEAD, HEAD^, or a tag)
#   title:    optional H2 heading (default: "Changes")
#
# Writes markdown to stdout.

if [ $# -lt 2 ]; then
    echo "Usage: $0 <from_ref> <to_ref> [title]" >&2
    exit 1
fi

FROM_REF="$1"
TO_REF="$2"
TITLE="${3:-Changes}"

if [ -z "$FROM_REF" ]; then
    RANGE="$TO_REF"
else
    RANGE="$FROM_REF..$TO_REF"
fi

dep_lines=()
other_lines=()

while IFS= read -r line; do
    [ -z "$line" ] && continue
    if [[ "$line" =~ ^-\ (chore|fix|feat|build|ci|refactor)\(deps\): ]] \
       || [[ "$line" =~ ^-\ Renovate ]]; then
        dep_lines+=("$line")
    else
        other_lines+=("$line")
    fi
done < <(git log --pretty=format:"- %s" "$RANGE")

echo "## $TITLE"
if [ ${#dep_lines[@]} -gt 0 ]; then
    echo
    echo "### Dependency Updates"
    printf '%s\n' "${dep_lines[@]}"
fi
if [ ${#other_lines[@]} -gt 0 ]; then
    echo
    echo "### Other Changes"
    printf '%s\n' "${other_lines[@]}"
fi
