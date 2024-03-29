![Tact.web][social.preview]

# 🖥️ Tact.web

Web version for desktops.

## Quick Start

Requirements:

- [Docker Desktop][Docker].
- Access tokens for
  - [Auth0][]
  - [Font Awesome][]
  - [GitHub][] (optional)
  - [Graphite][] (optional)
  - [Sentry][] (optional)
  - [Vercel][] (optional)

[Auth0]:          https://auth0.com/
[Docker]:         https://www.docker.com/products/docker-desktop/
[Font Awesome]:   https://fontawesome.com/
[GitHub]:         https://cli.github.com/
[Graphite]:       https://graphite.dev/
[Sentry]:         https://sentry.io/welcome/
[Vercel]:         https://vercel.com/

```bash
$ alias run=./Taskfile
$ run setup
$ run wait-for-it -q -w localhost:3000 -- open http://localhost:3000/ &
$ run start # or `run dev`
```

## Manage secrets

You can update tokens by the following commands

```bash
$ run set_auth0
$ run set_fontawesome_token
$ run set_github_token
$ run set_graphite_token
$ run set_sentry_token
$ run set_vercel_token
```

## Deep dive

### Local development

You could use a local environment, but it's not deterministic

```bash
$ npm ci --ignore-scripts --include=dev
$ npm run dev
$ npm run build
$ npm run start

$ run wait-for-it -q -w localhost:3000 -- open http://localhost:3000/ &
$ npm run start
```

### Local development with the Docker

You could use [Docker CLI][] to build a deterministic environment

```bash
$ run install [--from-scratch]
$ run dev
$ run build [--from-scratch]
$ run start [--from-scratch]

$ run wait-for-it -q -w localhost:3000 -- open http://localhost:3000/ &
$ run start

$ run npm ci --ignore-scripts --include=dev
$ run npm ...
```

### Local development inside the Docker

You could use [Docker CLI][] to build an isolated environment

```bash
$ run build docker [--from-scratch]
$ run start docker [--from-scratch]

$ run wait-for-it -q -w localhost:3000 -- open http://localhost:3000/ &
$ run start docker
```

## Tools

### Update

```bash
$ run refresh
```

### Installation

```bash
$ run tools install
```

### GitHub CLI
**Useful:** [docs][GitHub CLI], [src](https://github.com/cli/cli).

```bash
$ run gh help
$ run @workflows
```

### Graphite CLI
**Useful:** [docs][Graphite CLI], [src](https://github.com/withgraphite/graphite-cli).

```bash
$ run gt --help
```

### Sentry CLI
**Useful:** [docs][Sentry CLI], [src](https://github.com/getsentry/sentry-cli).

```bash
$ run sentry --help
```

### Vercel CLI
**Useful:** [docs][Vercel CLI], [src](https://github.com/vercel/vercel).

```bash
$ run vercel help
$ run @deployments clean
```

You can avoid using the token parameter when working with these commands,
it's substituted automatically under the hood.

[Docker CLI]:       https://docs.docker.com/engine/reference/commandline/cli/
[GitHub CLI]:       https://cli.github.com/
[Graphite CLI]:     https://graphite.dev/docs/graphite-cli
[Sentry CLI]:       https://docs.sentry.io/product/cli/
[Vercel CLI]:       https://vercel.com/docs/cli

### Manual deployment

```bash
$ run deploy
$ run deploy prod
```

## Tips and tricks

### [Vercel][] shows inconsistent state of dependencies

You can drop Vercel's cache by running:

```bash
$ run vercel --force
```

### [Font Awesome][] has failed builds after version update

Check `fontawesome-common-types`, it must be exactly one.

```bash
$ npm list | grep fortawesome
# if not, do the following
$ npm update
```

See, the [issue](https://github.com/FortAwesome/react-fontawesome/issues/366#issuecomment-1317268246).

## License

GNU Affero General Public License v3.0 or later.
See [LICENSE](LICENSE) to see the full text.

We use [CLA assistant][] to sign copyright agreements while contributing.
See [CLA][] to see the full text.

[CLA]:                https://gist.github.com/kamilsk/44221b6834a6cdc273b5e3411224f8be
[CLA assistant]:      https://cla-assistant.io/tact-app/web
[CLA assistant.src]:  https://github.com/cla-assistant/cla-assistant

<p align="right">made with ❤️ for everyone by <a href="https://www.octolab.org/">OctoLab</a></p>

[social.preview]: https://cdn.octolab.org/tact/interface.png
