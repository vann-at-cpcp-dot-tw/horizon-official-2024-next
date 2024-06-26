const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { QueryQA } from '~/queries/pages/QA.gql'
import { fetchGQL } from "~/lib/apollo"
import QAList from "./(templates)/QAList"

interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

async function PageTerms({params}:TypeProps){
  const { lang } = params
  const data = await fetchGQL(QueryQA)
  const { qaList } = data?.globalSettings?.additionalContent ?? {}

  return <main className="pb-24">
    <div className="serif pb-10 pt-16 text-center text-[32px] leading-none text-major-900">Q & A</div>
    <div className="container max-w-[940px]">
      <QAList list={qaList}/>
    </div>
  </main>
}

export default PageTerms