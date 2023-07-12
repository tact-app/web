#!/usr/bin/env bash
# shellcheck source=../utils/env.bash   # @token
# shellcheck source=../utils/print.bash # @fatal

set_graphite_token() { @token store Graphite 60; }

_gt=$(which gt || true)

gt() {
  [ -z "${_gt}" ] && @fatal please setup environment first

  local token
  token=$(@token get graphite)

  if [ ! -f ~/.graphite_user_config ]; then
    $_gt auth --token "${token}"
  else
    local stored
    stored=$(
      grep authToken ~/.graphite_user_config |
        awk '{print $2}' |
        tr -d '"'
    )
    if [ "${token}" != "${stored}" ]; then
      $_gt auth --token "${token}"
    fi
  fi

  local args=("${@}")

  "${_gt}" "${args[@]}"
}
