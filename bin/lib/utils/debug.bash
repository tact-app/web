#!/usr/bin/env bash
# shellcheck source=../tools/tools.bash # $path
# TODO:debt low-level component depends on top-level component

debug() {
  echo "You are $(git config user.name) <$(git config user.email)>"
  git --no-pager log -1 --pretty='Commit: %h - %s (%an at %ad)'

  echo "* Docker ------------------------------------------"
  docker version

  echo "* Graphite ----------------------------------------"
  gt --version

  echo "* Sentry ------------------------------------------"
  sentry --version

  echo "* Vercel ------------------------------------------"
  vercel --version
}
