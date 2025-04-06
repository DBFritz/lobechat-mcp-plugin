#!/usr/bin/env node

import './index.js';

const { log } = console;

log('🚀 Lobechat MCP Plugin Server is running!');
log('📋 Configuration:');
log(`   - Config path: ${process.env.CONFIG_PATH || './config.json'}`);
log(`   - Port: ${process.env.PORT || 3000}`);
log('\n🔍 To use a custom config file, set the CONFIG_PATH env variable.');
log('📚 For more information, visit https://github.com/DBFritz/lobechat-mcp-plugin');
