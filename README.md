# directus extension: replyTo mail

Custom operation to send emails with reply-to field set. It uses the Directus Nodemailer service and extends it with a replyTo option.

## Usage

1. Install the extension using a package manager or from the Marketplace:

```sh
npm install directus-extension-reply-to-mail
```

## Testing & CI/CD

The extension includes comprehensive automated tests using Jest and a GitHub Actions workflow that runs on every push and pull request.

### Quick Start

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm run test:coverage

# Run tests in watch mode
pnpm run test:watch
```

### Local Validation

You can run the same validation locally:

```bash
# Validate extension structure
./scripts/validate.sh

# Run the full CI pipeline locally
pnpm install --frozen-lockfile && ./scripts/validate.sh && pnpm test && pnpm run build
```

## Credits

Part of the source code is borrowed from [Directus](https://github.com/directus/directus).


## License

[MIT License](LICENSE)
