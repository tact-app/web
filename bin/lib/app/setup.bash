#!/usr/bin/env bash
# shellcheck source=../tools/graphite.bash # set_graphite_token
# shellcheck source=../tools/sentry.bash   # set_sentry_token
# shellcheck source=../tools/vercel.bash   # set_vercel_token

setup() {
  set_fontawesome_token || @fatal the token is required
  set_graphite_token || true
  set_sentry_token || true
  set_vercel_token || true

  #  tools npm ci
  #  build --from-scratch
}

set_fontawesome_token() { @token store 'Font Awesome' 36; }
