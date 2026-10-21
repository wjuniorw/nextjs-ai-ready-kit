import type { NextConfig } from 'next'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
})

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default withVanillaExtract(nextConfig)
