const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { QueryQA } from '~/queries/pages/QA.gql'
import { fetchGQL } from "~/lib/apollo"
import QAList from "./(templates)/QAList"
import T from "vanns-common-modules/dist/components/react/T"

interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

async function PageTerms({params}:TypeProps){
  const { lang } = params
  const data = await fetchGQL(QueryQA, {
    context: {
      uri: HQ_API_URL
    }
  })
  const { qaList } = data?.globalSettings?.additionalContent ?? {}

  return <main className="pb-24">
    <div className="serif pb-10 pt-16 text-center text-[32px] leading-none text-major-900">
      <T text="Q & A"/>
    </div>
    <div className="container max-w-[940px]">
      <QAList list={qaList}/>
    </div>
  </main>
}

export default PageTerms