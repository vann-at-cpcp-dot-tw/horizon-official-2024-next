import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from '~~/i18n.config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales.map((node)=>node.shortCode)
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

  const locale = matchLocale(languages, locales, i18n.defaultLocale.shortCode)
  return locale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = i18n.locales.every(locale => !pathname.startsWith(`/${locale.shortCode}/`) && pathname !== `/${locale.shortCode}`)

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {

    const locale = getLocale(request)

    if( locale === i18n.defaultLocale.shortCode ){
      return NextResponse.rewrite(
        new URL(`/${locale}${pathname.startsWith('/') ?'' :'/'}${pathname}`, request.url)
      )
    }

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  // .*\\..* matches "url.extension"
  // https://github.com/vercel/next.js/discussions/36308#discussioncomment-3758041
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico).*)"]
  // matcher: ['/((?!api|_next/static|_next/image|_next|.*\\..*|favicon.ico).*)']
}