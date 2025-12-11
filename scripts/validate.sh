#!/bin/bash

echo "🔍 Validating Directus extension structure..."

# Check package.json exists
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found"
  exit 1
fi

# Check for Directus extension configuration
if ! grep -q '"directus:extension"' package.json; then
  echo "❌ Error: package.json missing 'directus:extension' configuration"
  exit 1
fi

# Check required extension fields
if ! grep -q '"type"' package.json; then
  echo "❌ Error: package.json missing extension type"
  exit 1
fi

# Check required source files
required_files=("src/api.ts" "src/app.ts" "src/_types.ts")
for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Error: Required file $file not found"
    exit 1
  fi
done

# Check for common exports
if ! grep -q "defineOperationApi" src/api.ts; then
  echo "⚠️  Warning: src/api.ts may be missing defineOperationApi"
fi

if ! grep -q "defineOperationApp" src/app.ts; then
  echo "⚠️  Warning: src/app.ts may be missing defineOperationApp"
fi

# Extract extension details
echo "✅ Extension structure validation passed!"
echo "📋 Extension details:"
echo "   - Type: $(grep -A 1 '"type"' package.json | grep -v '"type"' | tr -d '" ,')"
echo "   - API Entry: $(grep -A 3 '"path"' package.json | grep '"api"' | cut -d: -f2 | tr -d '" ,')"
echo "   - App Entry: $(grep -A 3 '"path"' package.json | grep '"app"' | cut -d: -f2 | tr -d '" ,')"
echo "   - Host Compatibility: $(grep -A 1 '"host"' package.json | grep -v '"host"' | tr -d '" ,' || echo 'not specified')"

exit 0
