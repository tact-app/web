#!/usr/bin/env bash
# shellcheck source=../utils/stale.bash # @consistent @lock

@deps() {
  case "${1}" in
  check) depcheck --ignores=pre-commit,prettier,@fortawesome/fontawesome-pro,@types/node ;;

  install) if ! @consistent; then install && @lock; fi ;;

  docs)
    if ! @consistent; then
      docs install # TODO:hack cwd has been changed
      md5sum "$(pwd)"/package-lock.json >"$(pwd)"/node_modules/package.lock
    fi
    ;;

  tools) if ! @consistent tools; then tools install && @lock tools; fi ;;
  esac
}
