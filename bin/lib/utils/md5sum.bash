#!/usr/bin/env bash

if ! command -v md5sum >/dev/null; then
  # TODO:refactor check openssl availability
  md5sum() { openssl md5 "${@}"; }
fi
