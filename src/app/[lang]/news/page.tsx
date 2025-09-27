const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`
const postsPerPage = 6

import { headers } from 'next/headers'
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { formatPostCategories } from "~/lib/utils"
import { QueryNewsPage } from '~/queries/pages/news.gql'

import BrandPublication from "./(templates)/BrandPublication"
import CoverStory from "./(templates)/CoverStory"
import ListNewsPage from "./(templates)/ListNewsPage"
import NewsPageEventsBlock from "./(templates)/NewsPageEventsBlock"
import OwnerPerspective from "./(templates)/OwnerPerspective"

interface TypeProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    [key:string]: string
  }>
}

interface TypeState {}

export default async function PageNews({params, searchParams}:TypeProps){
  const { lang } = await params
  const resolvedSearchParams = await searchParams
  const data = await fetchGQL(QueryNewsPage, {
    context: {
      uri: HQ_API_URL
    },
    variables: {
      first: postsPerPage,
      relatedYachtSeries: resolvedSearchParams.series || null,
      year: resolvedSearchParams.year ?Number(resolvedSearchParams.year) :null,
      ...(
        resolvedSearchParams.category
          ? {
            categories: [resolvedSearchParams.category],
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

  const publicationCover = data.publicationCategory?.publications?.nodes?.[0]?.translation?.publicationCustomFields?.publication?.publicationCover?.node
  const publicationPdf = data.publicationCategory?.publications?.nodes?.[0]?.translation?.publicationCustomFields?.publication?.pdf?.node?.mediaItemUrl || ''

  return <main className="grow pb-5">

    {
      data?.coverStory?.translation?.posts?.nodes?.[0]?.slug && <CoverStory
      slug={data?.coverStory?.translation?.posts?.nodes?.[0]?.slug}
      title={data?.coverStory?.translation?.posts?.nodes?.[0]?.title}
      date={data?.coverStory?.translation?.posts?.nodes?.[0]?.date}
      lang={lang}
      image={data?.coverStory?.translation?.posts?.nodes?.[0]?.postCustomFields?.coverImage?.node} />
    }

    <div className="mb-20">
      <ListNewsPage list={formattedNewsList} pageInfo={data?.posts?.pageInfo} lang={lang} categories={data?.categories}/>
    </div>

    <div className="mb-20">
      <NewsPageEventsBlock list={formattedEventBlockList} lang={lang} />
    </div>

    <BrandPublication
    publicationCover={publicationCover}
    pdf={publicationPdf} />

    <OwnerPerspective image={data.newsPageSettings.ownerPerspective.image?.node?.mediaItemUrl} description={data.newsPageSettings.ownerPerspective?.description} />
  </main>
}
