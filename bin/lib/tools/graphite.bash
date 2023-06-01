#!/usr/bin/env bash

_gt=$(which gt || true)

gt() {
  [ -z "${_gt}" ] && echo Please setup environment first. && return 1

  local token
  token=$(git config graphite.token)

  if [ ! -f ~/.graphite_user_config ]; then
    $_gt auth --token "${token}"
  elif [ "${token}" != "$(grep authToken ~/.graphite_user_config | awk '{print $2}' | tr -d '"')" ]; then
    $_gt auth --token "${token}"
  fi

  local args=("${@}")

  # TODO:generate inject _ while code generation
  _ "${_gt}" "${args[@]}"
}
