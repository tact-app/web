> # 🖥️ The Tact web application
>
> The web version of the service for desktops.

## Quick Start

Requirements:

- [Docker Desktop][Docker].
- Access tokens for
  - [Font Awesome][]
  - [Sentry][]
  - [Vercel][]

[Docker]:         https://www.docker.com/products/docker-desktop/
[Font Awesome]:   https://fontawesome.com/
[Sentry]:         https://sentry.io/welcome/
[Vercel]:         https://vercel.com/

```bash
$ alias run='./Taskfile'
$ alias activate='source bin/activate'
$ activate && run setup

$ $(sleep 3; open http://localhost:3000) &; npm start
```

## Manage secrets

You can update tokens by the following commands

```bash
$ run set_fontawesome_token
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

$ $(sleep 3; open http://localhost:3000) &; npm run start
```

### Local development with the Docker

You could use [Docker CLI][] to build a deterministic environment

```bash
$ run install [--from-scratch]
$ run dev
$ run build [--from-scratch]
$ run start [--from-scratch]

$ $(sleep 5; open http://localhost:3000) &; run start

$ run npm ci --ignore-scripts --include=dev
$ run npm ...
```

### Local development inside the Docker

You could use [Docker CLI][] to build an isolated environment

```bash
$ run build docker [--from-scratch]
$ run start docker [--from-scratch]

$ $(sleep 3; open http://localhost:3000) &; run start docker

$ run isolated
```

## Tools

### Update

```bash
$ run refresh
```

### Installation

```bash
$ run tools npm ci
$ run whoami
```

### Sentry CLI
**Useful:** [docs][Sentry CLI], [src](https://github.com/getsentry/sentry-cli)

```bash
$ activate

$ run sentry --help
```

### Vercel CLI
**Useful:** [docs][Vercel CLI], [src](https://github.com/vercel/vercel)

```bash
$ activate
$ run vercel link
$ run vercel deploy

$ run vercel help
```

You can avoid using the token parameter when working with these commands,
it's substituted automatically under the hood.

[Docker CLI]:       https://docs.docker.com/engine/reference/commandline/cli/
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

## License

GNU Affero General Public License v3.0 or later.
See [COPYING](COPYING) to see the full text.

We use [CLA assistant][] to sign copyright agreements while contributing.
See [CLA][] to see the full text.

[CLA]:                https://gist.github.com/kamilsk/44221b6834a6cdc273b5e3411224f8be
[CLA assistant]:      https://cla-assistant.io/tact-app/web
[CLA assistant.src]:  https://github.com/cla-assistant/cla-assistant

<p align="right">made with ❤️ for everyone</p>
