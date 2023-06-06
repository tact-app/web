#!/usr/bin/env bash
# shellcheck source=../core/env.bash # @token
# shellcheck source=tools.bash       # $path

set_graphite_token() { @token store Graphite 60; }

_gt=$(which gt || true)

gt() {
  [ -z "${_gt}" ] && echo Please setup environment first. && return 1

  local token
  token=$(@token get graphite)

  if [ ! -f ~/.graphite_user_config ]; then
    $_gt auth --token "${token}"
  else
    local stored
    stored=$(grep authToken ~/.graphite_user_config | awk '{print $2}' | tr -d '"')
    if [ "${token}" != "${stored}" ]; then
      $_gt auth --token "${token}"
    fi
  fi

  local args=("${@}")

  # TODO:generate inject _ while code generation
  _ "${_gt}" "${args[@]}"
}
