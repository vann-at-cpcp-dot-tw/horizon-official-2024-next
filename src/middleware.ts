import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPathnameStartWithLang } from 'vanns-common-modules/dist/use/next/usePathnameWithoutLang'
import { i18n } from '~~/i18n.config'

const oldSiteRedirectRules = require(`${process.env.OLD_SITE_REDIRECT_RULES_PATH}`)

export async function middleware(request:NextRequest){
  const { resolveRedirectUrlFromOldSite } = oldSiteRedirectRules
  const redirectUrlFromOldSite = resolveRedirectUrlFromOldSite(request)
  console.log(111, redirectUrlFromOldSite)
  if( redirectUrlFromOldSite ){
    return NextResponse.redirect(redirectUrlFromOldSite as URL)
  }


  let response = NextResponse.next()
  const requestHeaders = request.headers
  const pathname = request.nextUrl.pathname
  const { searchParams } = request.nextUrl

  // Redirect if there is no locale
  const pathnameIsMissingLocale = i18n.locales.every((locale, index) => {
    return !isPathnameStartWithLang(pathname,locale.shortCode) && pathname !== `/${locale.shortCode}`
  })

  if ( pathnameIsMissingLocale ){
    const url = new URL(`/${i18n.defaultLocale.shortCode}${pathname.startsWith('/') ?'' : '/'}${pathname}`, request.url)
    // TODO:導轉語言時，將 query 帶著各有優缺點
    url.search = searchParams.toString()
    response = NextResponse.rewrite(url)
  }

  const requestLang = pathname.split('/')[1] || ''
  const isSupportedLang = i18n.locales.find((node)=>node.shortCode === requestLang)
  response.headers.set('x-lang', isSupportedLang ?requestLang :i18n.defaultLocale.shortCode)
  response.headers.set('x-url', request.url)

  return response
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  // matcher: ['/((?!api|_next/static|_next/image|_next|assets|favicon.ico).*)']
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico).*)"]
}