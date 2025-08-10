const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import Image from "next/image"
import { redirect } from "next/navigation"
import T from 'vanns-common-modules/dist/components/react/T'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { Button } from '~/components/ui/button'
import buttonStyles from '~/components/ui/button.module.sass'
import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { QueryDealersWithRegion } from '~/queries/pages/dealers.gql'
import { i18n } from "~~/i18n.config"

import Regions from "./(templates)/Regions"

interface TypeProps {
  params: Promise<{
    lang: string
  }>
}

interface TypeState {}

export default async function PageDealers({params}:TypeProps){
  const { lang } = await params
  const access = CONTENT_TYPE === 'hq'
  if( !access ){
    if( lang === i18n.defaultLocale.shortCode ){
      redirect('/contact')
    }else{
      redirect(`/${lang}/contact`)
    }
  }


  const data = await fetchGQL(QueryDealersWithRegion, {
    context: {
      uri: HQ_API_URL
    }
  })
  const dealerRegions = data?.dealerRegions?.nodes || []

  return <main className="pb-28">
    <Regions className="pb-28 pt-16" regions={dealerRegions} />
    <div className="container text-center">
      <div className="serif mb-6 text-[32px] text-minor-900">
        <T text="Personal and Virtual Tours <i>available.</i>" />
      </div>
      <div className="flex justify-center">
        <LinkWithLang href="/contact" lang={lang}>
          <Button className={`${buttonStyles['rounded-golden']}`}>
            <T text="Contact Us" />
          </Button>
        </LinkWithLang>
      </div>
    </div>
  </main>
}
