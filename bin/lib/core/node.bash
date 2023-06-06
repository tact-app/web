#!/usr/bin/env bash

@node() {
  local args=(
    --rm
    -it
    -v "$(pwd)":/app
    -w /app
    --entrypoint=/app/bin/lib/entrypoint.sh
    --env-file "$(pwd)/.env"
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

@npm() {
  echo test
}

# run npm lint -> run npm run lint
npm() { @node npm "${@}"; }
