#!/usr/bin/env bash

_sentry=$(which sentry-cli || true)

sentry() {
  [ -z "${_sentry}" ] && echo Please setup environment first. && return 1

  local args=("${@}")

  # TODO:generate inject _ while code generation
  _ "${_sentry}" --auth-token="$(git config sentry.token)" "${args[@]}"
}
