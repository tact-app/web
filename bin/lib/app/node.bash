#!/usr/bin/env bash

@node() {
  local root dir
  root=$(git rev-parse --show-toplevel)
  dir=$(pwd)

  local args=(
    --rm
    -it
    -v "${root}":/app
    -w /app"${dir#"${root}"}"
    --entrypoint=/app/bin/lib/entrypoint.sh
    --env-file "$(git rev-parse --show-toplevel)/.env"
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

  docker run "${args[@]}" node:18-alpine "${@}"
}

# run npm lint -> run npm run lint
@npm() { @node npm "${@}"; }
