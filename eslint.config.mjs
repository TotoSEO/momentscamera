import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * Configuration ESLint « flat ».
 *
 * Depuis Next 16, `eslint-config-next` publie directement des tableaux de
 * configs flat : on les étale, sans passer par la couche de compatibilité
 * `FlatCompat` (qui échoue sur les références circulaires du plugin React).
 */
const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
]

export default eslintConfig
