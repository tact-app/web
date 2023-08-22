# shellcheck source=../config/global.bash # $config
# shellcheck source=../tools/tools.bash   # @install
# shellcheck source=../utils/env.bash     # @env @key @token
# shellcheck source=../utils/print.bash   # @debug @fatal

set_vercel_token() {
  @token store Vercel 24
  if [ -z "${VERCEL_ORG_ID}" ] || [ -z "${VERCEL_PROJECT_ID}" ]; then
    vercel link
  fi
}

_vercel=$(which vercel || true)

vercel() {
  [ -z "${_vercel}" ] && @fatal please setup environment first

  local key token
  key=$(@key vercel)
  token=${!key:-$(@env get "${key}")}

  local args=("${@}")
  "${_vercel}" -t "${token}" "${args[@]}"
}

@deploy() {
   if [ "${1:-}" == 'prod' ]; then
     vercel pull --yes --environment=production >&2
     vercel build --yes --prod >&2
     vercel deploy --yes --prebuilt --prod
     return
   fi

   vercel pull --yes --environment=preview >&2
   vercel build --yes >&2
   vercel deploy --yes --prebuilt
 }

@deployments() {
  local action=${1:-$(gum choose clean drop)} depth=${2:-1} guard=7

  case "${action}" in
  clean)
    local result
    result=$(vercel rm --yes --safe "${config['name']}" 2>&1 || true)
    [[ "${result}" =~ "Error:" ]] && @fatal "${result}"
    @debug "${result}"
    ;;

  drop)
    [ "${depth}" -gt "${guard}" ] && @fatal too many recursive calls
    local deployments=()

    local deployment found=false
    while IFS='' read -r deployment; do
      deployments+=("${deployment}")
      found=true
    done < <(vercel ls "${config['name']}" 2>&1 | grep https | awk '{print $2}')
    if ! $found; then
      echo No deployments found
      return
    fi

    vercel rm --yes "${deployments[@]}"
    @deployments drop $((depth + 1))
    ;;

  *) @fatal unknown action "${action}" ;;
  esac
}

@unlink() {
  @env set VERCEL_ORG_ID "$(jq -r .orgId .vercel/project.json)"
  @env set VERCEL_PROJECT_ID "$(jq -r .projectId .vercel/project.json)"
  rm -rf .vercel
}
