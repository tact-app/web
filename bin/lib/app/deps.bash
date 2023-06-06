#!/usr/bin/env bash
# shellcheck source=../docs/docs.bash    # docs
# shellcheck source=../tools/tools.bash  # tools {depcheck}
# shellcheck source=../utils/vendor.bash # @consistent @lock
# shellcheck source=install.bash         # install

@deps() {
  case "${1}" in
  check) [ "$(depcheck)" == 'No depcheck issue' ] ;;
  install) if ! @consistent; then install && @lock; fi ;;
  docs) if ! @consistent docs; then docs npm ci && @lock docs; fi ;;
  tools) if ! @consistent tools; then tools npm ci && @lock tools; fi ;;
  esac
}
