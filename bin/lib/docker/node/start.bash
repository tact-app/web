# shellcheck source=../../config/global.bash  # $config
# shellcheck source=build.bash                # build
# shellcheck source=node.bash                 # @node
# shellcheck source=../../git/core.bash       # @root

# Example: run start [--from-scratch]
# Example: run start docker [--from-scratch]
start() {
  local port="${config['port']}"
  @busy "${port}" && @fatal the port "${port}" is busy

  # docker way
  if [ "${1:-}" == 'docker' ]; then
    [ "${2:-}" == '--from-scratch' ] && build docker "${@:2}"
    docker run \
      --rm -it \
      --env-file "$(@root)/.env" \
      -p "127.0.0.1:${port}":3000 \
      "${config['image']}"
    return
  fi

  # local way
  [ "${1:-}" == '--from-scratch' ] && build "${@}"
  @node -p "127.0.0.1:${port}":3000 -- npm run start
}
