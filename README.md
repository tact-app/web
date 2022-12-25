> # 🖥️ The Tact web application
>
> The web version of the service for desktops.

## Quick Start

Requirements:

- [Docker Desktop][Docker].
- Tokens for
  - [Font Awesome][]
  - [Okteto][]
  - [Sentry][]
  - [Vercel][]

[Docker]:         https://www.docker.com/products/docker-desktop/
[Font Awesome]:   https://fontawesome.com/
[Okteto]:         https://www.okteto.com/
[Sentry]:         https://sentry.io/welcome/
[Vercel]:         https://vercel.com/

```bash
$ alias run='./Taskfile'
$ alias activate='source bin/activate'
$ activate && run setup

$ open http://localhost:3000 && run server
```

## Manage secrets

You can update tokens by the following commands

```bash
$ run set_fontawesome_token
$ run set_okteto_token
$ run set_sentry_token
$ run set_vercel_token

$ run env # dump updated tokens into the .env file
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

### Local development with the [Docker][]

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

### Local development inside the [Docker][]

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
$ run tools okteto
$ run whoami
```

### [Docker Compose][]

```bash
$ run compose up -d
$ run compose down

$ run compose --help
```

### [Okteto CLI][]

```bash
$ activate
$ run okteto context use https://cloud.okteto.com
$ run okteto up

$ run okteto --help
```

You can avoid using the token parameter when working with these commands,
it's substituted automatically under the hood.

### [Sentry CLI][]

```bash
$ activate

$ run sentry --help
```

### [Vercel CLI][]

```bash
$ activate
$ run vercel link
$ run vercel deploy

$ run vercel help
```

You can avoid using the token parameter when working with these commands,
it's substituted automatically under the hood.

[Docker CLI]:       https://docs.docker.com/engine/reference/commandline/cli/
[Docker Compose]:   https://docs.docker.com/compose/reference/
[Okteto CLI]:       https://www.okteto.com/docs/cloud/okteto-cli/.
[Sentry CLI]:       https://docs.sentry.io/product/cli/.
[Vercel CLI]:       https://vercel.com/docs/cli.

## Tips and tricks

### [Vercel][] shows inconsistent state of dependencies

You can drop Vercel's cache by running:

```bash
$ run vercel --force
```

### Something went wrong with CI/CD

```bash
$ run deploy
$ run deploy prod
```

## License

GNU Affero General Public License v3.0 or later.

See [COPYING](COPYING) to see the full text.

<p align="right">made with ❤️ for everyone</p>
