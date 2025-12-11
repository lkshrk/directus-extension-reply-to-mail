# Testing Guide for Directus Extension Reply-to-Mail

This guide explains how to run and understand the automated tests for the Directus extension.

## Test Setup

The extension uses **Jest** with **TypeScript** support for testing. The test configuration handles ES Modules properly since the Directus extensions SDK uses ES Modules.

## Available Test Scripts

- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode (auto-rerun on changes)
- `npm run test:coverage` - Run tests with coverage reporting

## Test Structure

### Test Files Location

All test files are located in `src/__tests__/`:

- `api.test.ts` - Tests for the API functionality (email sending, markdown processing)
- `app.test.ts` - Tests for the UI configuration and options
- `setup.ts` - Test setup and mocking configuration

### Test Coverage

The current test suite provides:
- **100% statement coverage**
- **100% function coverage**
- **81.25% branch coverage**
- **100% line coverage**

## What's Tested

### API Tests (`api.test.ts`)

1. **Markdown Processing (`md()` function)**
   - Basic markdown to HTML conversion
   - Empty string handling
   - XSS protection (sanitization)
   - Markdown formatting (bold, italic)
   - Link handling

2. **Operation API Configuration**
   - Proper export and ID verification
   - Different email types (markdown, wysiwyg, template)
   - Non-string body handling (JSON conversion)
   - Error handling for email sending failures

### App Tests (`app.test.ts`)

1. **Operation Configuration**
   - Correct operation ID, icon, name, and description
   - Presence of overview and options functions

2. **Overview Function**
   - Complete options rendering
   - Array of email addresses handling
   - Missing replyTo handling
   - Default type handling

3. **Options Function**
   - Field configurations for all input fields
   - Conditional field visibility based on type
   - Proper interface selection for body field
   - Template field validation

## Running Tests

### Basic Test Run

```bash
npm test
```

### Watch Mode (Development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

This will generate a coverage report in the `coverage` directory and display a summary in the console.

## Test Configuration

The Jest configuration is in `jest.config.cjs` and includes:

- TypeScript support via `ts-jest`
- ES Modules support for Directus SDK
- Proper mocking of Directus extensions
- Coverage collection for all source files

## Adding New Tests

To add new tests:

1. Create a new `.test.ts` file in `src/__tests__/`
2. Import the module/function you want to test
3. Use Jest's testing APIs (`describe`, `it`, `expect`)
4. Mock any external dependencies as needed

Example:

```typescript
import { someFunction } from '../some-module';

describe('Some Module', () => {
  it('should do something', () => {
    const result = someFunction('input');
    expect(result).toBe('expected output');
  });
});
```

## Mocking Strategy

The test setup mocks the Directus extensions to avoid dependency issues:

- `@directus/extensions` is mocked to return simple configurations
- External services are mocked in individual tests
- Console methods are mocked to prevent test output pollution

## Continuous Integration

The extension includes a comprehensive GitHub Actions workflow that runs automatically on every push and pull request.

### Workflow Details

The workflow (`.github/workflows/test-and-build.yml`) performs:

1. **Validation**: Uses `create-directus-extension validate` to ensure proper extension structure
2. **Testing**: Runs the full test suite with coverage
3. **Building**: Compiles the extension to verify production readiness
4. **Artifact Upload**: Stores coverage reports and build artifacts

### Workflow Triggers

- **Push events**: Runs on every push to any branch
- **Pull requests**: Runs on every pull request to any branch

### Viewing Results

You can view the CI results in the GitHub Actions tab:

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Select the "Test and Build" workflow
4. View the latest runs and download artifacts

### Local Validation

You can run the same validation locally:

```bash
# Validate extension structure
./scripts/validate.sh

# Run the full CI pipeline locally
npm ci && ./scripts/validate.sh && npm test && npm run build
```

### Customizing the Workflow

The workflow can be customized by editing `.github/workflows/test-and-build.yml`:

- Change Node.js version
- Add additional test steps
- Modify artifact retention
- Add deployment steps for production branches

## Troubleshooting

### ES Modules Issues

If you encounter ES Modules related errors:

1. Ensure `package.json` has `"type": "module"`
2. Check that Jest config uses the ESM preset
3. Verify that Directus extensions are properly mocked

### TypeScript Issues

If you have TypeScript compilation errors in tests:

1. Check that `tsconfig.json` has proper settings
2. Ensure test files have the `.test.ts` extension
3. Verify that all types are properly imported

## Test Maintenance

- Keep tests updated when adding new features
- Update tests when changing existing functionality
- Add tests for bug fixes to prevent regressions
- Run tests before committing changes

The test suite provides a solid foundation for ensuring the reliability and correctness of the Directus extension.