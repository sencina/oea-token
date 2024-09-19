module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['eslint.config.js'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': ['error', { allow: ['error'] }],
    'no-void': ['error', { allowAsStatement: true }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'import/prefer-default-export': 'off',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*{.,_}{test,spec}.{ts,tsx}']
      }
    ]
  },
};