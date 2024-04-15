
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/helpers'
import { QueryTermsPage } from '~/queries/pages/terms-and-conditions.gql'
import { fetchGQL } from "~/lib/apollo"

interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

async function PageTerms({params}:TypeProps){
  const { lang } = params
  const data = await fetchGQL(QueryTermsPage)

  return <main className="pb-24">
    <div className="serif pb-10 pt-16 text-center text-[32px] leading-none text-major-900">Terms and Conditions</div>
    <div className="MCE-CONTENT">
      <div className="container">
        <div className="mx-auto w-full max-w-[900px]" dangerouslySetInnerHTML={{__html:data?.globalSettings?.additionalContent?.termsAndConditions?.content}}></div>
      </div>
    </div>
  </main>
}

export default PageTerms