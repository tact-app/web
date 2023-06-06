#!/usr/bin/env bash
# shellcheck source=../docs/docs.bash   # docs
# shellcheck source=../tools/tools.bash # tools
# shellcheck source=../utils/stale.bash # @consistent @lock

@deps() {
  case "${1}" in
  check) depcheck --ignores=pre-commit,prettier,@fortawesome/fontawesome-pro,@types/node ;;
  install) if ! @consistent; then install && @lock; fi ;;
  docs) if ! @consistent docs; then docs install && @lock docs; fi ;;
  tools) if ! @consistent tools; then tools install && @lock tools; fi ;;
  esac
}
