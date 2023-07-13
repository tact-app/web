#!/usr/bin/env bash
# shellcheck source=install.bash        # install
# shellcheck source=../docs/docs.bash   # docs
# shellcheck source=../tools/tools.bash # tools
# shellcheck source=../utils/npm.bash   # @consistent @lock

@deps() {
  case "${1}" in
  check) [ "$(depcheck)" == 'No depcheck issue' ] ;;
  install) if ! @consistent; then install && @lock; fi ;;
  docs) docs install ;;
  tools) tools install ;;
  esac
}
