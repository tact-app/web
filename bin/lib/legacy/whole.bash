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
  git config fontawesome.token ${FONTAWESOME_TOKEN}
  git config graphite.token ${GRAPHITE_TOKEN}
  git config sentry.token ${SENTRY_TOKEN}
  git config vercel.token ${VERCEL_TOKEN}
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
    if ! @deps verify docs/package-lock.json; then
      docs install
      md5sum docs/package-lock.json >docs/node_modules/package.lock
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

@changelog() {
  local latest
  latest=$(git describe --tags --abbrev=0 2>/dev/null)

  git log --oneline "${latest}"... | cat | awk '{$1=""; print $0}' | sed 's/^/-/' | sort
}

# Example: run isolated
#   - alias run=./Taskfile
#   - source bin/activate
#  Deploy to staging
#   - run deploy
#  Deploy to production
#   - run deploy prod
isolated() {
  docker run --rm -it \
    --env-file .env \
    -v "$(pwd)":/app \
    -w /app \
    --entrypoint=/bin/bash \
    node:18
}

# Example: run install --from-scratch
install() {
  [ "${1:-}" == '--from-scratch' ] && rm -rf node_modules
  local cmd=install
  if [ -f package-lock.json ]; then
    cmd=ci
  fi
  @node npm "${cmd}" --ignore-scripts --include=dev
}

dev() { @node -p 3000:3000 -- npm run dev; }

# Example: run build --from-scratch
# Example: run build docker --from-scratch
build() {
  # docker way
  if [ "${1:-}" == 'docker' ]; then
    if [ "${2:-}" == '--from-scratch' ]; then
      docker rmi tact-app/web:local || true
    fi
    docker build \
      --build-arg token="$(git config fontawesome.token)" \
      -f Dockerfile \
      -t tact-app/web:local .
    return
  fi

  # local way
  [ "${1:-}" == '--from-scratch' ] && rm -rf .next && install "${@}"
  @node npm run build
}

# Example: run start --from-scratch
# Example: run start docker --from-scratch
start() {
  # docker way
  if [ "${1:-}" == 'docker' ]; then
    [ "${2:-}" == '--from-scratch' ] && build docker "${@:2}"
    docker run \
      --rm -it \
      -p 127.0.0.1:"${config['port']}":3000 \
      tact-app/web:local
    return
  fi

  # local way
  [ "${1:-}" == '--from-scratch' ] && build "${@}"
  @node -p 127.0.0.1:"${config['port']}":3000 -- npm run start
}

npm() { @node npm "${@}"; }

@node() {
  local args=(
    --rm
    -it
    -v "$(pwd)":/app
    -w /app
    --entrypoint=/app/bin/lib/entrypoint.sh
  )

  if [ -f .env ]; then
    args+=(--env-file .env)
  fi

  if [[ " ${*} " =~ ' -- ' ]]; then
    for arg in "${@}"; do
      shift
      case "${arg}" in
      --) break ;;
      *) args+=("${arg}") ;;
      esac
    done
  fi

  docker run "${args[@]}" node:18-alpine "${@}"
}

# Example: run docs
# Example: run docs build publish
docs() {
  pushd docs
  trap popd EXIT

  local args=("${@}")
  if [ ${#args[@]} = 0 ]; then
    args=(install build start)
  fi

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
