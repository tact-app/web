#!/usr/bin/env bash

declare -A config
config['dryrun']=false

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
