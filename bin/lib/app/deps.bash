#!/usr/bin/env bash
# shellcheck source=../docker/node/install.bash # install
# shellcheck source=../tools/tools.bash         # tools
# shellcheck source=../utils/npm.bash           # @consistent @lock
# shellcheck source=../utils/print.bash         # @fatal

deps() {
  local cmd=${1:-install}
  case "${cmd}" in
  check) [ "$(depcheck)" == 'No depcheck issue' ] ;;
  install) if ! @consistent; then install && @lock; fi ;;
  docs) docs install ;;
  tools) tools install ;;
  *) @fatal unknown subcommand "${cmd}" ;;
  esac
}
