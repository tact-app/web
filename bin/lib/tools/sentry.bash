#!/usr/bin/env bash
# shellcheck source=../core/env.bash # @token
# shellcheck source=tools.bash       # $path

set_sentry_token() {
  @token store Sentry 64
  cat <<EOF >.sentryclirc
[auth]
token=$(@token get Sentry)
EOF
}

_sentry=$(which sentry-cli || true)

sentry() {
  [ -z "${_sentry}" ] && echo Please setup environment first. && return 1

  local args=("${@}")

  # TODO:generate inject _ while code generation
  _ "${_sentry}" --auth-token="$(@token get sentry)" "${args[@]}"
}
