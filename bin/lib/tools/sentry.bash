# shellcheck source=../utils/env.bash   # @env @key @token
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

  local key token
  key=$(@key sentry)
  token=${!key:-$(@env get "${key}")}

  local args=("${@}")
  "${_sentry}" --auth-token="${token}" "${args[@]}"
}
