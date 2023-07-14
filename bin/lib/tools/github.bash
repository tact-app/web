#!/usr/bin/env bash
# shellcheck source=../utils/env.bash   # @token
# shellcheck source=../utils/print.bash # @fatal

set_github_token() { @token store GitHub 40; }

_gh=$(which gh || true)

# Useful: gh repo set-default
# It sets `gh-resolved = base` for selected remote, e.g. `[remote "origin"]`.
gh() {
  [ -z "${_gh}" ] && @fatal please setup environment first

  local token=${GITHUB_TOKEN:-}
  [ -z "${token}" ] && token=$(@token get github)

  local args=("${@}")

  GITHUB_TOKEN=${token} "${_gh}" "${args[@]}"
}

@workflows() {
  case $(gum choose disable enable) in
  disable)
    local workflow workflows
    workflows=$(
      gh workflow list |
        gum choose --no-limit |
        awk '{print $NF}'
    )
    for workflow in ${workflows}; do
      gh workflow disable "${workflow}"
    done
    ;;

  enable)
    local workflow workflows
    workflows=$(
      gh workflow list --all |
        grep disabled |
        gum choose --no-limit |
        awk '{print $NF}'
    )
    for workflow in ${workflows}; do
      gh workflow enable "${workflow}"
    done
    ;;
  esac
}
