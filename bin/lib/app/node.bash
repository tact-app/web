#!/usr/bin/env bash

@node() {
  local args=(
    --rm
    -it
    -v "$(pwd)":/app
    -w /app
    --entrypoint=/app/bin/lib/entrypoint.sh
  )

  if [ -f .env ]; then
    args+=(--env-file .env)
  fi

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
