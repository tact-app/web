#!/usr/bin/env bash
# shellcheck source=../utils/network.bash # @busy
# shellcheck source=../utils/print.bash   # @fatal

declare -A config
config['shift']=0
config['dryrun']=false
config['name']=tact
config['node']=18
config['port']=3000
config['image']=tact-app/web:local

@handle() {
  local arg skip=false
  for arg in "${@}"; do
    if $skip; then
      skip=false
      continue
    fi

    case "${arg}" in
    -n | --node)
      config['node']="${2}"

      config['shift']=$((config['shift'] + 2))
      shift 2
      skip=true
      ;;

    -p | --port)
      @busy "${2}" && @fatal the port "${2}" is busy
      config['port']="${2}"

      config['shift']=$((config['shift'] + 2))
      shift 2
      skip=true
      ;;

    -d | --dry-run)
      config['dryrun']=true

      config['shift']=$((config['shift'] + 1))
      shift
      ;;

    --trace)
      set -x

      config['shift']=$((config['shift'] + 1))
      shift
      ;;

    *) break ;;
    esac
  done
}

@config() {
  local key
  for key in "${!config[@]}"; do
    printf "[%s]=%s\n" "${key}" "${config[${key}]}"
  done
}
