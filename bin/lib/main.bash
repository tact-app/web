#!/usr/bin/env bash
# shellcheck source=app/config.bash # @handle
# shellcheck source=core/usage.bash # @usage

@main() {
  local args=()
  IFS=' ' read -r -a args < <(@handle "${@}")

  "${args[@]:-@usage}"
}

@main "${@}"
