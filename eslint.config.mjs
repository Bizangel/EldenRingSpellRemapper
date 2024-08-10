import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
    eslint.configs.recommended,
  ...tseslint.configs.recommended,

  { files: ['**/*.{ts,tsx}'] },
  {
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
  },
  {
    rules: {
      ...tseslint.recommended,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
  },
  {
    plugins: {
      'react': eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
    },
    settings: {
        react: {
            version: 'detect',
        }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off" // typescript itself will warn us already
    }
  },
);