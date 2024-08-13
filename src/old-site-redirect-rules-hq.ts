import type { NextRequest } from 'next/server'

//【舊官網導轉專用】
export const resolveRedirectUrlFromOldSite = function(request:NextRequest){
  const pathname = request.nextUrl.pathname

  // A
  if( pathname.includes('/albums/') || pathname.endsWith('/albums') ){
    return new URL('/', request.url)
  }
  if( pathname.includes('/assurance/') || pathname.endsWith('/assurance') ){
    return new URL('/about/innovation?open=2', request.url)
  }
  if( pathname.includes('/awards/') || pathname.endsWith('/awards') ){
    return new URL('/about/horizon', request.url)
  }

  // B
  if( pathname.includes('/business/') || pathname.endsWith('/business') ){
    return new URL('/about/horizon', request.url)
  }

  // C
  if( pathname.includes('/commitment/') || pathname.endsWith('/commitment') ){
    return new URL('/about/horizon', request.url)
  }
  if( pathname.includes('/craftsmanship/') || pathname.endsWith('/craftsmanship') ){
    return new URL('/about/design-and-craft', request.url)
  }

  // D
  if( pathname.includes('/dealer/') || pathname.endsWith('/dealer') ){
    return new URL('/dealers', request.url)
  }
  if( pathname.includes('/design/') || pathname.endsWith('/design') ){
    return new URL('/about/design-and-craft', request.url)
  }

  // E
  if( (pathname.includes('/events/') && !pathname.includes('/news/events/')) || (pathname.endsWith('/events') && !pathname.endsWith('/news/events')) ){
    return new URL('/news/events', request.url)
  }
  if( pathname.includes('/engineering/') || pathname.endsWith('/engineering') ){
    return new URL('/about/innovation?open=1', request.url)
  }

  // F
  if( pathname.includes('/facilities/') || pathname.endsWith('/facilities') ){
    return new URL('/about/innovation?open=3', request.url)
  }

  // G

  // H
  if( pathname.includes('/heritage/') || pathname.endsWith('/heritage') ){
    return new URL('/about/innovation', request.url)
  }
  if( pathname.includes('/history/') || pathname.endsWith('/history') ){
    return new URL('/about/horizon', request.url)
  }

  // I J K L

  // M
  if( pathname.endsWith('/milestone') && !pathname.endsWith('/about/horizon/milestone') ){
    return new URL('/about/horizon/milestone', request.url)
  }

  // N
  if( pathname.includes('/new/') || pathname.endsWith('/new') ){
    return new URL('/news', request.url)
  }

  if( pathname.endsWith('/newsletter') || pathname.endsWith('/newsletter/') ){
    return new URL('/publications/brand-publication', request.url)
  }

  if( pathname.includes('/newsletter/') ){
    return new URL('/publications', request.url)
  }

  // O
  if( pathname.includes('/organization/') || pathname.endsWith('/organization') ){
    return new URL('/about/the-group', request.url)
  }

  // P
  if( pathname.includes('/product/17071014023979/') || pathname.endsWith('/product/17071014023979') ){
    return new URL('/models', request.url)
  }

  // Q R S
  if( pathname.includes('/qa/') || pathname.endsWith('/qa') ){
    return new URL('/QA', request.url)
  }

  // T
  if( pathname.includes('/technology/') || pathname.endsWith('/technology') ){
    return new URL('/about/innovation?open=0', request.url)
  }
  if( pathname.includes('/terms/') || pathname.endsWith('/terms') ){
    return new URL('/terms-and-conditions', request.url)
  }

  // U

  // V
  if( pathname.includes('/videos/') || pathname.endsWith('/videos') ){
    return new URL('https://www.youtube.com/user/TheHorizonYacht')
  }

  //W X Y Z


  // 特定船頁面
  if(
    pathname.includes('/model/17021615182922/')
    || pathname.endsWith('/model/17021615182922')
  ){
    return new URL('/models/fd', request.url)
  }

  if(
    pathname.endsWith('/product/17021615182922/90')
    || pathname.endsWith('/product/17021615182922/91')
  ){
    return new URL('/models/fd/fd75', request.url)
  }

  if(
    pathname.endsWith('/product/17021615182922/7')
    || pathname.endsWith('/product/17021615182922/41')
  ){
    return new URL('/models/fd/fd80', request.url)
  }

  if(
    pathname.endsWith('/product/17021615182922/12')
    || pathname.endsWith('/product/17021615182922/44')
    || pathname.endsWith('/product/17021615182922/43')
  ){
    return new URL('/models/fd/fd90', request.url)
  }

  if(
    pathname.endsWith('/product/17021615182922/95')
    || pathname.endsWith('/product/17021615182922/94')
    || pathname.endsWith('/product/17021615182922/96')
    || pathname.endsWith('/product/17021615182922/97')
  ){
    return new URL('/models/fd/fd100', request.url)
  }

  if(
    pathname.endsWith('/product/17021615182922/99')
    || pathname.endsWith('/product/17021615182922/46')
    || pathname.endsWith('/product/17021615182922/45')
    || pathname.endsWith('/product/17021615182922/98')
  ){
    return new URL('/models/fd/fd110', request.url)
  }

  if(
    pathname.endsWith('/product/17021615182922/93')
    || pathname.endsWith('/product/17021615182922/92')
    || pathname.endsWith('/product/17021615182922/93')
    || pathname.endsWith('/product/17021615182922/92')
  ){
    return new URL('/models/fd/fd130', request.url)
  }

  if(
    pathname.includes('/model/17021615185450/')
    || pathname.endsWith('/model/17021615185450')
    || pathname.endsWith('/product/17021615185450/48')
    || pathname.endsWith('/product/17021615185450/47')
    || pathname.endsWith('/product/17021615185450/5')
    || pathname.endsWith('/product/17021615185450/57')
    || pathname.endsWith('/product/17021615185450/56')
  ){
    return new URL('/models/e', request.url)
  }

  if(
    pathname.endsWith('/product/17021615185450/50')
    || pathname.endsWith('/product/17021615185450/51')
  ){
    return new URL('/models/e/e62', request.url)
  }

  if(
    pathname.endsWith('/product/17021615185450/52')
    || pathname.endsWith('/product/17021615185450/53')
  ){
    return new URL('/models/e/e75', request.url)
  }

  if(
    pathname.endsWith('/product/17021615185450/54')
   || pathname.endsWith('/product/17021615185450/55')
  ){
    return new URL('/models/e/e81', request.url)
  }

  if(
    pathname.endsWith('/product/17021615185450/6')
    || pathname.endsWith('/product/17021615185450/75')
  ){
    return new URL('/models/e/e90', request.url)
  }

  if(
    pathname.endsWith('/product/17021615185450/72')
    || pathname.endsWith('/product/17021615185450/71')
  ){
    return new URL('/models/e/e100', request.url)
  }

  if(
    pathname.includes('/model/17021615180526/')
    || pathname.endsWith('/model/17021615180526')
    || pathname.endsWith('/product/17021615180526/38')
    || pathname.endsWith('/product/17021615180526/39')
  ){
    return new URL('/models/rp', request.url)
  }

  if(
    pathname.endsWith('/product/17021615180526/10')
    || pathname.endsWith('/product/17021615180526/76')
  ){
    return new URL('/models/rp/rp110', request.url)
  }

  if(
    pathname.endsWith('/product/17021615180526/11')
    || pathname.endsWith('/product/17021615180526/40')
  ){
    return new URL('/models/rp/rp120', request.url)
  }

  if(
    pathname.includes('/model/17021615191493/')
    || pathname.endsWith('/model/17021615191493')
  ){
    return new URL('/models/v', request.url)
  }

  if(
    pathname.endsWith('/product/17021615191493/86')
    || pathname.endsWith('/product/17021615191493/87')
  ){
    return new URL('/models/v/v68', request.url)
  }

  if(
    pathname.endsWith('/product/17021615191493/8')
    || pathname.endsWith('/product/17021615191493/60')
  ){
    return new URL('/models/v/v72', request.url)
  }

  if(
    pathname.endsWith('/product/17021615191493/9')
    || pathname.endsWith('/product/17021615191493/61')
  ){
    return new URL('/models/v/v80', request.url)
  }

  if(
    pathname.includes('/model/17021615193266/')
    || pathname.endsWith('/model/17021615193266')
  ){
    return new URL('/models/pc', request.url)
  }

  if(
    pathname.endsWith('/product/17021615193266/13')
    || pathname.endsWith('/product/17021615193266/62')
  ){
    return new URL('/models/pc/pc52', request.url)
  }

  if(
    pathname.endsWith('/product/17021615193266/101')
    || pathname.endsWith('/product/17021615193266/100')
  ){
    return new URL('/models/pc/pc68', request.url)
  }

  if(
    pathname.endsWith('/product/17021615193266/16')
    || pathname.endsWith('/product/17021615193266/63')
  ){
    return new URL('/models/pc/pc60', request.url)
  }

  if(
    pathname.endsWith('/product/17021615193266/4')
    || pathname.endsWith('/product/17021615193266/3')
  ){
    return new URL('/models/pc/pc65', request.url)
  }

  if(
    pathname.endsWith('/product/17021615193266/65')
    || pathname.endsWith('/product/17021615193266/64')
  ){
    return new URL('/models/pc/pc74', request.url)
  }

  if(
    pathname.includes('/model/17021615164132/')
    || pathname.endsWith('/model/17021615164132')
    || pathname.endsWith('/product/17021615164132/89')
  ){
    return new URL('/models/ep', request.url)
  }

  if(
    pathname.endsWith('/product/17021615164132/15')
    || pathname.endsWith('/product/17021615164132/25')
  ){
    return new URL('/models/ep/ep150', request.url)
  }

  if(
    pathname.includes('/model/17021614323133/')
    || pathname.endsWith('/model/17021614323133')
    || pathname.endsWith('/product/17021615180526/39')
    || pathname.endsWith('/product/17021614323133/2')
    || pathname.endsWith('/product/17021614323133/81')
    || pathname.endsWith('/product/17021614323133/79')
    || pathname.endsWith('/product/17021614323133/84')
    || pathname.endsWith('/product/17021614323133/85')
    || pathname.endsWith('/product/17021614323133/29')
    || pathname.endsWith('/product/17021614323133/30')
    || pathname.endsWith('/product/17021614323133/82')
    || pathname.endsWith('/product/17021614323133/80')
  ){
    return new URL('/models/p', request.url)
  }

  if(
    pathname.endsWith('/product/17021614323133/3')
    || pathname.endsWith('/product/17021614323133/37')
  ){
    return new URL('/models/p/p140', request.url)
  }

  if(
    pathname.includes('/model/17021615200993/')
    || pathname.endsWith('/model/17021615200993')
  ){
    return new URL('/models/cc', request.url)
  }

  if(
    pathname.endsWith('/product/17021615200993/22')
    || pathname.endsWith('/product/17021615200993/66')
  ){
    return new URL('/models/cc/cc80-catamaran', request.url)
  }

  if(
    pathname.endsWith('/product/17021615200993/23')
    || pathname.endsWith('/product/17021615200993/69')
  ){
    return new URL('/models/cc/cc115', request.url)
  }

  if(
    pathname.endsWith('/product/17021615200993/68')
    || pathname.endsWith('/product/17021615200993/17')
  ){
    return new URL('/models/cc/cc110-abaco', request.url)
  }

  if(
    pathname.endsWith('/product/17021615200993/18')
    || pathname.endsWith('/product/17021615200993/67')
  ){
    return new URL('/models/cc/cc110-lady-gaga', request.url)
  }
}

