module.exports = {
    settings: {
        react: { version: 'detect' },
    },
    env: {
        browser: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2021,
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: 'module',
    },
    extends: ['eslint:recommended', 'eslint-config-prettier', 'prettier'],
    rules: {
        'no-console': 'error',
    },
    overrides: [
        {
            files: ['**/*.+(ts|tsx)'],
            env: {
                browser: true,
            },
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: './tsconfig.eslint.json',
            },
            plugins: ['react', 'react-hooks', 'sonarjs'],
            extends: [
                'plugin:@typescript-eslint/recommended',
                'plugin:react/recommended',
                'plugin:react-hooks/recommended',
                'plugin:sonarjs/recommended',
            ],
            rules: {
                'react/jsx-uses-react': 'error',
                'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
                '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
                '@typescript-eslint/ban-ts-comment': 'off',
                'react/display-name': 'off',
                '@typescript-eslint/no-explicit-any': 'warn',
                'react/prop-types': 'off',
            },
        },
        {
            files: ['**/__tests__/**'],
            env: { jest: true },
            plugins: ['jest', 'testing-library'],
            extends: ['plugin:jest/recommended', 'plugin:jest-dom/recommended', 'plugin:testing-library/react'],
            rules: {
                'sonarjs/no-duplicate-string': 'warn',
                '@typescript-eslint/no-var-requires': 'warn',
                'sonarjs/no-identical-functions': 'warn',
            },
        },
    ],
};