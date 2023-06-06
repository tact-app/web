#!/usr/bin/env bash

_os=$(uname -s | tr '[:upper:]' '[:lower:]')
_arch=$(uname -m | tr '[:upper:]' '[:lower:]')

# TODO:refactor inject while code generation
paths=(
  "$(pwd)/node_modules/.bin"
  "$(pwd)/docs/node_modules/.bin"
  "$(pwd)/tools/node_modules/.bin"
)
for path in "${paths[@]}"; do
  if [[ ":${PATH}:" != *":${path}:"* ]]; then
    export PATH="${path}:${PATH}"
  fi
done

declare -A config
config['dryrun']=false
config['port']=3000

@handle() {
  local arg
  for arg in "${@}"; do
    case "${arg}" in
    -d | --dry-run)
      config['dryrun']=true
      shift
      ;;
    -p | --port)
      config['port']="${2}"
      shift 2
      ;;
    *) break ;;
    esac
  done

  echo "${@}"
}
