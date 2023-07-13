#!/usr/bin/env bash
# shellcheck source=../core/runtime.bash  # $path
# shellcheck source=../git/core.bash      # @root
# shellcheck source=../utils/npm.bash     # @consistent @lock

# Example: run tools npm ci
# Example: run tools npm i vercel@latest
#
# Example: run tools install
tools() {
  pushd "$(@root)/tools" >/dev/null || exit 1
  trap 'popd >/dev/null' ERR

  if [[ ${#@} -eq 0 ]]; then
    set -- install
  fi

  local arg args=()
  for arg in "${@}"; do
    shift

    if [[ ${#args[@]} -eq 0 ]]; then
      case "${arg}" in
      install)
        if ! @consistent; then npm ci && @lock; fi
        @install gum jq op wait-for-it
        ;;
      --) continue ;;
      *) args+=("${arg}") ;;
      esac
      continue
    fi

    if [[ "${arg}" == '--' ]]; then
      "${args[@]}"
      args=()
      continue
    fi
    args+=("${arg}")
  done
  "${args[@]}"

  popd >/dev/null || exit 1
}

@install() {
  for arg in "${@}"; do
    compgen -A function | grep -q "^@install-${arg}$" || @fatal unknown tool "${arg}"
    "@install-${arg}"
  done
}

@install-gum() {
  local bin src version=0.10.0
  if command -v gum >/dev/null && [[ "${1:-}" != '--force' ]]; then
    [[ $(gum --version | awk '{print $3}') == "v${version}" ]] && return
  fi

  src=https://github.com/charmbracelet/gum/releases/download
  case $(@os) in
  linux) bin="gum_${version}_Linux_$(@arch).tar.gz" ;;
  darwin) bin="gum_${version}_Darwin_$(@arch).tar.gz" ;;
  *) @fatal there is no supported binary ;;
  esac

  mkdir -p "${path}"
  curl -sSfL "${src}/v${version}/${bin}" -o "${path}"/gum.tar.gz
  tar -xvf "${path}"/gum.tar.gz -C "${path}" gum 2>/dev/null
  rm -f "${path}"/gum.tar.gz
}

@install-jq() {
  local bin src version=1.6
  if command -v jq >/dev/null && [[ "${1:-}" != '--force' ]]; then
    [[ $(jq --version | cut -d '-' -f 2) == "${version}" ]] && return
  fi

  src=https://github.com/jqlang/jq/releases/download
  case $(@os) in
  linux) bin=jq-linux64 ;;
  darwin) bin=jq-osx-amd64 ;;
  *) @fatal there is no supported binary ;;
  esac

  mkdir -p "${path}"
  curl -sSfL "${src}/jq-${version}/${bin}" -o "${path}"/jq
  chmod +x "${path}"/jq
}

@install-op() {
  local version=2.19.0
  if command -v op >/dev/null && [[ "${1:-}" != '--force' ]]; then
    [[ $(op --version) == "${version}" ]] && return
  fi

  open https://developer.1password.com/docs/cli/get-started/#install
}

@install-wait-for-it() {
  local bin src version=0.2.13
  if command -v wait-for-it >/dev/null && [[ "${1:-}" != '--force' ]]; then
    return
  fi

  src=https://github.com/roerohan/wait-for-it/releases/download
  case $(@os) in
  linux) bin=wait-for-it ;;
  darwin) bin=wait-for-it_mac ;;
  *) @fatal there is no supported binary ;;
  esac

  mkdir -p "${path}"
  curl -sSfL "${src}/v${version}/${bin}" -o "${path}"/wait-for-it
  chmod +x "${path}"/wait-for-it
}
