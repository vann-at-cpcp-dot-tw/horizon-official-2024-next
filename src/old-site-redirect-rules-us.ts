import type { NextRequest } from 'next/server'
export const resolveRedirectUrlFromOldSite = function(request:NextRequest){
  const pathname = request.nextUrl.pathname

  // A
  if(
    pathname.includes('/articles/')
    || pathname.endsWith('/articles')
  ){
    return new URL('/publications/reviews', request.url)
  }

  // B
  // C
  if(
    pathname.includes('/commitment/')
    || pathname.endsWith('/commitment')
  ){
    return new URL('/about/horizon', request.url)
  }
  if(
    pathname.includes('/cookie-policy/')
    || pathname.endsWith('/cookie-policy')
  ){
    return new URL('/terms-and-conditions', request.url)
  }

  // D
  if(
    pathname.includes('/define-at-a-distance/')
    || pathname.endsWith('/define-at-a-distance')
  ){
    return new URL('/about/horizon', request.url)
  }

  // E
  if(
    (pathname.includes('/events/') && !pathname.includes('/news/events/'))
    || (pathname.endsWith('/events') && !pathname.endsWith('/news/events'))
  ){
    return new URL('/news/events', request.url)
  }

  // F
  // G
  if(
    pathname.includes('/galleries/')
    || pathname.endsWith('/galleries')
  ){
    return new URL('/news', request.url)
  }

  // H
  if(
    pathname.includes('/history/')
    || pathname.endsWith('/history')
  ){
    return new URL('/about/horizon', request.url)
  }

  // I
  // J
  // K
  // L
  if(
    pathname.includes('/locations/')
    || pathname.endsWith('/locations')
  ){
    return new URL('/contact', request.url)
  }

  // M
  // N
  // O
  if(
    pathname.includes('/organization/')
    || pathname.endsWith('/organization')
  ){
    return new URL('/about/the-group', request.url)
  }
  if(
    pathname.includes('/our-team/')
    || pathname.endsWith('/our-team')
  ){
    return new URL('/team', request.url)
  }

  // P
  // Q
  if(
    pathname.includes('/q-and-a/')
    || pathname.endsWith('/q-and-a')
  ){
    return new URL('/QA', request.url)
  }

  // R
  // S
  // T
  if(
    pathname.includes('/technology/')
    || pathname.endsWith('/technology')
  ){
    return new URL('/about/innovation', request.url)
  }

  // U
  // V
  // W
  // X
  // Y
  // Z

  // 特定船頁面
  // C 系列
  if(
    pathname.endsWith('/cc-series/')
    || pathname.endsWith('/cc-series')
  ){
    return new URL('/models/cc', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-cc110/40/')
    || pathname.endsWith('/new-yachts/horizon-cc110/40')
  ){
    return new URL('/models/cc/cc110-abaco', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-cc115-adagio/81/')
    || pathname.endsWith('/new-yachts/horizon-cc115-adagio/81')
  ){
    return new URL('/models/cc/cc115', request.url)
  }

  // E 系列
  if(
    pathname.endsWith('/e-series/')
    || pathname.endsWith('/e-series')
  ){
    return new URL('/models/e', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-e75/36/')
    || pathname.endsWith('/new-yachts/horizon-e75/36')
  ){
    return new URL('/models/e/e75', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-e81/30/')
    || pathname.endsWith('/new-yachts/horizon-e81/30')
  ){
    return new URL('/models/e/e81', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-e90/33/')
    || pathname.endsWith('/new-yachts/horizon-e90/33')
  ){
    return new URL('/models/e/e90', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-e100/114/')
    || pathname.endsWith('/new-yachts/horizon-e100/114')
  ){
    return new URL('/models/e/e100', request.url)
  }

  // EP 系列
  if(
    pathname.endsWith('/ep-series/')
    || pathname.endsWith('/ep-series')
  ){
    return new URL('/models/ep', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-ep150/15/')
    || pathname.endsWith('/new-yachts/horizon-ep150/15')
  ){
    return new URL('/models/ep/ep150', request.url)
  }

  // FD 系列
  if(
    pathname.endsWith('/fd-series/')
    || pathname.endsWith('/fd-series')
  ){
    return new URL('/models/fd', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-fd75/103/')
    || pathname.endsWith('/new-yachts/horizon-fd75/103')
  ){
    return new URL('/models/fd/fd75', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-fd80/79/')
    || pathname.endsWith('/new-yachts/horizon-fd80/79')
  ){
    return new URL('/models/fd/fd80', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-fd90/61/')
    || pathname.endsWith('/new-yachts/horizon-fd90/61')
  ){
    return new URL('/models/fd/fd90', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-fd100/92/')
    || pathname.endsWith('/new-yachts/horizon-fd100/92')
  ){
    return new URL('/models/fd/fd100', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-fd110/59/')
    || pathname.endsWith('/new-yachts/horizon-fd110/59')
  ){
    return new URL('/models/fd/fd110', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-fd130/75/')
    || pathname.endsWith('/new-yachts/horizon-fd130/75')
  ){
    return new URL('/models/fd/fd130', request.url)
  }

  // P 系列
  if(
    pathname.endsWith('/p-series/')
    || pathname.endsWith('/p-series')
    || pathname.endsWith('/new-yachts/horizon-p110/16/')
    || pathname.endsWith('/new-yachts/horizon-p110/16')
    || pathname.endsWith('/new-yachts/horizon-p130-after-you/42/')
    || pathname.endsWith('/new-yachts/horizon-p130-after-you/42')
    || pathname.endsWith('/new-yachts/horizon-p130-miss-rose/45/')
    || pathname.endsWith('/new-yachts/horizon-p130-miss-rose/45')
    || pathname.endsWith('/new-yachts/horizon-p130-bikini-queen-2/44/')
    || pathname.endsWith('/new-yachts/horizon-p130-bikini-queen-2/44')
    || pathname.endsWith('/new-yachts/horizon-p130-angara/41/')
    || pathname.endsWith('/new-yachts/horizon-p130-angara/41')
    || pathname.endsWith('/new-yachts/horizon-p130-antithesis/43/')
    || pathname.endsWith('/new-yachts/horizon-p130-antithesis/43')
  ){
    return new URL('/models/p', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-p140/17/')
    || pathname.endsWith('/new-yachts/horizon-p140/17')
  ){
    return new URL('/models/p/p140', request.url)
  }

  // PC 系列
  if(
    pathname.endsWith('/pc-series/')
    || pathname.endsWith('/pc-series')
  ){
    return new URL('/models/pc', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-pc52/18/')
    || pathname.endsWith('/new-yachts/horizon-pc52/18')
  ){
    return new URL('/models/pc/pc52', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-pc60/19/')
    || pathname.endsWith('/new-yachts/horizon-pc60/19')
  ){
    return new URL('/models/pc/pc60', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-pc65/71/')
    || pathname.endsWith('/new-yachts/horizon-pc65/71')
  ){
    return new URL('/models/pc/pc65', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-pc74/67/')
    || pathname.endsWith('/new-yachts/horizon-pc74/67')
  ){
    return new URL('/models/pc/pc74', request.url)
  }

  // RP 系列
  if(
    pathname.endsWith('/rp-series/')
    || pathname.endsWith('/rp-series')
  ){
    return new URL('/models/rp', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-rp110/21/')
    || pathname.endsWith('/new-yachts/horizon-rp110/21')
  ){
    return new URL('/models/rp/rp110', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-rp120/22/')
    || pathname.endsWith('/new-yachts/horizon-rp120/22')
  ){
    return new URL('/models/rp/rp120', request.url)
  }

  // V 系列
  if(
    pathname.endsWith('/v-series/')
    || pathname.endsWith('/v-series')
  ){
    return new URL('/models/v', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-v68/64/')
    || pathname.endsWith('/new-yachts/horizon-v68/64')
  ){
    return new URL('/models/v/v68', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-v72/23/')
    || pathname.endsWith('/new-yachts/horizon-v72/23')
  ){
    return new URL('/models/v/v72', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-v77-cmy/120/')
    || pathname.endsWith('/new-yachts/horizon-v77-cmy/120')
  ){
    return new URL('/models/v/v68', request.url)
  }
  if(
    pathname.endsWith('/new-yachts/horizon-v80/24/')
    || pathname.endsWith('/new-yachts/horizon-v80/24')
  ){
    return new URL('/models/v/v80', request.url)
  }
}
