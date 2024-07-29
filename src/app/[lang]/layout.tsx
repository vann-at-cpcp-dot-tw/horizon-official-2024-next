const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import '~~/public/assets/external-import.css'

import { isEmpty } from '~/lib/utils'
import { fetchGQL } from "~/lib/apollo"
import { QueryCommonData } from '~/queries/categories/commonData.gql'
import { QueryExternalLinks } from '~/queries/categories/externalLinks.gql'
import { QueryTranslations } from '~/queries/components/translations.gql'
import Header from '~/components/custom/Header'
import Footer from '~/components/custom/Footer'
import Providers from './providers'
import PageTransition from "~/components/custom/PageTransition"
import CookiePolicy from "~/components/custom/CookiePolicy"
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

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
  const data = await fetchGQL(QueryTranslations)

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

  return <html>
    <head>
      <title>Horizon Yachts | Fifth Largest Global Custom Luxury Yacht Builder</title>
      <meta name="description" content="From pioneering new yacht designs to employing the latest advanced composites technologies, Horizon simply backs style with substance." />
      <meta property="og:image" content="/assets/img/og.jpg" />
      <link rel="icon" type="image/x-icon" href="/assets/img/fav.png" />
      {
        process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      }
    </head>
    <body>
      {
        process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      }
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
