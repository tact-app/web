# shellcheck source=../utils/env.bash   # @env @key @token
# shellcheck source=../utils/print.bash # @fatal

set_graphite_token() { @token store Graphite 60; }

_gt=$(which gt || true)

gt() {
  [ -z "${_gt}" ] && @fatal please setup environment first

  local key token
  key=$(@key graphite)
  token=${!key:-$(@env get "${key}")}

  if [ ! -f ~/.graphite_user_config ]; then
    "${_gt}" auth --token "${token}"
  elif [ "${token}" != "$(jq -r .authToken ~/.graphite_user_config)" ]; then
    "${_gt}" auth --token "${token}"
  fi

  local args=("${@}")
  "${_gt}" "${args[@]}"
}
