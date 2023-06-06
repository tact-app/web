#!/usr/bin/env bash
# shellcheck source=../core/git.bash # @root

# Example: run tools install
# Example: run tools npm i vercel@latest
# Example: run tools npm ci
tools() {
  pushd "$(@root)/tools" >/dev/null || exit 1
  trap 'popd >/dev/null' ERR
  "${@}"
  popd >/dev/null || exit 1
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
