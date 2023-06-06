#!/usr/bin/env bash
# shellcheck source=../core/git.bash # @pull

refresh() {
  @pull

  @deps install
  @deps docs
  @deps tools
}

@deps() {
  case "${1}" in
  check) depcheck --ignores=pre-commit,prettier,@fortawesome/fontawesome-pro,@types/node ;;

  install)
    if ! @deps verify package-lock.json; then
      install --from-scratch
      md5sum package-lock.json >node_modules/package.lock
    fi
    ;;

  docs)
    if ! @deps verify "$(pwd)"/docs/package-lock.json; then
      docs install # TODO:hack cwd has been changed
      md5sum "$(pwd)"/package-lock.json >"$(pwd)"/node_modules/package.lock
    fi
    ;;

  tools)
    if ! @deps verify tools/package-lock.json; then
      tools npm ci
      md5sum tools/package-lock.json >tools/node_modules/package.lock
    fi
    ;;

  verify)
    local file="${2:-package-lock.json}" lock
    lock=$(dirname "${file}")/node_modules/package.lock
    if [ ! -f "${lock}" ]; then
      return 1
    fi
    [ "$(cat "${lock}")" == "$(md5sum "${file}")" ]
    ;;
  esac
}
