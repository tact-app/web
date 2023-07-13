#!/usr/bin/env bash
# shellcheck source=../git/core.bash      # @root
# shellcheck source=../utils/env.bash     # @os @arch
# shellcheck source=../utils/network.bash # @busy
# shellcheck source=../utils/print.bash   # @fatal

# TODO:debt find a better way to inject path
path="$(@root)/tools/node_modules/.bin"
if [[ ":${PATH}:" != *":${path}:"* ]]; then
  export PATH="${path}:${PATH}"
fi

path="$(@root)/bin/$(@os)/$(@arch)"
if [[ ":${PATH}:" != *":${path}:"* ]]; then
  export PATH="${path}:${PATH}"
fi

declare -A config
config['shift']=0
config['dryrun']=false
config['node']=18
config['port']=3000

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
      config['port']="${2}"
      @busy "${2}" && @fatal the port "${2}" is busy

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
