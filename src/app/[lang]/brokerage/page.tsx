
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION
const postsPerPage = 30

import Image from "next/image"
import { redirect } from "next/navigation"

import List from '~/app/[lang]/brokerage/(templates)/List'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { QueryBrokeragePage } from '~/queries/pages/brokerage.gql'

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

  const access = CONTENT_TYPE === 'dealer'
  if( !access ){
    redirect('/')
  }

  return <main className="pb-12 lg:pb-24">

    <div className="container serif my-6 text-center text-[32px] text-minor-900 lg:my-10">
      { DEALER_REGION === 'US' ?'Inventory' :'Brokerage' }
    </div>

    <List
    yachtConditions={yachtConditions}
    lengthOptions={settings?.lengthOptions}
    yearOptions={data?.yachtYears}
    list={posts}
    pageInfo={data?.posts?.pageInfo} />

  </main>
}

export default PageBrokerage