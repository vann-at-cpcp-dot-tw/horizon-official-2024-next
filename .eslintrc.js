module.exports = {
  globals: {
    $: 'readonly',
    jQuery: 'readonly',
    _: 'readonly',
    lodash: 'readonly',
  },
  extends: [
    "next/core-web-vitals",
    "plugin:tailwindcss/recommended"
  ],
  plugins: ["import"],
  settings: {
    tailwindcss: {
      removeDuplicates: true,
      officialSorting: true,
      prependCustom: true,
    }
  },
  rules: {
    "@next/next/no-img-element": "off",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal"],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    semi: ['error', 'never', { beforeStatementContinuationChars: 'always' }],
    indent: [
      'warn',
      2,
      {
        ignoredNodes: [
          'JSXAttribute',
          'JSXSpreadAttribute',
          'TemplateLiteral',
          'JSXFragment', // 這是 <React.Fragment> 簡短寫法為 <></>, 忽略這個是因為簡短寫法會導致 eslint 出現無限迴圈的 bug
        ],
        SwitchCase: 1,
        VariableDeclarator: 'first',
        // MemberExpression: 0,
        // FunctionDeclaration: { body: 1, parameters: 1 },
        // FunctionExpression: { body: 1, parameters: 1 },
        // CallExpression: { arguments: 1 },
      },
    ],
    "jsx-a11y/alt-text": ['off'],
    // from eslint-plugin-tailwind
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/classnames-order': ['warn']
  }
}