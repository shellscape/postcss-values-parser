import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'prev', 'failed'],
    setupFiles: ['test/setup.ts'],
    resolveSnapshotPath: (testPath, snapExtension) => {
      return testPath.replace('/test/', '/test/snapshots/') + snapExtension;
    }
  }
});
