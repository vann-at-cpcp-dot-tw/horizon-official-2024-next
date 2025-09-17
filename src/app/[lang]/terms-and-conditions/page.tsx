const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import T from "vanns-common-modules/dist/components/react/T"

import LinkWithLang from '~/components/custom/LinkWithLang'
import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { QueryTermsPage } from '~/queries/pages/terms-and-conditions.gql'

interface TypeProps {
  params: Promise<{
    lang: string
  }>
}
interface TypeState {}

async function PageTerms({params}:TypeProps){
  const { lang } = await params
  const data = await fetchGQL(QueryTermsPage)

  return <main className="pb-24">
    <div className="serif pb-10 pt-16 text-center text-[32px] leading-none text-major-900">
      <T text="Terms and Conditions" />
    </div>
    <div className="MCE-CONTENT">
      <div className="container">
        <pre className="mx-auto w-full max-w-[900px]" dangerouslySetInnerHTML={{__html:data?.globalSettings?.additionalContent?.termsAndConditions?.content}}></pre>
      </div>
    </div>
  </main>
}

export default PageTerms