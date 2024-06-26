const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { fetchGQL } from '~/lib/apollo'
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