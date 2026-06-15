import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    globalSetup: ['./tests/setup/globalsetup.ts'],
    env: {
      APP_STAGE: 'test',
      NODE_ENV: 'test',
    },
    // Automatically clean up after each test to ensure isolation
    clearMocks: true,
    restoreMocks: true,
    // Ensure tests run sequentially to avoid database conflicts
    fileParallelism: false,
    pool: 'threads',
   sequence: {
      concurrent: false, // Forces tests to run one after the other, not in parallel
    },
    
  },
  plugins: [],
})