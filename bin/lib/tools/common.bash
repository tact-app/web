#!/usr/bin/env bash

# Example: run tools npm i vercel@latest
# Example: run tools npm ci
tools() {
  (cd tools && "${@}")
}

# TODO:refactor make it dynamic, based on available tools
whoami() {
  echo "You are $(git config user.name) <$(git config user.email)>"

  echo "* Docker ------------------------------------------"
  docker version

  echo "* Graphite ----------------------------------------"
  gt --version

  echo "* Sentry ------------------------------------------"
  sentry --version

  echo "* Vercel ------------------------------------------"
  vercel whoami
}
