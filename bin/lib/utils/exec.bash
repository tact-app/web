#!/usr/bin/env bash
# shellcheck source=../app/config.bash # $config
# TODO:debt low-level component depends on top-level component

@() {
  ${config['dryrun']} && echo "${@}"
  "${@}"
}

_() {
  if ${config['dryrun']}; then
    echo "${@}"
    return
  fi

  trap 'echo "${@}"' ERR
  "${@}"
}

-() {
  if ${config['dryrun']}; then
    echo "${*} || false"
    return
  fi

  trap 'echo "${*} || false"' ERR
  "${@}" || false
}

+() {
  if ${config['dryrun']}; then
    echo "${*} || true"
    return
  fi

  trap 'echo "${*} || true"' ERR
  "${@}" || true
}
