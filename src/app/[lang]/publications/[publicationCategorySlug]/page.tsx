const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { fetchGQL } from "@src/lib/apollo"
import { QueryPublicationCategory } from '@src/queries/pages/publications-[publicationCategorySlug].gql'
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
    variables: {
      slug: publicationCategorySlug,
      first: 12
    }
  })
  const { publicationCategory } = data ?? {}

  return <div className="pb-[120px]"
  style={{
    background: '#EEEBE6',
  }}>
    <SingleCategory publicationCategory={publicationCategory} />
  </div>
}

export default PagePublications