import css from '@eslint/css';
import eslint from '@eslint/js';
import html from '@html-eslint/eslint-plugin';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importPlugin, { createNodeResolver } from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    // TypeScript and its flavors
    {
        files: ['apps/{frontend,backend}/**/*.{ts,tsx,cts,mts}'],
        ignores: ['node_modules/**/*', '**/build/**', '**/dist/**', 'apps/frontend/vite.config.ts'],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.stylistic,
            importPlugin.flatConfigs.recommended,
            importPlugin.flatConfigs.typescript,
        ],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ['apps/backend/tsconfig.json', 'apps/frontend/tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
        settings: {
            'import-x/resolver-next': [
                createTypeScriptImportResolver({
                    alwaysTryTypes: true,
                    project: ['apps/backend/tsconfig.json', 'apps/frontend/tsconfig.json'],
                }),
                createNodeResolver({}),
            ],
        },
    },
    // JavaScript and its flavors
    {
        files: ['apps/{frontend,backend}/**/*.{js,jsx,cjs,mjs}'],
        ignores: [
            'node_modules/**/*',
            '**/build/**',
            '**/dist/**',
            'apps/frontend/src/components/scripts/cytoscape.min.js',
            'apps/frontend/src/components/scripts/CytoscapeEditor.js',
            'apps/frontend/src/components/scripts/LiveModel.js',
        ],
        extends: [eslint.configs.recommended],
    },
    // React in ./frontend/
    {
        files: ['apps/frontend/**/*.{ts,tsx}'],
        ignores: ['node_modules/**/*', '**/build/**', '**/dist/**', 'apps/frontend/vite.config.ts'],
        extends: [
            react.configs.flat.recommended,
            react.configs.flat['jsx-runtime'],
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.recommended,
            jsxA11y.flatConfigs.recommended, //jsxA11y doesn't have type definitions
        ],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ['apps/frontend/tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': [
                'error',
                {
                    forbid: [
                        {
                            char: '>',
                            alternatives: ['&gt;'],
                        },
                        {
                            char: '"',
                            alternatives: ['&quot;'],
                        },
                        {
                            char: "'",
                            alternatives: ['&apos;'],
                        },
                    ],
                },
            ],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: ['**/*.css'],
        ignores: ['node_modules/**/*', '**/build/**', '**/dist/**'],
        language: 'css/css',
        extends: [css.configs.recommended],
        rules: {
            'css/use-baseline': ['error', { available: 'newly' }],
        },
    },
    {
        ...html.configs['flat/recommended'],
        files: ['**/*.html'],
        ignores: ['node_modules/**/*', '**/build/**', '**/dist/**'],
        rules: {
            '@html-eslint/require-closing-tags': ['error', { selfClosing: 'always' }],
            '@html-eslint/no-extra-spacing-attrs': [
                'error',
                {
                    enforceBeforeSelfClose: true,
                },
            ],
        },
    }
);
