#!/usr/bin/env bash

# TODO:refactor make it dynamic, based on available tools
debug() {
  echo "You are $(git config user.name) <$(git config user.email)>"

  echo "* Docker ------------------------------------------"
  docker version

  echo "* Graphite ----------------------------------------"
  gt --version

  echo "* Sentry ------------------------------------------"
  sentry --version

  echo "* Vercel ------------------------------------------"
  vercel --version
}
