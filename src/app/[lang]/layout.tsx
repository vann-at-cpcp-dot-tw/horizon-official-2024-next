const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
import '@root/public/import.css'

import { isEmpty } from '@src/lib/helpers'
import { fetchGQL } from "@root/src/lib/apollo"
import { QueryCommonData } from '@src/queries/categories/commonData.gql'
import Header from '@src/components/custom/Header'
import Footer from '@src/components/custom/Footer'
import Providers from './providers'
import PageTransition from "@src/components/custom/PageTransition"
import CookiePolicy from "@src/components/custom/CookiePolicy"




export const metadata = {
  // metadataBase: `${process.env.DOMAIN}`,
  title: 'HORIZON',
  description: '',
  icons: {
    icon: `${BASE_PATH}/assets/img/fav.png`,
  },
  openGraph: {
    title: 'HORIZON',
    description: '',
    // images: [`${BASE_PATH}/assets/img/og.jpg`],
  },
}

async function getCommonData(){
  const data = fetchGQL(QueryCommonData)
  return data
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  // fetch data from server side
  const commonData = await getCommonData()

  return <html>
    <body>
      <Providers commonData={commonData}>
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
