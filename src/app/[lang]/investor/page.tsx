
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`
const postsPerPage = 10

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { QueryInvestorPage } from '~/queries/pages/investor.gql'
import { fetchGQL } from '~/lib/apollo'
import List from "./(templates)/List"
import { redirect } from "next/navigation"
import { i18n } from "~~/i18n.config"

interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

export default async function PageInvestor({params}:TypeProps){
  const { lang } = params

  const access = CONTENT_TYPE === 'hq'
  if( !access ){
    if( lang === i18n.defaultLocale.shortCode ){
      redirect('/')
    }else{
      redirect(`/${lang}`)
    }
  }

  const data = await fetchGQL(QueryInvestorPage, {
    context: {
      uri: HQ_API_URL
    },
    variables: {
      first: postsPerPage
    }
  })
  const posts = data?.posts?.nodes?.map((node:any)=>node?.translation)

  return <main className="pb-24">
    <div className="serif pb-10 pt-16 text-center text-[32px] leading-none text-major-900">Investors</div>
    <List
    list={posts}
    pageInfo={data?.posts?.pageInfo}
    />
  </main>
}
