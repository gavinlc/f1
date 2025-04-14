//  @ts-check
import { globalIgnores } from 'eslint/config';
import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  globalIgnores(['*.config.js']),
  ...tanstackConfig,
  {
    files: ['*/**/*.test.ts', '*/**/*.test.tsx'],
    rules: {
      '@typescript-eslint/require-await': 'off',
    },
  },
];
