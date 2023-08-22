# shellcheck source=../../config/global.bash  # $config
# shellcheck source=../../git/core.bash       # @root

@node() {
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

  docker run "${args[@]}" "node:${config['node']}-alpine" "${@}"
}

@npm() { @node npm run "${@}"; }
