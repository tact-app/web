# shellcheck source=deps.bash                 # @deps
# shellcheck source=../docker/node/build.bash # build
# shellcheck source=../git/core.bash          # @pull

refresh() {
  @pull

  deps install
  deps docs
  deps tools

  build
}
