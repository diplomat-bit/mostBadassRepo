// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/scripts/utils/check-is-in-git-install.sh
================================================================================

#!/usr/bin/env bash
# Check if you happen to call prepare for a repository that's already in node_modules.
[ "$(basename "$(dirname "$PWD")")" = 'node_modules' ] ||
# The name of the containing directory that 'npm` uses, which looks like
# $HOME/.npm/_cacache/git-cloneXXXXXX
[ "$(basename "$(dirname "$PWD")")" = 'tmp' ] ||
# The name of the containing directory that 'yarn` uses, which looks like
# $(yarn cache dir)/.tmp/XXXXX
[ "$(basename "$(dirname "$PWD")")" = '.tmp' ]


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/scripts/utils/check-is-in-git-install.sh
================================================================================

#!/usr/bin/env bash
# Check if you happen to call prepare for a repository that's already in node_modules.
[ "$(basename "$(dirname "$PWD")")" = 'node_modules' ] ||
# The name of the containing directory that 'npm` uses, which looks like
# $HOME/.npm/_cacache/git-cloneXXXXXX
[ "$(basename "$(dirname "$PWD")")" = 'tmp' ] ||
# The name of the containing directory that 'yarn` uses, which looks like
# $(yarn cache dir)/.tmp/XXXXX
[ "$(basename "$(dirname "$PWD")")" = '.tmp' ]


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/scripts/utils/check-is-in-git-install.sh
================================================================================

#!/usr/bin/env bash
# Check if you happen to call prepare for a repository that's already in node_modules.
[ "$(basename "$(dirname "$PWD")")" = 'node_modules' ] ||
# The name of the containing directory that 'npm` uses, which looks like
# $HOME/.npm/_cacache/git-cloneXXXXXX
[ "$(basename "$(dirname "$PWD")")" = 'tmp' ] ||
# The name of the containing directory that 'yarn` uses, which looks like
# $(yarn cache dir)/.tmp/XXXXX
[ "$(basename "$(dirname "$PWD")")" = '.tmp' ]
