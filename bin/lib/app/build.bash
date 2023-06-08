#!/usr/bin/env bash
# shellcheck source=node.bash
# shellcheck source=install.bash

# Example: run build [--from-scratch]
# Example: run build docker [--from-scratch]
build() {
  # TODO:improve add docker autocompletion
  # docker way
  if [ "${1:-}" == 'docker' ]; then
    if [ "${2:-}" == '--from-scratch' ]; then
      docker rmi tact-app/web:local || true
    fi
    docker build \
      --build-arg token="$(git config fontawesome.token)" \
      -f Dockerfile \
      -t tact-app/web:local .
    return
  fi

  # local way
  [ "${1:-}" == '--from-scratch' ] && rm -rf .next && install "${@}"
  @node npm run build
}