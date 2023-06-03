#!/usr/bin/env bash

setup() {
  set_fontawesome_token false || (echo The token is required && return 1)
  set_graphite_token false || true
  set_sentry_token false || true
  set_vercel_token false || true
  @env

  tools npm ci
  build --from-scratch

  local copied=false
  command -v pbcopy >/dev/null && echo source bin/activate | pbcopy && copied=true
  echo Run the next commands to complete setup:
  printf '├─ source bin/activate\t- to activate virtual environment (copied to clipboard: %s)\n' $copied
  printf '└─ run whoami \t\t- to show meta information about your environment\n'
}

set_fontawesome_token() { @store_token 'Font Awesome' fontawesome.token 36 "${1:-true}"; }
set_graphite_token() { @store_token Graphite graphite.token 60 "${1:-true}"; }
set_sentry_token() { @store_token Sentry sentry.token 64 "${1:-true}"; }
set_vercel_token() { @store_token Vercel vercel.token 24 "${1:-true}"; }
@store_token() {
  local name="${1}" key="${2}" length="${3}" update="${4:-true}"

  if ! ${update}; then
    local yn='N'
    read -rp "Do you have ${name}' token? (y/N) " yn
    case $yn in
    [yY]) ;;
    *) return 1 ;;
    esac
  fi

  local token
  echo Please enter "${name}" token:
  read -rs token
  token=${token## }
  token=${token%% }

  if [ "${#token}" -lt "${length}" ]; then
    echo 'Token is invalid.'
    exit 1
  fi
  git config "${key}" "${token}"
  echo 'Token saved.'

  [ "${update}" != false ] && @env || return 0
}

@env() {
  cat <<EOF >.env
FONTAWESOME_TOKEN=$(git config fontawesome.token)
GRAPHITE_TOKEN=$(git config graphite.token)
SENTRY_TOKEN=$(git config sentry.token)
VERCEL_TOKEN=$(git config vercel.token)
EOF
  cat <<EOF >.sentryclirc
[auth]
token=$(git config sentry.token)
EOF
}

@vne() {
  source .env
  git config fontawesome.token "${FONTAWESOME_TOKEN}"
  git config graphite.token "${GRAPHITE_TOKEN}"
  git config sentry.token "${SENTRY_TOKEN}"
  git config vercel.token "${VERCEL_TOKEN}"
}

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
