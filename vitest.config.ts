import { defineConfig } from 'vitest/config'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
  },
})
