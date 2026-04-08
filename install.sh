#!/bin/bash

# Qwen Code OAuth Plugin - Installer for OpenCode
# Facilitates the setup of the plugin for local development/usage

set -e

# Colors for better output
GREEN='\033[0,32m'
BLUE='\033[0,34m'
YELLOW='\033[1,33m'
RED='\033[0,31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 Qwen Code OAuth Plugin - Installation${NC}\n"

# 1. Check for Bun
if ! command -v bun &> /dev/null; then
    echo -e "${RED}Error: Bun is not installed.${NC}"
    echo "Please install Bun first: https://bun.sh"
    exit 1
fi

# 2. Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
bun install

# 3. Build the plugin
echo -e "${YELLOW}🔨 Building plugin...${NC}"
bun run build

# 4. Configure OpenCode
echo -e "${YELLOW}⚙️ Configuring OpenCode...${NC}"

PLUGIN_PATH=$(pwd)
CONFIG_DIR="$HOME/.config/opencode"
CONFIG_FILE="$CONFIG_DIR/opencode.json"

mkdir -p "$CONFIG_DIR"

# Use Bun to safely update the JSON configuration
bun -e "
const fs = require('fs');
const path = '$CONFIG_FILE';
const pluginPath = '$PLUGIN_PATH';

let config = { plugin: [] };
if (fs.existsSync(path)) {
  try {
    config = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (!config.plugin) config.plugin = [];
  } catch (e) {
    console.error('Warning: Could not parse existing opencode.json, creating new one.');
  }
}

if (!config.plugin.includes(pluginPath)) {
  config.plugin.push(pluginPath);
  fs.writeFileSync(path, JSON.stringify(config, null, 2));
  console.log('✅ Plugin registered in ' + path);
} else {
  console.log('ℹ️ Plugin already registered in ' + path);
}
"

echo -e "\n${GREEN}✨ Installation complete!${NC}"
echo -e "\nTo start using Qwen 3.6 Plus, run:"
echo -e "${BLUE}  opencode auth login${NC}"
echo -e "Choose ${YELLOW}'Other'${NC} and type ${YELLOW}'qwen-code'${NC} when prompted."
echo -e "\nThen, run a query:"
echo -e "${BLUE}  opencode --provider qwen-code --model coder-model \"Hello Qwen!\"${NC}\n"
