#!/usr/bin/env sh

if [ $# -eq 0 ]; then
  /bin/sh
  exit $?
fi

"${@}"
