#!/usr/bin/env bash
# shellcheck source=../utils/env.bash   # @token
# shellcheck source=../utils/print.bash # @fatal

set_vercel_token() { @token store Vercel 24; }

_vercel=$(which vercel || true)

vercel() {
  [ -z "${_vercel}" ] && @fatal please setup environment first

  if [ ! -f .vercel/project.json ]; then
    if [ -z "${VERCEL_ORG_ID+x}" ] || [ -z "${VERCEL_PROJECT_ID+x}" ]; then
      $_vercel -t "$(@token get vercel)" link
    fi
  fi

  local args=("${@}")
  if [ "${1:-}" == 'clean' ]; then
    args=(rm --yes)
    if [ "${2:-}" == 'all' ]; then
      local deployment found=false
      while IFS='' read -r deployment; do
        args+=("${deployment}")
        found=true
      done < <(vercel ls 2>&1 | grep https | awk '{print $2}')
      if ! $found; then
        echo No deployments found
        return
      fi
    else
      args+=(--safe tact)
    fi
  fi

  "${_vercel}" -t "$(@token get vercel)" "${args[@]}"
}
