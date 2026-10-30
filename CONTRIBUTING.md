# Contributing

Contributions are welcome: bug reports, fixes and improvements to the mail
operation.

## Reporting issues

Open an issue with your Directus version, the extension version, the flow
configuration you used, and the error or unexpected behaviour.

## Development

Requires Node.js and pnpm.

```sh
pnpm install
pnpm run dev      # rebuild on change
pnpm run link     # link into a local Directus extensions folder
```

Before opening a PR, run the same checks as CI:

```sh
pnpm install --frozen-lockfile
./scripts/validate.sh
pnpm test
pnpm run build
```

## Pull requests

- Fork, branch from `main`, and keep each PR focused on one change.
- Add or update Jest tests for new behaviour.
- Use [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `chore:`). Releases and the changelog are
  generated from commit messages by semantic-release, so the type decides the
  version bump.
- Don't edit `CHANGELOG.md` or the version in `package.json` by hand.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE).
