
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION
const postsPerPage = 30

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { redirect } from "next/navigation"
import { isEmpty } from '~/lib/utils'
import { QueryCharterPage } from '~/queries/pages/charter.gql'
import { fetchGQL } from '~/lib/apollo'
import List from '~/app/[lang]/brokerage/(templates)/List'
import T from 'vanns-common-modules/dist/components/react/T'

interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

async function PageCharters({params}:TypeProps){

  const access = CONTENT_TYPE === 'dealer' && DEALER_REGION === 'AU'
  if( !access ){
    redirect('/')
  }

  const { lang } = params
  const data = await fetchGQL(QueryCharterPage, {
    variables: {
      first: postsPerPage
    }
  })
  const settings = data?.settings?.customFields
  const posts = data?.posts?.nodes
  const yachtConditions = data?.yachtConditions?.nodes

  return <main className="pb-24">

    <div className="container serif my-10 text-center text-[32px] text-minor-900">
      <T text="Charter" />
    </div>

    <List
    queryPostType="charter"
    yachtConditions={yachtConditions}
    lengthOptions={settings?.lengthOptions}
    yearOptions={data?.yachtYears}
    list={posts}
    pageInfo={data?.posts?.pageInfo} />

  </main>
}

export default PageCharters