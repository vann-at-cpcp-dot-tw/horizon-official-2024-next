const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { QueryDealersWithRegion } from '@src/queries/pages/dealers.gql'
import { fetchGQL } from "@root/src/lib/apollo"
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"
import Regions from "./(templates)/Regions"
import { redirect } from "next/navigation"

interface TypeProps {
  params: {
    lang: string
  }
}

interface TypeState {}

async function PageDealers({params}:TypeProps){

  const { lang } = params

  if( CONTENT_TYPE === 'dealer '){
    redirect('/')
  }

  const data = await fetchGQL(QueryDealersWithRegion)
  const dealerRegions = data?.dealerRegions?.nodes || []

  return <main className="pb-28">

    <Regions className="pb-28 pt-16" regions={dealerRegions} />

    <div className="container text-center">
      <div className="serif mb-6 text-[32px] text-minor-900">Personal <span className="italic">and</span>  Virtual Tours  <span className="italic">available.</span></div>
      <div className="flex justify-center">
        <LinkWithLang href="/contact" lang={lang}>
          <Button className={`${buttonStyles['rounded-golden']}`}>Contact Us</Button>
        </LinkWithLang>
      </div>
    </div>
  </main>
}

export default PageDealers