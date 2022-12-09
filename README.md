> # 🏃‍♂️ Tact.js
>
> The next-generation Time Management Software.

## Quick Start

Requirements:

- [Docker Desktop][Docker].
- Tokens for [Font Awesome][], [Okteto][], and [Vercel][] before you start.
  - Access provided by [1Password][].

[1Password]:      https://1password.com/
[Docker]:         https://www.docker.com/products/docker-desktop/
[Font Awesome]:   https://fontawesome.com/
[Okteto]:         https://www.okteto.com/
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
$ run set_vercel_token

$ run env # dump updated tokens into the .env file
```

## Deep dive

### Local development

You could use a local environment, but it's not deterministic

```bash
$ npm ci --ignore-scripts --include=dev # install deps
$ npm run dev                           # starts the application in development mode
$ npm run build                         # compiles the application for production deployment
$ npm run start                         # starts the application in production mode
# open http://localhost:3000
```

### Local development with the [Docker][]

You could use Docker to build a deterministic environment

```bash
$ run install [--from-scratch]  # install deps
$ run dev                       # starts the application in development mode
$ run build [--from-scratch]    # compiles the application for production deployment
$ run server [--from-scratch]   # starts the application in production mode
# open http://localhost:3000

$ run node 'command args...'    # execute a command in the container
$ run node inside               # open a shell in the container
```

### Local development inside the [Docker][]

You could use Docker to build an isolated environment

```bash
$ run build docker [--from-scratch]   # build the image
$ run server docker [--from-scratch]  # starts the application in the container
# open http://localhost:3000
```

## Tools

### Update

```bash
$ run refresh
```

### Installation

```bash
$ run tools npm ci  # install node tools
$ run tools okteto  # install okteto
$ run whoami        # shows your current environment context
```

### Docker Compose

```bash
$ run compose up -d   # create and start containers
$ run compose down    # stop and remove containers, networks

$ run compose --help  # see more
```

### [Okteto][]

```bash
$ activate
$ run okteto context use https://cloud.okteto.com   # set the default context
$ run okteto up                                     # launch your development environment

$ run okteto --help                                 # see more
```

You can avoid using the token parameter when working with these commands,
it's substituted automatically under the hood.

### [Vercel][]

```bash
$ activate
$ run vercel link       # link current directory to a Vercel Project
$ run vercel deploy     # deploy the current directory to Vercel

$ run vercel help       # see more
```

You can avoid using the token parameter when working with these commands,
it's substituted automatically under the hood.

## Documentation

- [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/).
- [Okteto CLI](https://www.okteto.com/docs/cloud/okteto-cli/).
- [Vercel CLI](https://vercel.com/docs/cli).

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

<p align="right">made with ❤️ for everyone</p>
