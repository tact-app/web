# shellcheck source=../git/core.bash # @root
# shellcheck source=../utils/os.bash # @os @arch

_NPMBINPATH="$(@root)/tools/node_modules/.bin"
if [[ ":${PATH}:" != *":${_NPMBINPATH}:"* ]]; then
  export PATH="${_NPMBINPATH}:${PATH}"
fi

_BINPATH="$(@root)/bin/$(@os)/$(@arch)"
if [[ ":${PATH}:" != *":${_BINPATH}:"* ]]; then
  export PATH="${_BINPATH}:${PATH}"
fi
[ -d "${_BINPATH}" ] || mkdir -p "${_BINPATH}"
