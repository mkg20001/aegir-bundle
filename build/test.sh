#!/bin/bash

set -e

bash build.sh
pushd "$PWD/aegir"

bin="out/aegir-linux.js"

for cmd in build coverage docs lint-commits lint test; do
  node "$bin" "$cmd"
done

