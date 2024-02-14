
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION
const postsPerPage = 10

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { QueryInvestorPage } from '@src/queries/pages/investor.gql'
import { fetchGQL } from "@src/lib/apollo"
import List from "./(templates)/List"

interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

async function PageInvestor({params}:TypeProps){
  const { lang } = params
  const data = await fetchGQL(QueryInvestorPage, {
    variables: {
      first: postsPerPage
    }
  })
  const posts = data?.posts?.nodes

  return <main className="pb-24">
    <div className="serif pb-10 pt-16 text-center text-[32px] leading-none text-major-900">Investors</div>
    <List
    list={posts}
    pageInfo={data?.posts?.pageInfo}
    />
  </main>
}

export default PageInvestor