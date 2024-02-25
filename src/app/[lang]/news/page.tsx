// export const dynamic = 'force-dynamic'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const postsPerPage = 6

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { fetchGQL } from "@src/lib/apollo"
import { QueryNewsPage } from '@src/queries/pages/news.gql'
import CoverStory from "./(templates)/CoverStory"
import ListNewsPage from "./(templates)/ListNewsPage"
import ListNewsPageEvent from "./(templates)/ListNewsPageEvent"
import BrandPublication from "./(templates)/BrandPublication"
import OwnerPerspective from "./(templates)/OwnerPerspective"

interface TypeProps {
  params: {
    lang: string
  }
  searchParams: {
    [key:string]: string
  }
}

interface TypeState {}

async function PageNews({params, searchParams}:TypeProps){
  const { lang } = params
  const data = await fetchGQL(QueryNewsPage, {
    variables: {
      first: postsPerPage,
      language: lang.toUpperCase(),
      translation: lang.toUpperCase(),
    }
  })

  return <main className="grow pb-5">

    {
      data?.coverStory?.posts?.nodes?.[0]?.translation?.slug && <CoverStory
      slug={data?.coverStory?.posts?.nodes?.[0]?.translation?.slug}
      title={data?.coverStory?.posts?.nodes?.[0]?.translation?.title}
      date={data?.coverStory?.posts?.nodes?.[0]?.translation?.date}
      lang={lang}
      image={data?.coverStory?.posts?.nodes?.[0]?.translation?.postCustomFields?.coverImage?.node?.mediaItemUrl} />
    }


    <div className="mb-20">
      <ListNewsPage list={data?.posts?.nodes} pageInfo={data?.posts?.pageInfo} lang={lang} categories={data?.categories}/>
    </div>

    <div className="mb-20">
      <ListNewsPageEvent list={data?.events?.posts?.nodes} lang={lang} />
    </div>

    <BrandPublication
    publicationCover={data.publicationCategory?.publications?.nodes?.[0]?.translation?.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl}
    pdf={data.publicationCategory?.publications?.nodes?.[0]?.translation?.publicationCustomFields?.publication?.pdf?.node?.mediaItemUrl} />

    <OwnerPerspective image={data.newsPageSettings.ownerPerspective.image?.node?.mediaItemUrl} description={data.newsPageSettings.ownerPerspective?.description} />
  </main>
}

export default PageNews