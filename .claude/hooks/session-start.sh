#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install npm dependencies
npm install

# Install claude-seo
if [ ! -d "claude-seo" ]; then
  git clone --depth 1 https://github.com/AgriciDaniel/claude-seo.git
fi
bash claude-seo/install.sh
