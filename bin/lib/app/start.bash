#!/usr/bin/env bash
# shellcheck source=build.bash  # build
# shellcheck source=config.bash # $config
# shellcheck source=node.bash   # @node

# Example: run start [--from-scratch]
# Example: run start docker [--from-scratch]
start() {
  # docker way
  if [ "${1:-}" == 'docker' ]; then
    [ "${2:-}" == '--from-scratch' ] && build docker "${@:2}"
    docker run \
      --rm -it \
      -p "127.0.0.1:${config['port']}":3000 \
      tact-app/web:local
    return
  fi

  # local way
  [ "${1:-}" == '--from-scratch' ] && build "${@}"
  @node -p "127.0.0.1:${config['port']}":3000 -- npm run start
}
