
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { redirect } from "next/navigation"
import { isEmpty } from '@src/lib/helpers'
import { QueryBrokeragePage } from '@src/queries/pages/brokerage.gql'
import { fetchGQL } from "@src/lib/apollo"
import List from "./(templates)/List"

interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

async function PageBrokerage({params}:TypeProps){

  const { lang } = params
  const data = await fetchGQL(QueryBrokeragePage)
  const brokerageSettings = data?.brokerageSettings?.brokerageSettingCustomFields
  const brokerages = data?.brokerages?.nodes
  const yachtConditions = data?.yachtConditions?.nodes

  if( CONTENT_TYPE === 'hq '){
    redirect('/')
  }

  return <main className="pb-24">

    <div className="container serif my-10 text-center text-[32px] text-minor-900">
      { DEALER_REGION === 'US' ?'Inventory' :'Brokerage' }
    </div>

    <List
    yachtConditions={yachtConditions}
    brokerageLengthOptions={brokerageSettings?.brokerageLengthOptions}
    brokeragePriceOptions={brokerageSettings?.brokeragePriceOptions}
    brokerageYearOptions={brokerageSettings?.brokerageYearOptions}
    brokerages={brokerages}
    />

  </main>
}

export default PageBrokerage