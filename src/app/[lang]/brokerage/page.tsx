
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION
const postsPerPage = 30

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { redirect } from "next/navigation"
import { isEmpty } from '@src/lib/helpers'
import { QueryBrokeragePage } from '@src/queries/pages/brokerage.gql'
import { fetchGQL } from "@src/lib/apollo"
import List from "@src/app/[lang]/brokerage/(templates)/List"

interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

async function PageBrokerage({params}:TypeProps){

  const { lang } = params
  const data = await fetchGQL(QueryBrokeragePage, {
    variables: {
      first: postsPerPage
    }
  })
  const settings = data?.settings?.customFields
  const posts = data?.posts?.nodes
  const yachtConditions = data?.yachtConditions?.nodes

  if( CONTENT_TYPE === 'hq'){
    redirect('/')
  }

  return <main className="pb-12 lg:pb-24">

    <div className="container serif my-6 text-center text-[32px] text-minor-900 lg:my-10">
      { DEALER_REGION === 'US' ?'Inventory' :'Brokerage' }
    </div>

    <List
    yachtConditions={yachtConditions}
    lengthOptions={settings?.lengthOptions}
    priceOptions={settings?.priceOptions}
    yearOptions={settings?.yearOptions}
    list={posts}
    pageInfo={data?.posts?.pageInfo} />

  </main>
}

export default PageBrokerage