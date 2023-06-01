#!/usr/bin/env bash

set -euo pipefail

[ "${BASH_VERSINFO:-0}" -ge 4 ] || {
  echo "bash version 4 or higher is required" >&2
  exit 1
}

# TODO:refactor inject while code generation
paths=(
  "$(pwd)/node_modules/.bin"
  "$(pwd)/tools/node_modules/.bin"
)
for path in "${paths[@]}"; do
  if [[ ":${PATH}:" != *":${path}:"* ]]; then
    export PATH="${path}:${PATH}"
  fi
done

# TODO:refactor inject config into the scripts
declare -A config
config['dryrun']=false
config['port']=3000

# TODO:refactor make path relative
for script in "$(pwd)"/bin/lib/*/*.bash; do
  # shellcheck source=utils/md5sum.bash
  source "${script}"
done

function @main() {
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

  "${@:-@usage}"
}

@main "${@}"
