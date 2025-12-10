# directus extension: replyTo mail

Custom operation to send emails. It uses the Directus Nodemailer service and provides a replyTo option.

## Usage

1. Install the extension using a package manager or from the Marketplace:

```sh
npm install directus-extension-reply-to-mail
```

## Development & Release

### Creating a Release

To create a new release:

1. Make your changes and commit them
2. Run the release script:

```sh
./scripts/release.sh patch   # for patch version (x.y.Z)
./scripts/release.sh minor   # for minor version (x.Y.0)
./scripts/release.sh major   # for major version (X.0.0)
```

This will:
- Update the version in package.json
- Create a git tag (v1.0.0 format)
- Push the changes and tags to GitHub
- Trigger the GitHub Actions workflow to build and publish

### GitHub Actions Workflow

The repository includes a GitHub Actions workflow (`.github/workflows/release.yml`) that:
- Triggers on push of tags matching `v*.*.*` pattern
- Builds the extension
- Creates a GitHub release with the built artifacts
- Publishes to npm using **trusted publishing** (no NPM_TOKEN required)

The workflow will automatically publish to npm when you push a version tag (e.g., `v1.0.0`).

## Credits

Part of the source code is borrowed from [Directus](https://github.com/directus/directus).


## License

[MIT License](LICENSE)
