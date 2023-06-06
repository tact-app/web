#!/usr/bin/env bash
# shellcheck source=../core/env.bash # @token

set_vercel_token() { @token store Vercel 24; }

_vercel=$(which vercel || true)

vercel() {
  [ -z "${_vercel}" ] && echo Please setup environment first. && return 1

  if [ ! -f .vercel/project.json ]; then
    $_vercel -t "$(@token get vercel)" link
  fi

  local args=("${@}")
  # TODO:deprecated use better way to cleanup the env https://github.com/tact-app/web/issues/763
  if [ "${1:-}" == 'clean' ]; then
    args=(rm --yes)
    if [ "${2:-}" == 'all' ]; then
      local deployment found=false
      while IFS='' read -r deployment; do
        args+=("${deployment}")
        found=true
      done < <(vercel ls 2>&1 | grep https | awk '{print $2}')
      if ! $found; then
        echo No deployments found.
        return
      fi
    else
      args+=(--safe tact)
    fi
  fi

  # TODO:generate inject _ while code generation
  _ "${_vercel}" -t "$(@token get vercel)" "${args[@]}"
}

deploy() {
  if [ "${1:-}" == 'prod' ]; then
    vercel pull --yes --environment=production
    vercel build --yes --prod
    vercel deploy --yes --prebuilt --prod
    return
  fi

  vercel pull --yes --environment=preview
  vercel build --yes
  vercel deploy --yes --prebuilt
}
