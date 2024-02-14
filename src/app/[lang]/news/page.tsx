export const dynamic = 'force-dynamic'
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
import ListEventNewsPageEvent from "./(templates)/ListEventNewsPageEvent"
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
      first: postsPerPage
    }
  })

  return <main className="grow pb-5">
    <CoverStory
    slug={data?.coverStory?.posts?.nodes?.[0]?.slug}
    title={data?.coverStory?.posts?.nodes?.[0]?.title}
    date={data?.coverStory?.posts?.nodes?.[0]?.date}
    lang={lang}
    image={data?.coverStory?.posts?.nodes?.[0]?.postCustomFields?.coverImage?.node?.mediaItemUrl} />

    <div className="mb-20">
      <ListNewsPage list={data?.posts?.nodes} pageInfo={data?.posts?.pageInfo} lang={lang} categories={data?.categories}/>
    </div>

    <div className="mb-20">
      <ListEventNewsPageEvent list={data?.events?.posts?.nodes} lang={lang} />
    </div>

    <BrandPublication album={data.publicationCategory?.publications?.nodes?.[0]?.publicationCustomFields?.album} />

    <OwnerPerspective image={data.newsPageSettings.ownerPerspective.image?.node?.mediaItemUrl} description={data.newsPageSettings.ownerPerspective?.description} />
  </main>
}

export default PageNews