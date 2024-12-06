import jest from 'eslint-plugin-jest'
import globals from 'globals'
import babelParser from '@babel/eslint-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import github from 'eslint-plugin-github'
import importPlugin from 'eslint-plugin-import'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  github.getFlatConfigs().recommended,
  importPlugin.flatConfigs.recommended,
  ...compat.extends('eslint:recommended', 'plugin:jest/recommended'),
  {
    ignores: [
      '!**/.*',
      'node_modules/*',
      'dist/*',
      '**/*.json',
      'coverage/*',
      '.github/workflows/*',
      'eslint.config.mjs'
    ]
  },
  {
    plugins: {
      jest
    },

    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...globals.jest,
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      },

      parser: babelParser,
      ecmaVersion: 2023,
      sourceType: 'module',

      parserOptions: {
        requireConfigFile: false,

        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['jest']
        }
      }
    },

    rules: {
      camelcase: 'off',
      'eslint-comments/no-use': 'off',
      'eslint-comments/no-unused-disable': 'off',
      'i18n-text/no-en': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      semi: 'off',
      'github/array-foreach': 'error',
      'github/async-preventdefault': 'warn',
      'github/no-then': 'error',
      'github/no-blur': 'error',
      'importPlugin/no-commonjs': 'off',
      'importPlugin/no-namespace': 'off',
      'prettierPlugin/prettier': 'off'
    }
  }
]
