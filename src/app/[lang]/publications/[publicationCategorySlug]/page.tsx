const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import Image from "next/image"

import LinkWithLang from '~/components/custom/LinkWithLang'
import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { QueryPublicationCategory } from '~/queries/pages/publications-[publicationCategorySlug].gql'

import SingleCategory from "../(sections)/SingleCategory"

interface TypeProps {
  params: {
    data: {
      [key:string]: any
    }
  }
  & {
    [key:string]: string
  }
}
interface TypeState {}

async function PagePublications({params}:TypeProps){

  const { publicationCategorySlug, lang } = params
  const data = await fetchGQL(QueryPublicationCategory, {
    context: {
      uri: HQ_API_URL
    },
    variables: {
      slug: publicationCategorySlug,
      first: 12
    }
  })
  const { publicationCategory } = data ?? {}

  return <div className="pb-16 lg:pb-32"
  style={{
    background: '#EEEBE6',
  }}>
    <SingleCategory publicationCategory={publicationCategory} />
  </div>
}

export default PagePublications