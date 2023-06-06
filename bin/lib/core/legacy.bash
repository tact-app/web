#!/usr/bin/env bash

setup() {
  set_fontawesome_token || @fatal the token is required
  set_graphite_token || true
  set_sentry_token || true
  set_vercel_token || true

  #  tools npm ci
  #  build --from-scratch
}

set_fontawesome_token() { @token store 'Font Awesome' 36; }

refresh() {
  local remote
  for remote in $(git remote | grep -v origin); do
    git fetch --prune --tags "${remote}"
  done
  git fetch --prune --tags --prune-tags origin

  local remote actual target shared
  remote=${1:-'@{u}'}
  actual=$(git rev-parse @)
  target=$(git rev-parse "${remote}")
  shared="$(git merge-base @ "${remote}")"
  if [ "${actual}" != "${target}" ]; then
    if ! git diff-index --quiet HEAD; then
      git stash -m 'stash before pull'
      trap 'git stash pop' EXIT
    fi
    git pull --force --rebase
  fi

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
