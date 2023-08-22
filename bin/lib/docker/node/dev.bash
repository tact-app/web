# shellcheck source=../../config/global.bash  # $config
# shellcheck source=node.bash                 # @node
# shellcheck source=../../git/core.bash       # @root

dev() {
  local port="${config['port']}"
  @busy "${port}" && @fatal the port "${port}" is busy

  @node -p "127.0.0.1:${port}":3000 -- npm run dev;
}

@isolated() {
  local real root
  real=$(pwd)
  root=$(@root)

  local args=(
    --rm
    -it
    -v "${root}":/app
    -w /app"${real#"${root}"}"
    --entrypoint=/app/bin/lib/entrypoint.sh
    --env-file "${root}/.env"
  )

  if [[ " ${*} " =~ ' -- ' ]]; then
    local arg
    for arg in "${@}"; do
      shift
      case "${arg}" in
      --) break ;;
      *) args+=("${arg}") ;;
      esac
    done
  fi

  docker run "${args[@]}" "node:${config['node']}" "${@}"
}
