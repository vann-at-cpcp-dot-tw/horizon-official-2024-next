import type { NextRequest } from 'next/server'

const EN_PREFIX = ''
const ES_PREFIX = '/es'
const DE_PREFIX = '/de'
const redirectMappings = new Map<string, string>([
  // 共通頁面
  [`${EN_PREFIX}/about-horizon-yachts/horizon-yacht-europe`, `${EN_PREFIX}/team`],
  [`${ES_PREFIX}/sobre-horizon/horizon-yacht-europe`, `${ES_PREFIX}/team`],
  [`${DE_PREFIX}/ueber-uns/horizon-yacht-europe`, `${DE_PREFIX}/team`],

  [`${EN_PREFIX}/about-horizon-yachts/horizon-history`, `${EN_PREFIX}/about/horizon`],
  [`${ES_PREFIX}/sobre-horizon/historia-de-horizon`, `${ES_PREFIX}/about/horizon`],
  [`${DE_PREFIX}/ueber-uns/horizon-history`, `${DE_PREFIX}/about/horizon`],

  [`${EN_PREFIX}/about-horizon-yachts/horizon-heritage`, `${EN_PREFIX}/about/innovation`],
  [`${ES_PREFIX}/sobre-horizon/valores-de-horizon]`, `${ES_PREFIX}/about/innovation`],
  [`${DE_PREFIX}/ueber-uns/horizon-heritage`, `${DE_PREFIX}/about/innovation`],

  [`${EN_PREFIX}/about-horizon-yachts/organization`, `${EN_PREFIX}/about/horizon`],
  [`${ES_PREFIX}/sobre-horizon/empresas`, `${ES_PREFIX}/about/horizon`],
  [`${DE_PREFIX}/ueber-uns/organisation`, `${DE_PREFIX}/about/horizon`],

  [`${EN_PREFIX}/about-horizon-yachts/awards`, `${EN_PREFIX}/about/horizon`],
  [`${ES_PREFIX}/sobre-horizon/galardones`, `${ES_PREFIX}/about/horizon`],
  [`${DE_PREFIX}/ueber-uns/auszeichnungen`, `${DE_PREFIX}/about/horizon`],

  [`${EN_PREFIX}/blog-en`, `${EN_PREFIX}/news`],
  [`${ES_PREFIX}/blog-en`, `${ES_PREFIX}/news`],
  // [`${DE_PREFIX}/news`, `${DE_PREFIX}/news`], // 沒變化不用轉

  // [`${EN_PREFIX}/contact`, `${EN_PREFIX}/contact`], // 沒變化不用轉
  [`${ES_PREFIX}/contacto`, `${ES_PREFIX}/contact`],
  [`${DE_PREFIX}/kontakt`, `${DE_PREFIX}/contact`],

  [`${EN_PREFIX}/disclaimer`, `${EN_PREFIX}/terms-and-conditions`],
  [`${ES_PREFIX}/aviso-legal`, `${ES_PREFIX}/terms-and-conditions`],
  [`${DE_PREFIX}/impressum`, `${DE_PREFIX}/terms-and-conditions`],

  [`${EN_PREFIX}/cookie-policy-en`, `${EN_PREFIX}/privacy-policy`],
  [`${ES_PREFIX}/cookie-policy`, `${ES_PREFIX}/privacy-policy`],
  [`${DE_PREFIX}/cookie-policy`, `${DE_PREFIX}/privacy-policy`],

  [`${EN_PREFIX}/downloads`, `${EN_PREFIX}/publications`],
  [`${ES_PREFIX}/descargas`, `${ES_PREFIX}/publications`],
  [`${DE_PREFIX}/downloads`, `${DE_PREFIX}/publications`],

  // 船系列
  // E
  [`${EN_PREFIX}/yachts/e-series`, `${EN_PREFIX}/models/e`],
  [`${ES_PREFIX}/yachts/e-series`, `${ES_PREFIX}/models/e`],
  [`${DE_PREFIX}/yachten/e-series`, `${DE_PREFIX}/models/e`],

  [`${EN_PREFIX}/yachts/e-series/e-75`, `${EN_PREFIX}/models/e/e75`],
  [`${ES_PREFIX}/yachts/e-series/e-75`, `${ES_PREFIX}/models/e/e75`],
  [`${DE_PREFIX}/yachten/e-series/e-75`, `${DE_PREFIX}/models/e/e75`],

  [`${EN_PREFIX}/yachts/e-series/e-81`, `${EN_PREFIX}/models/e/e81`],
  [`${ES_PREFIX}/yachts/e-series/e-81`, `${ES_PREFIX}/models/e/e81`],
  [`${DE_PREFIX}/yachten/e-series/e-81`, `${DE_PREFIX}/models/e/e81`],

  [`${EN_PREFIX}/yachts/e-series/e-90`, `${EN_PREFIX}/models/e/e90`],
  [`${ES_PREFIX}/yachts/e-series/e-90`, `${ES_PREFIX}/models/e/e90`],
  [`${DE_PREFIX}/yachten/e-series/e-90`, `${DE_PREFIX}/models/e/e90`],

  [`${EN_PREFIX}/yachts/e-series/e-100`, `${EN_PREFIX}/models/e/e100`],
  [`${ES_PREFIX}/yachts/e-series/e-100`, `${ES_PREFIX}/models/e/e100`],
  [`${DE_PREFIX}/yachten/e-series/e-100`, `${DE_PREFIX}/models/e/e100`],

  // FD
  [`${EN_PREFIX}/yachts/fd-series`, `${EN_PREFIX}/models/fd`],
  [`${ES_PREFIX}/yachts/fd-series`, `${ES_PREFIX}/models/fd`],
  [`${DE_PREFIX}/yachten/fd-series`, `${DE_PREFIX}/models/fd`],

  [`${EN_PREFIX}/yachts/fd-series/fd-75`, `${EN_PREFIX}/models/fd/fd75`],
  [`${ES_PREFIX}/yachts/fd-series/fd-75`, `${ES_PREFIX}/models/fd/fd75`],
  [`${DE_PREFIX}/yachten/fd-series/fd-75`, `${DE_PREFIX}/models/fd/fd75`],

  [`${EN_PREFIX}/yachts/fd-series/fd-80`, `${EN_PREFIX}/models/fd/fd80`],
  [`${ES_PREFIX}/yachts/fd-series/fd-80`, `${ES_PREFIX}/models/fd/fd80`],
  [`${DE_PREFIX}/yachten/fd-series/fd-80`, `${DE_PREFIX}/models/fd/fd80`],

  [`${EN_PREFIX}/yachts/fd-series/fd-90`, `${EN_PREFIX}/models/fd/fd90`],
  [`${ES_PREFIX}/yachts/fd-series/fd-90`, `${ES_PREFIX}/models/fd/fd90`],
  [`${DE_PREFIX}/yachten/fd-series/fd-90`, `${DE_PREFIX}/models/fd/fd90`],

  [`${EN_PREFIX}/yachts/fd-series/fd-100-skyline`, `${EN_PREFIX}/models/fd/fd100`],
  [`${ES_PREFIX}/yachts/fd-series/fd-100-skyline`, `${ES_PREFIX}/models/fd/fd100`],
  [`${DE_PREFIX}/yachten/fd-series/fd-100-skyline`, `${DE_PREFIX}/models/fd/fd100`],

  [`${EN_PREFIX}/yachts/fd-series/fd100-tri-deck`, `${EN_PREFIX}/models/fd/fd100`],
  [`${ES_PREFIX}/yachts/fd-series/fd100-tri-deck`, `${ES_PREFIX}/models/fd/fd100`],
  [`${DE_PREFIX}/yachten/fd-series/fd100-tri-deck`, `${DE_PREFIX}/models/fd/fd100`],

  [`${EN_PREFIX}/yachts/fd-series/fd-110-skyline`, `${EN_PREFIX}/models/fd/fd110`],
  [`${ES_PREFIX}/yachts/fd-series/fd-110-skyline`, `${ES_PREFIX}/models/fd/fd110`],
  [`${DE_PREFIX}/yachten/fd-series/fd-110-skyline`, `${DE_PREFIX}/models/fd/fd110`],

  [`${EN_PREFIX}/yachts/fd-series/fd-110-trideck`, `${EN_PREFIX}/models/fd/fd110`],
  [`${ES_PREFIX}/yachts/fd-series/fd-110-trideck`, `${ES_PREFIX}/models/fd/fd110`],
  [`${DE_PREFIX}/yachten/fd-series/fd-110-trideck`, `${DE_PREFIX}/models/fd/fd110`],

  [`${EN_PREFIX}/yachts/fd-series/fd-125`, `${EN_PREFIX}/models/fd/fd130`],
  [`${ES_PREFIX}/yachts/fd-series/fd-125`, `${ES_PREFIX}/models/fd/fd130`],
  [`${DE_PREFIX}/yachten/fd-series/fd-125`, `${DE_PREFIX}/models/fd/fd130`],


  // V
  [`${EN_PREFIX}/v-series`, `/models/v`],
  [`${ES_PREFIX}/yachts/v-series`, `${ES_PREFIX}/models/v`],
  [`${DE_PREFIX}/yachten/v-series`, `${DE_PREFIX}/models/v`],

  [`${EN_PREFIX}/v-series/v-68`, `/models/v/v68`],
  [`${ES_PREFIX}/yachts/v-series/v-68`, `${ES_PREFIX}/models/v/v68`],
  [`${DE_PREFIX}/yachten/v-series/v-68`, `${DE_PREFIX}/models/v/v68`],

  [`${EN_PREFIX}/v-series/v-72`, `/models/v/v72`],
  [`${ES_PREFIX}/yachts/v-series/v-72`, `${ES_PREFIX}/models/v/v72`],
  [`${DE_PREFIX}/yachten/v-series/v-72`, `${DE_PREFIX}/models/v/v72`],

  [`${EN_PREFIX}/v-series/v-80`, `/models/v/v80`],
  [`${ES_PREFIX}/yachts/v-series/v-80`, `${ES_PREFIX}/models/v/v80`],
  [`${DE_PREFIX}/yachten/v-series/v-80`, `${DE_PREFIX}/models/v/v80`],


  // RP
  [`${EN_PREFIX}/yachts/rp-series`, `${EN_PREFIX}/models/rp`],
  [`${ES_PREFIX}/yachts/rp-series`, `${ES_PREFIX}/models/rp`],
  [`${DE_PREFIX}/yachten/rp-series`, `${DE_PREFIX}/models/rp`],

  [`${EN_PREFIX}/yachts/rp-series/rp-97`, `${EN_PREFIX}/models/rp`],
  [`${ES_PREFIX}/yachts/rp-series/rp-97`, `${ES_PREFIX}/models/rp`],
  [`${DE_PREFIX}/yachten/rp-series/rp-97`, `${DE_PREFIX}/models/rp`],

  [`${EN_PREFIX}/yachts/rp-series/rp-110`, `${EN_PREFIX}/models/rp/rp110`],
  [`${ES_PREFIX}/yachts/rp-series/rp-110`, `${ES_PREFIX}/models/rp/rp110`],
  [`${DE_PREFIX}/yachten/rp-series/rp-110`, `${DE_PREFIX}/models/rp/rp110`],

  [`${EN_PREFIX}/yachts/rp-series/rp-120`, `${EN_PREFIX}/models/rp/rp120`],
  [`${ES_PREFIX}/yachts/rp-series/rp-120`, `${ES_PREFIX}/models/rp/rp120`],
  [`${DE_PREFIX}/yachten/rp-series/rp-120`, `${DE_PREFIX}/models/rp/rp120`],


  // EP
  [`${EN_PREFIX}/ep-series`, `${EN_PREFIX}/models/ep`],
  [`${ES_PREFIX}/yachts/ep-series`, `${ES_PREFIX}/models/ep`],
  [`${DE_PREFIX}/yachten/ep-series`, `${DE_PREFIX}/models/ep`],

  [`${EN_PREFIX}/ep-series/ep-150`, `${EN_PREFIX}/models/ep/ep150`],
  [`${ES_PREFIX}/yachts/ep-series/ep-150`, `${ES_PREFIX}/models/ep/ep150`],
  [`${DE_PREFIX}/yachten/ep-series/ep-150`, `${DE_PREFIX}/models/ep/ep150`],


  // P
  [`${EN_PREFIX}/yachts/p-series`, `${EN_PREFIX}/models/p`],
  [`${ES_PREFIX}/yachts/p-series`, `${ES_PREFIX}/models/p`],
  [`${DE_PREFIX}/yachten/p-series`, `${DE_PREFIX}/models/p`],

  [`${EN_PREFIX}/yachts/p-series/p-110`, `${EN_PREFIX}/models/p`],
  [`${ES_PREFIX}/yachts/p-series/p-110`, `${ES_PREFIX}/models/p`],
  [`${DE_PREFIX}/yachten/p-series/p-110`, `${DE_PREFIX}/models/p`],

  [`${EN_PREFIX}/yachts/p-series/p-130`, `${EN_PREFIX}/models/p`],
  [`${ES_PREFIX}/yachts/p-series/p-130`, `${ES_PREFIX}/models/p`],
  [`${DE_PREFIX}/yachten/p-series/p-130`, `${DE_PREFIX}/models/p`],

  [`${EN_PREFIX}/yachts/p-series/p-140`, `${EN_PREFIX}/models/p/p140`],
  [`${ES_PREFIX}/yachts/p-series/p-140`, `${ES_PREFIX}/models/p/p140`],
  [`${DE_PREFIX}/yachten/p-series/p-140`, `${DE_PREFIX}/models/p/p140`],


  // CC
  [`${EN_PREFIX}/yachts/cc-series`, `${EN_PREFIX}/models/cc`],
  [`${ES_PREFIX}/yachts/cc-series`, `${ES_PREFIX}/models/cc`],
  [`${DE_PREFIX}/yachten/cc-series`, `${DE_PREFIX}/models/cc`],

  [`${EN_PREFIX}/yachts/cc-series/cc-80`, `${EN_PREFIX}/models/cc/cc80-catamaran`],
  [`${ES_PREFIX}/yachts/cc-series/cc-80`, `${ES_PREFIX}/models/cc/cc80-catamaran`],
  [`${DE_PREFIX}/yachten/cc-series/cc-80`, `${DE_PREFIX}/models/cc/cc80-catamaran`],

  [`${EN_PREFIX}/yachts/cc-series/cc-110-abaco`, `${EN_PREFIX}/models/cc/cc110-abaco`],
  [`${ES_PREFIX}/yachts/cc-series/cc-110-abaco`, `${ES_PREFIX}/models/cc/cc110-abaco`],
  [`${DE_PREFIX}/yachten/cc-series/cc-110-abaco`, `${DE_PREFIX}/models/cc/cc110-abaco`],

  [`${EN_PREFIX}/yachts/cc-series/cc-110-ladygaga`, `${EN_PREFIX}/models/cc/cc110-lady-gaga`],
  [`${ES_PREFIX}/yachts/cc-series/cc-110-ladygaga`, `${ES_PREFIX}/models/cc]/cc110-lady-gaga`],
  [`${DE_PREFIX}/yachten/cc-series/cc-110-ladygaga`, `${DE_PREFIX}/models/cc]/cc110-lady-gaga`],

  [`${EN_PREFIX}/yachts/cc-series/cc-115`, `${EN_PREFIX}/models/cc/cc115`],
  [`${ES_PREFIX}/yachts/cc-series/cc-115`, `${ES_PREFIX}/models/cc/cc115`],
  [`${DE_PREFIX}/yachten/cc-series/cc-115`, `${DE_PREFIX}/models/cc/cc115`],
])

//【舊官網導轉專用】
export const resolveRedirectUrlFromOldSite = function(request:NextRequest){

  const pathname = request.nextUrl.pathname.replace(/\/$/, '') // 確保移除結尾斜線

  const redirectURL = redirectMappings.get(pathname)

  if( redirectURL ){
    return new URL(redirectURL, request.url)
  }

  return null
}
