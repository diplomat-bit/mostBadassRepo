// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/scripts/utils/upload-artifact.sh
================================================================================

#!/usr/bin/env bash
set -exuo pipefail

FILENAME=$(basename dist/*.whl)

RESPONSE=$(curl -X POST "$URL?filename=$FILENAME" \
  -H "Authorization: Bearer $AUTH" \
  -H "Content-Type: application/json")

SIGNED_URL=$(echo "$RESPONSE" | jq -r '.url')

if [[ "$SIGNED_URL" == "null" ]]; then
  echo -e "\033[31mFailed to get signed URL.\033[0m"
  exit 1
fi

UPLOAD_RESPONSE=$(curl -v -X PUT \
  -H "Content-Type: binary/octet-stream" \
  --data-binary "@dist/$FILENAME" "$SIGNED_URL" 2>&1)

if echo "$UPLOAD_RESPONSE" | grep -q "HTTP/[0-9.]* 200"; then
  echo -e "\033[32mUploaded build to Stainless storage.\033[0m"
  echo -e "\033[32mInstallation: pip install 'https://pkg.stainless.com/s/jocall3-python/$SHA/$FILENAME'\033[0m"
else
  echo -e "\033[31mFailed to upload artifact.\033[0m"
  exit 1
fi


================================================================================
// APPENDED FROM REPO: diplomat-bit/garbage-typescript | ORIGINAL PATH: diplomat-bit-garbage-typescript-95791a2/scripts/utils/upload-artifact.sh
================================================================================

#!/usr/bin/env bash
set -exuo pipefail

RESPONSE=$(curl -X POST "$URL" \
  -H "Authorization: Bearer $AUTH" \
  -H "Content-Type: application/json")

SIGNED_URL=$(echo "$RESPONSE" | jq -r '.url')

if [[ "$SIGNED_URL" == "null" ]]; then
  echo -e "\033[31mFailed to get signed URL.\033[0m"
  exit 1
fi

TARBALL=$(cd dist && npm pack --silent)

UPLOAD_RESPONSE=$(curl -v -X PUT \
  -H "Content-Type: application/gzip" \
  --data-binary "@dist/$TARBALL" "$SIGNED_URL" 2>&1)

if echo "$UPLOAD_RESPONSE" | grep -q "HTTP/[0-9.]* 200"; then
  echo -e "\033[32mUploaded build to Stainless storage.\033[0m"
  echo -e "\033[32mInstallation: npm install 'https://pkg.stainless.com/s/garbage-typescript/$SHA'\033[0m"
else
  echo -e "\033[31mFailed to upload artifact.\033[0m"
  exit 1
fi


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/scripts/utils/upload-artifact.sh
================================================================================

#!/usr/bin/env bash
set -exuo pipefail

RESPONSE=$(curl -X POST "$URL" \
  -H "Authorization: Bearer $AUTH" \
  -H "Content-Type: application/json")

SIGNED_URL=$(echo "$RESPONSE" | jq -r '.url')

if [[ "$SIGNED_URL" == "null" ]]; then
  echo -e "\033[31mFailed to get signed URL.\033[0m"
  exit 1
fi

TARBALL=$(cd dist && npm pack --silent)

UPLOAD_RESPONSE=$(curl -v -X PUT \
  -H "Content-Type: application/gzip" \
  --data-binary "@dist/$TARBALL" "$SIGNED_URL" 2>&1)

if echo "$UPLOAD_RESPONSE" | grep -q "HTTP/[0-9.]* 200"; then
  echo -e "\033[32mUploaded build to Stainless storage.\033[0m"
  echo -e "\033[32mInstallation: npm install 'https://pkg.stainless.com/s/jocall3-node/$SHA'\033[0m"
else
  echo -e "\033[31mFailed to upload artifact.\033[0m"
  exit 1
fi


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-python | ORIGINAL PATH: diplomat-bit-jocall3-python-03825e0/scripts/utils/upload-artifact.sh
================================================================================

#!/usr/bin/env bash
set -exuo pipefail

FILENAME=$(basename dist/*.whl)

RESPONSE=$(curl -X POST "$URL?filename=$FILENAME" \
  -H "Authorization: Bearer $AUTH" \
  -H "Content-Type: application/json")

SIGNED_URL=$(echo "$RESPONSE" | jq -r '.url')

if [[ "$SIGNED_URL" == "null" ]]; then
  echo -e "\033[31mFailed to get signed URL.\033[0m"
  exit 1
fi

UPLOAD_RESPONSE=$(curl -v -X PUT \
  -H "Content-Type: binary/octet-stream" \
  --data-binary "@dist/$FILENAME" "$SIGNED_URL" 2>&1)

if echo "$UPLOAD_RESPONSE" | grep -q "HTTP/[0-9.]* 200"; then
  echo -e "\033[32mUploaded build to Stainless storage.\033[0m"
  echo -e "\033[32mInstallation: pip install 'https://pkg.stainless.com/s/jocall3-python/$SHA/$FILENAME'\033[0m"
else
  echo -e "\033[31mFailed to upload artifact.\033[0m"
  exit 1
fi


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/scripts/utils/upload-artifact.sh
================================================================================

#!/usr/bin/env bash
set -exuo pipefail

RESPONSE=$(curl -X POST "$URL" \
  -H "Authorization: Bearer $AUTH" \
  -H "Content-Type: application/json")

SIGNED_URL=$(echo "$RESPONSE" | jq -r '.url')

if [[ "$SIGNED_URL" == "null" ]]; then
  echo -e "\033[31mFailed to get signed URL.\033[0m"
  exit 1
fi

TARBALL=$(cd dist && npm pack --silent)

UPLOAD_RESPONSE=$(curl -v -X PUT \
  -H "Content-Type: application/gzip" \
  --data-binary "@dist/$TARBALL" "$SIGNED_URL" 2>&1)

if echo "$UPLOAD_RESPONSE" | grep -q "HTTP/[0-9.]* 200"; then
  echo -e "\033[32mUploaded build to Stainless storage.\033[0m"
  echo -e "\033[32mInstallation: npm install 'https://pkg.stainless.com/s/jocall3-typescript/$SHA'\033[0m"
else
  echo -e "\033[31mFailed to upload artifact.\033[0m"
  exit 1
fi
