const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  extends: [
    "next/core-web-vitals",
    "plugin:tailwindcss/recommended"
  ],
  globals: {
    $: 'readonly',
    jQuery: 'readonly',
    _: 'readonly',
    lodash: 'readonly',
  },
  settings: {
    tailwindcss: {
      removeDuplicates: true,
      officialSorting: true,
      prependCustom: true,
    }
  },
  rules: {
    semi: ['error', 'never', { beforeStatementContinuationChars: 'always' }],
    indent: [
      'warn',
      2,
      {
        ignoredNodes: ['JSXAttribute', 'JSXSpreadAttribute', 'TemplateLiteral'],
        SwitchCase: 1,
        VariableDeclarator: 'first',
        // MemberExpression: 0,
        // FunctionDeclaration: { body: 1, parameters: 1 },
        // FunctionExpression: { body: 1, parameters: 1 },
        // CallExpression: { arguments: 1 },
      },
    ],
    "react-hooks/exhaustive-deps": 'off',
    "jsx-a11y/alt-text": ['off'],
    // from eslint-plugin-tailwind
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/classnames-order': ['warn']
  }
})