const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`
const postsPerPage = 6

import { headers } from 'next/headers'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { fetchGQL } from '~/lib/apollo'
import { QueryNewsPage } from '~/queries/pages/news.gql'
import CoverStory from "./(templates)/CoverStory"
import ListNewsPage from "./(templates)/ListNewsPage"
import NewsPageEventsBlock from "./(templates)/NewsPageEventsBlock"
import BrandPublication from "./(templates)/BrandPublication"
import OwnerPerspective from "./(templates)/OwnerPerspective"
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'
import { formatPostCategories } from "~/lib/utils"

interface TypeProps {
  params: {
    lang: string
  }
  searchParams: {
    [key:string]: string
  }
}

interface TypeState {}

export default async function PageNews({params, searchParams}:TypeProps){
  const { lang } = params
  const data = await fetchGQL(QueryNewsPage, {
    context: {
      uri: HQ_API_URL
    },
    variables: {
      first: postsPerPage,
      relatedYachtSeries: searchParams.series || null,
      year: searchParams.year ?Number(searchParams.year) :null,
      ...(
        searchParams.category
          ? {
            categories: [searchParams.category],
            categoriesOperator: 'IN'
          }:{
            categories: [],
            categoriesOperator: 'NOT_IN'
          }
      )
    }
  })
  const formattedNewsList = data?.posts?.nodes?.map((node:any)=>{
    return {
      ...node,
      filteredCategories: formatPostCategories(node?.categories?.nodes)
    }
  })

  const formattedEventBlockList = data?.events?.translation?.posts?.nodes?.map((node:any)=>{
    return {
      ...node,
      filteredCategories: formatPostCategories(node?.categories?.nodes)
    }
  })

  const publicationCover = data.publicationCategory?.publications?.nodes?.[0]?.translation?.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl || ''
  const publicationPdf = data.publicationCategory?.publications?.nodes?.[0]?.translation?.publicationCustomFields?.publication?.pdf?.node?.mediaItemUrl || ''
  const publicationPlaceholder = await genImageBlurHash(publicationCover)

  return <main className="grow pb-5">

    {
      data?.coverStory?.translation?.posts?.nodes?.[0]?.slug && <CoverStory
      slug={data?.coverStory?.translation?.posts?.nodes?.[0]?.slug}
      title={data?.coverStory?.translation?.posts?.nodes?.[0]?.title}
      date={data?.coverStory?.translation?.posts?.nodes?.[0]?.date}
      lang={lang}
      image={data?.coverStory?.translation?.posts?.nodes?.[0]?.postCustomFields?.coverImage?.node?.mediaItemUrl} />
    }

    <div className="mb-20">
      <ListNewsPage list={formattedNewsList} pageInfo={data?.posts?.pageInfo} lang={lang} categories={data?.categories}/>
    </div>

    <div className="mb-20">
      <NewsPageEventsBlock list={formattedEventBlockList} lang={lang} />
    </div>

    <BrandPublication
    publicationCover={publicationCover}
    placeholder={publicationPlaceholder}
    pdf={publicationPdf} />

    <OwnerPerspective image={data.newsPageSettings.ownerPerspective.image?.node?.mediaItemUrl} description={data.newsPageSettings.ownerPerspective?.description} />
  </main>
}
