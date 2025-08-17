/** @type {import('next').NextConfig} */

const path = require('path')

const webpack = require('webpack')

const nextConfig = {
  // basePath: process.env.NEXT_PUBLIC_APP_BASE || '/',
  reactStrictMode: true,
  env: {},
  // assetPrefix:  process.env.NODE_ENV === "production" ?'/' :'',
  // serverRuntimeConfig: {
  //   // Will only be available on the server side
  //   mySecret: 'secret',
  //   secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  // },
  // publicRuntimeConfig: {

  // },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp-horizon-official.ddev.site',
        // port: '',
        // pathname: '',
      },
      {
        protocol: 'https',
        hostname: 'cms.horizonyacht.com'
      },
      {
        protocol: 'https',
        hostname: 'us-cms.horizonyacht.com'
      },
      {
        protocol: 'https',
        hostname: 'au-cms.horizonyacht.com'
      },
      {
        protocol: 'https',
        hostname: 'eu-cms.horizonyacht.com'
      },
      {
        protocol: 'https',
        hostname: 'eu-horizon-cms.cpcp.tw'
      }
    ],
    // domains: ['wp-horizon-official.ddev.site']
  },
  trailingSlash: false, // for exportPathMap
  experimental: {
      // 記憶體優化（如果是 v15+）
      webpackMemoryOptimizations: true,
  },
  webpack: (config, { dev, isServer })=>{
    config.module.rules.push(
      {
        test: /\.(graphql|gql)/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader"
      }
    )

    config.plugins.push(
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        React: 'react',
      })
    )

    if (!isServer){
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false
      }
    }

    return config
  },
  // exportPathMap: process.env.NODE_ENV === 'production'
  // ?async function(defaultPathMap, { dev, dir, outDir, distDir, buildId }){
  //     defaultPathMap['404'] = defaultPathMap['/_error']

  //     return defaultPathMap
  //   // return {
  //   //   '/': { page: '/' },
  //   //   '/about': { page: '/about' },
  //   // }
  // }
  // :null,
  async rewrites() {
    return {
      // beforeFiles: [
      //   // These rewrites are checked after headers/redirects
      //   // and before all files including _next/public files which
      //   // allows overriding page files
      //   {
      //     source: '/some-page',
      //     destination: '/somewhere-else',
      //     has: [{ type: 'query', key: 'overrideMe' }],
      //   },
      // ],
      afterFiles: process.env.NEXT_PUBLIC_DEALER_REGION === 'US' ?[
        // These rewrites are checked after pages/public files
        // are checked but before dynamic routes
        {
          source: '/:lang/inventory',
          destination: '/:lang/brokerage',
        },
        {
          source: '/:lang/inventory/:yachtSlug',
          destination: '/:lang/brokerage/:yachtSlug',
        }
      ]:[],
      // fallback: [
      //   // These rewrites are checked after both pages/public files
      //   // and dynamic routes are checked
      //   {
      //     source: '/:path*',
      //     destination: `https://my-old-site.com/:path*`,
      //   },
      // ],
    }
  },
}

module.exports = nextConfig
