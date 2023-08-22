# shellcheck source=refresh.bash           # refresh
# shellcheck source=../tools/github.bash   # set_github_token
# shellcheck source=../tools/graphite.bash # set_graphite_token
# shellcheck source=../tools/sentry.bash   # set_sentry_token
# shellcheck source=../tools/vercel.bash   # set_vercel_token

setup() {
  [ ! -f .env ] && cp .env.example .env

  set_auth0
  set_fontawesome_token || @fatal the token is required
  set_github_token || true
  set_graphite_token || true
  set_sentry_token || true
  set_vercel_token || true

  refresh
}

set_auth0() {
  local keys args key value choice
  keys=$(grep '^AUTH0_' .env.example | awk -F '=' '{print $1}')
  for key in ${keys}; do
    choice=$(gum choose --header="Do you want to set up the ${key}?" 'set' 'skip' 'remove')
    if [ "${choice}" == 'set' ]; then
      args=(
        --header "Please enter the value of ${key}:"
        --placeholder "the value"
      )
      value=$(@env get "${key}")
      [[ -n "${value}" ]] && args+=(--value "${value}")
      @env set "${key}" "$(gum input "${args[@]}")"
    elif [ "${choice}" == 'remove' ]; then
      @env unset "${key}"
    fi
  done
}

set_fontawesome_token() { @token store 'FontAwesome' 36; }
