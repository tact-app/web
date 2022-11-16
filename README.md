> # 🏃‍♂️ Tact.js
>
> The next-generation Time Management Software.

## Quick Start

Please prepare tokens for Font Awesome, Okteto, and Vercel before you start.

```bash
$ alias run='./Taskfile'
$ alias activate='source bin/activate'
$ run setup
```

After setup, you can choose the following commands:

```bash
$ run server
# or
$ run vercel dev
# or
$ run okteto up
```

### Useful commands

#### Tools

```bash
$ run tools npm ci
# install npm tools

$ run tools go
# install okteto
```

Then, you can use `vercel` and `okteto` commands:

```bash
$ run vercel ls
$ run okteto status
```

You can avoid using the token parameter when working with these commands,
it's substituted automatically under the hood.

## Documentation

- [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/).
- [Okteto CLI](https://www.okteto.com/docs/cloud/okteto-cli/).
- [Vercel CLI](https://vercel.com/docs/cli).

<p align="right">made with ❤️ for everyone</p>
