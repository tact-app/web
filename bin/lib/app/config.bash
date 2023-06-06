#!/usr/bin/env bash

declare -A config
config['dryrun']=false
config['node']=18
config['port']=3000

@handle() {
  local arg
  for arg in "${@}"; do
    case "${arg}" in
    -d | --dry-run)
      config['dryrun']=true
      shift
      ;;
    -p | --port)
      config['port']="${2}"
      shift 2
      ;;
    *) break ;;
    esac
  done

  echo "${@}"
}
