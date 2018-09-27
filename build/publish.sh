#!/bin/bash

bash build.sh
pushd "$PWD/aegir"

# get version
v=$(cat package.json | jq -rc .version)

# output path
outp="/mirror/aegir/$v"
rm -rf "$outp"
mkdir "$outp"

# create tar.gz's
pushd out
for o in linux macos win; do
  tar cvfzp "$outp/$o.tar.gz" $(dir -w 1 | grep $o)
done
popd

# create hashsums
pushd "$outp"
sha256sum * > SHA256SUM.txt
popd

# publish to aegir.mkg2001.io
ipfs-dnslink-update cf aegir.mkg20001.io "/ipfs/$(ipfs add -rQ /mirror/aegir)"

