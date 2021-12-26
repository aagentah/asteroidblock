module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'if',
          'else',
          'for',
          'each',
          'include',
          'content',
          'function',
          'mixin',
          'return',
          'warn'
        ]
      }
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'inside-block', 'blockless-after-blockless']
      }
    ],
    'block-closing-brace-newline-after': [
      'always',
      {
        ignoreAtRules: ['if', 'else']
      }
    ],
    'color-hex-length': null,
    'number-no-trailing-zeros': null,
    'prettier/prettier': true
  }
};
