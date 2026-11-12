const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: 'tests',
  webServer: { command: 'npx http-server -p 4173 -s', url: 'http://localhost:4173', reuseExistingServer: true },
  use: { baseURL: 'http://localhost:4173' }
});
