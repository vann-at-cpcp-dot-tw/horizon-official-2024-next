
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { QueryPolicyPage } from '@src/queries/pages/privacy-policy.gql'
import { fetchGQL } from "@root/src/lib/apollo"

interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

async function PagePolicy({params}:TypeProps){
  const { lang } = params
  const data = await fetchGQL(QueryPolicyPage)

  return <main className="pb-24">
    <div className="serif pb-10 pt-16 text-center text-[32px] leading-none text-major-900">Privacy Policy</div>
    <div className="MCE-CONTENT">
      <div className="container">
        <div className="mx-auto w-full max-w-[900px]" dangerouslySetInnerHTML={{__html:data?.globalSettings?.additionalContent?.privacyPolicy?.content}}></div>
      </div>
    </div>
  </main>
}

export default PagePolicy