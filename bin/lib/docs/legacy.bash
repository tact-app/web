#!/usr/bin/env bash

# TODO:refactor see common.bash in tools

# Example: run docs
# Example: run docs build publish
docs() {
  unset npm # TODO:hack temporary solution for GitHub Actions

  pushd docs || return 1
  trap popd EXIT

  local args=("${@}")
  if [ ${#args[@]} = 0 ]; then
    args=(install build start)
  fi

  local arg
  for arg in "${args[@]}"; do
    case "${arg}" in
    install)
      local lock file=package-lock.json
      lock=$(dirname "${file}")/node_modules/package.lock
      if [ ! -f "${lock}" ] || [ "$(cat "${lock}")" != "$(md5sum "${file}")" ]; then
        npm ci
        md5sum "${file}" >"${lock}"
      fi
      ;;

    dev)
      npx --no-install next dev
      ;;

    build)
      npx --no-install next build
      ;;

    start)
      npx --no-install next start
      ;;

    publish)
      rm -rf dist/
      TARGET=static npx --no-install next build
      ;;

    *) break ;;
    esac
  done
}
