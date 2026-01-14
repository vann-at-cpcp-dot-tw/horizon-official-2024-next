
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION
const postsPerPage = 30

import { notFound } from "next/navigation"
import T from 'vanns-common-modules/dist/components/react/T'

import List from '~/app/[lang]/brokerage/(templates)/List'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { QueryCharterPage } from '~/queries/pages/charter.gql'

interface TypeProps {
  params: Promise<{
    lang: string
  }>
}
interface TypeState {}

async function PageCharters({params}:TypeProps){

  const access = CONTENT_TYPE === 'dealer' && ['EU'].includes(DEALER_REGION as string)
  if( !access ){
    notFound()
  }

  const { lang } = await params
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
    yachtConditionSettings={settings?.yachtConditionSettings}
    yearOptions={data?.yachtYears}
    list={posts}
    pageInfo={data?.posts?.pageInfo} />

  </main>
}

export default PageCharters