/** @type {import('next').NextConfig} */

const path = require('path')

const webpack = require('webpack')

const nextConfig = {
  // basePath: process.env.NEXT_PUBLIC_APP_BASE || '/',
  reactStrictMode: true,
  swcMinify: true,
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
  // 記憶體優化
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
  // TODO: 目前是在建構期間不檢查語法，依賴開發者在推版前自行 npm run lint，待 next v15 時，若框架的記憶體管理有進一步優化，應嘗試拿掉
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, { dev, isServer })=>{
    // build 的時候禁用 cache，減少 memory
    // https://nextjs.org/docs/app/building-your-application/optimizing/memory-usage
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: 'memory',
      })
    }

    if( dev ){
      config.resolve.symlinks = false // 由於專案為了節約記憶體，改用 pnpm 來管理套件，但 pnpm 使用 symbol link 和嵌套結構來管理依賴，這與 npm 和 yarn 的扁平結構不同，這讓 git+ssh 的私有套件，在 dev 時會出現路徑解析錯誤，故加上這行避免問題
    }

    config.module.rules.push(
      {
        test: /\.(graphql|gql)/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader"
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
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
