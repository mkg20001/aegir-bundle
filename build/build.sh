#!/bin/bash

set -e

# create tmp
TMP="$PWD/aegir"
rm -rf "$TMP"
mkdir "$TMP"
pushd "$TMP"

# clone aegir
git clone https://github.com/ipfs/aegir
pushd aegir

# apply patch
curl https://patch-diff.githubusercontent.com/raw/ipfs/aegir/pull/262.patch | git apply -

npm i

# fix for https://github.com/zeit/pkg/issues/529
pushd node_modules
rm -rf edge-launcher
mkdir edge-launcher
pushd edge-launcher
yes "$(printf \\n)" | npm init
touch index.js
popd
popd

# run bundler
pkg-bundle --out-path out --public .
