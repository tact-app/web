#!/usr/bin/env bash
# shellcheck source=../utils/env.bash   # @token
# shellcheck source=../utils/print.bash # @fatal

set_sentry_token() {
  @token store Sentry 64
  cat <<EOF >.sentryclirc
[auth]
token=$(@token get Sentry)
EOF
}

_sentry=$(which sentry-cli || true)

sentry() {
  [ -z "${_sentry}" ] && @fatal please setup environment first

  local args=("${@}")

  "${_sentry}" --auth-token="$(@token get sentry)" "${args[@]}"
}
