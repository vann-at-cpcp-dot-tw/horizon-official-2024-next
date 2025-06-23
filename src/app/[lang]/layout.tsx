const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import '~~/public/assets/external-import.css'

import { GoogleTagManager } from '@next/third-parties/google'
import Script from "next/script"

import CookiePolicy from "~/components/custom/CookiePolicy"
import Footer from '~/components/custom/Footer'
import Header from '~/components/custom/Header'
import PageTransition from "~/components/custom/PageTransition"
import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { QueryCommonData } from '~/queries/categories/commonData.gql'
import { QueryExternalLinks } from '~/queries/categories/externalLinks.gql'
import { QueryTranslations } from '~/queries/components/translations.gql'

import Providers from './providers'

async function getCommonData(){
  const data = await fetchGQL(QueryCommonData, {
    context: {
      uri: HQ_API_URL
    },
  })
  return data
}

async function getExternalLinks(){
  const data = await fetchGQL(QueryExternalLinks)
  return data
}

async function getTranslations(){
  const data = await fetchGQL(QueryTranslations, {
    context: {
      uri: HQ_API_URL
    },
  })

  // 整理成 key-value 形式
  const translations:any[] = data?.translationSettings?.translationFields?.translations || []
  return translations.reduce<Record<string, string>>((acc:Record<string, string>, node:{key:string, value:string})=>{
    const { key, value } = node ?? {}
    if( !key || !value ){
      return acc
    }
    return {
      ...acc,
      [key]: value
    }
  }, {})
}

export default async function RootLayout({
  params,
  children
}: {
  params: {
    lang: string
  }
  children: React.ReactNode
}) {

  // fetch data from server side
  const { lang } = params
  const commonData = await getCommonData()
  const externalLinks = await getExternalLinks()
  const translations = await getTranslations()
  const titleRegion: Record<string, string> = {
    AU: 'Australia',
    EU: 'Europe',
    US: 'USA',
  }
  return <html>
    <head>
      <title>{`Horizon Yachts ${titleRegion?.[DEALER_REGION as string] ?`${titleRegion[DEALER_REGION as string]} ` :''} | Fifth Largest Global Custom Luxury Yacht Builder`}</title>
      <meta name="description" content="From pioneering new yacht designs to employing the latest advanced composites technologies, Horizon simply backs style with substance." />
      <meta property="og:image" content="/assets/img/og.jpg" />
      <link rel="icon" type="image/x-icon" href="/assets/img/fav.png" />
      {
        process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      }
      {
        // 20250512 新增第二組 GTM ID
        process.env.NEXT_PUBLIC_GTM_ID_2 && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID_2} />
      }
      {
        // 20250512 歐洲根據不同語系新增不同的 GTM ID
        process.env.NEXT_PUBLIC_GTM_ID_en
        && lang === 'en'
        && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID_en} />
      }
      {
        // 20250512 歐洲根據不同語系新增不同的 GTM ID
        process.env.NEXT_PUBLIC_GTM_ID_de
        && lang === 'de'
        && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID_de} />
      }
      {
        // 20250512 歐洲根據不同語系新增不同的 GTM ID
        process.env.NEXT_PUBLIC_GTM_ID_es
        && lang === 'es'
        && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID_es} />
      }
      {
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
      }
      {
        process.env.NEXT_PUBLIC_USERWAY_ACCOUNT && <Script src="https://cdn.userway.org/widget.js" data-account={process.env.NEXT_PUBLIC_USERWAY_ACCOUNT}/>
      }
    </head>
    <body>
      {/* {
        process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      } */}
      <Providers
      commonData={{
        ...(commonData || {}),
        externalLinks: externalLinks?.globalSettings?.externalLinks
      }}
      translations={translations}>
        <div id="app">
          <Header />
          <PageTransition>
            { children }
          </PageTransition>
          <Footer />
          <CookiePolicy />
        </div>
      </Providers>
    </body>
  </html>
}
