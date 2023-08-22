# shellcheck source=node.bash # @node

install() {
  local cmd=install
  if [ -f package-lock.json ]; then
    cmd=ci
  fi

  [ "${1:-}" == '--from-scratch' ] && rm -rf node_modules
  @node npm "${cmd}" --include=dev
}
