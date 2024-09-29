import type { NextRequest } from 'next/server'

export const resolveRedirectUrlFromOldSite = function(request:NextRequest){
  const pathname = request.nextUrl.pathname

  // A
  if(
    pathname.includes('/about-us/discover-horizon-yachts/')
    || pathname.endsWith('/about-us/discover-horizon-yachts')
    || pathname.includes('/about-us/horizon-awards/')
    || pathname.endsWith('/about-us/horizon-awards')
  ){
    return new URL('/about/horizon', request.url)
  }
  if( pathname.includes('/about-us/the-horizon-group/') || pathname.endsWith('/about-us/the-horizon-group') ){
    return new URL('/about/the-group', request.url)
  }
  if( pathname.includes('/about-us/horizon-heritage/') || pathname.endsWith('/about-us/horizon-heritage') ){
    return new URL('/about/innovation', request.url)
  }
  if( pathname.includes('/about-us/horizon-milestones/') || pathname.endsWith('/about-us/horizon-milestones') ){
    return new URL('/about/horizon/milestone', request.url)
  }
  if( pathname.includes('/about-us/horizon-yacht-australia/') || pathname.endsWith('/about-us/horizon-yacht-australia') ){
    return new URL('/team', request.url)
  }

  // B
  if( pathname.includes('/boatsforsale/') || pathname.endsWith('/boatsforsale') ){
    return new URL('/brokerage', request.url)
  }

  // C
  if( pathname.includes('/contact-us/') || pathname.endsWith('/contact-us') ){
    return new URL('/contact', request.url)
  }

  // D
  // E
  // F

  // G
  if( pathname.includes('/global-roaming/') || pathname.endsWith('/global-roaming/') ){
    return new URL('/events', request.url)
  }

  // H
  if( pathname.includes('/horizon-models/') || pathname.endsWith('/horizon-models') ){
    return new URL('/models', request.url)
  }

  // I
  // J
  // K
  // L
  // M
  // N
  // O
  // P
  // Q
  // R
  // S
  // T
  // U
  // V
  // W
  // X
  // Y
  // Z

  // 特定船頁面
  // C 系列
  if( pathname.endsWith('/cc-series/') || pathname.endsWith('/cc-series') ){
    return new URL('/models/cc', request.url)
  }
  if( pathname.endsWith('/boats/cc110-abaco/') || pathname.endsWith('/boats/cc110-abaco') ){
    return new URL('/models/cc/cc110-abaco', request.url)
  }
  if( pathname.endsWith('/boats/cc110ladygaga/') || pathname.endsWith('/boats/cc110ladygaga') ){
    return new URL('/models/cc/cc110-lady-gaga', request.url)
  }
  if( pathname.endsWith('/boats/cc115/') || pathname.endsWith('/boats/cc115') ){
    return new URL('/models/cc/cc115', request.url)
  }

  // E 系列
  if( pathname.endsWith('/e-series/') || pathname.endsWith('/e-series') ){
    return new URL('/models/e', request.url)
  }
  if( pathname.endsWith('/boats/e75/') || pathname.endsWith('/boats/e75') ){
    return new URL('/models/e/e75', request.url)
  }
  if( pathname.endsWith('/boats/e81/') || pathname.endsWith('/boats/e81') ){
    return new URL('/models/e/e81', request.url)
  }
  if( pathname.endsWith('/boats/e90/') || pathname.endsWith('/boats/e90') ){
    return new URL('/models/e/e90', request.url)
  }
  if( pathname.endsWith('/boats/e98/') || pathname.endsWith('/boats/e98') ){
    return new URL('/models/e/e98', request.url)
  }

  // EP 系列
  if( pathname.endsWith('/ep-series/') || pathname.endsWith('/ep-series') ){
    return new URL('/models/ep', request.url)
  }
  if( pathname.endsWith('/boats/ep150/') || pathname.endsWith('/boats/ep150') ){
    return new URL('/models/ep/ep150', request.url)
  }


  // FD 系列
  if( pathname.endsWith('/fd-series/') || pathname.endsWith('/fd-series') ){
    return new URL('/models/fd', request.url)
  }
  if( pathname.endsWith('/boats/fd75/') || pathname.endsWith('/boats/fd75') ){
    return new URL('/models/fd/fd75', request.url)
  }
  if( pathname.endsWith('/boats/fd80') || pathname.endsWith('/boats/fd80') ){
    return new URL('/models/fd/fd80', request.url)
  }
  if( pathname.endsWith('/boats/fd90') || pathname.endsWith('/boats/fd90') ){
    return new URL('/models/fd/fd90', request.url)
  }
  if(
    pathname.endsWith('/boats/fd100skyline/')
    || pathname.endsWith('boats/fd100skyline')
    || pathname.endsWith('/boats/fd100trideck/')
    || pathname.endsWith('/boats/fd100trideck')
  ){
    return new URL('/models/fd/fd100', request.url)
  }
  if(
    pathname.endsWith('/boats/fd110skyline/')
    || pathname.endsWith('boats/fd110skyline')
    || pathname.endsWith('/boats/fd110trideck/')
    || pathname.endsWith('/boats/fd110trideck')
  ){
    return new URL('/models/fd/fd110', request.url)
  }
  if( pathname.endsWith('/boats/fd125/') || pathname.endsWith('/boats/fd125') ){
    return new URL('/models/fd/130', request.url)
  }

  // P 系列
  if(
    pathname.endsWith('/p-series/')
    || pathname.endsWith('/p-series')
    || pathname.endsWith('/boats/p130afteryou/')
    || pathname.endsWith('/boats/p130afteryou')
    || pathname.endsWith('/boats/p130missrose/')
    || pathname.endsWith('/boats/p130missros')
    || pathname.endsWith('/boats/p130bikiniqueen2/')
    || pathname.endsWith('/boats/p130bikiniqueen2')
    || pathname.endsWith('/boats/p130angara/')
    || pathname.endsWith('/boats/p130angara')
    || pathname.endsWith('/boats/p130antithesis/')
    || pathname.endsWith('/boats/p130antithesis')
  ){
    return new URL('/models/p', request.url)
  }
  if(  pathname.endsWith('/boats/p140/') || pathname.endsWith('/boats/p140') ){
    return new URL('/models/p/p140', request.url)
  }


  // PC 系列
  if( pathname.endsWith('/pc-series/') || pathname.endsWith('/pc-series') ){
    return new URL('/models/pc', request.url)
  }
  if( pathname.endsWith('/boats/pc52/') || pathname.endsWith('/boats/pc52') ){
    return new URL('/models/pc/pc52', request.url)
  }
  if( pathname.endsWith('/boats/pc60/') || pathname.endsWith('/boats/pc60') ){
    return new URL('/models/pc/pc60', request.url)
  }
  if( pathname.endsWith('/boats/pc65/') || pathname.endsWith('/boats/pc65') ){
    return new URL('/models/pc/pc65', request.url)
  }
  if( pathname.endsWith('/boats/pc74/') || pathname.endsWith('/boats/pc74') ){
    return new URL('/models/pc/pc74', request.url)
  }

  // RP 系列
  if(
    pathname.endsWith('/rp-series/')
    || pathname.endsWith('/rp-series')
    || pathname.endsWith('/boats/rp100/')
    || pathname.endsWith('/boats/rp100')
  ){
    return new URL('/models/rp', request.url)
  }
  if( pathname.endsWith('/boats/rp110/') || pathname.endsWith('/boats/rp110') ){
    return new URL('/models/rp/rp110', request.url)
  }
  if( pathname.endsWith('/boats/rp120/') || pathname.endsWith('/boats/rp120') ){
    return new URL('/models/rp/rp120', request.url)
  }

  // V 系列
  if( pathname.endsWith('/v-series/') || pathname.endsWith('/v-series') ){
    return new URL('/models/v', request.url)
  }
  if( pathname.endsWith('/boats/v68/') || pathname.endsWith('/boats/v68') ){
    return new URL('/models/v/v68', request.url)
  }
  if( pathname.endsWith('/boats/v72/') || pathname.endsWith('/boats/v72') ){
    return new URL('/models/v/v72', request.url)
  }
  if( pathname.endsWith('/boats/v80/') || pathname.endsWith('/boats/v80') ){
    return new URL('/models/v/v80', request.url)
  }
}
