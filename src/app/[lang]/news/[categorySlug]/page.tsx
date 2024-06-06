const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/helpers'
import { fetchGQL } from '~/lib/apollo'
import { QueryPostsByCategory } from '~/queries/pages/news-[categorySlug].gql'
import ListWithCategory from "../(templates)/ListWithCategory"
import ComingEvents from "../(templates)/ComingEvents"
import Breadcrumb from '~/components/custom/Breadcrumb'

interface TypeProps {
  params: {
    categorySlug: string
    lang: string
  }
  searchParams: {
    [key:string]: string
  }
}

interface TypeState {}

async function PageNewsWithCategory({params, searchParams}:TypeProps){
  const { lang, categorySlug } = params
  const postsPerPage = params.categorySlug === 'events' ?12 :10

  const data = await fetchGQL(QueryPostsByCategory, {
    variables: {
      slug: categorySlug,
      first: postsPerPage,
      relatedYachtSeries: searchParams.series || null,
      year: searchParams.year ?Number(searchParams.year) :null,
    }
  })

  return <main className="grow pb-16 lg:pb-32">
    <Breadcrumb
    list={[
      {
        label: 'News',
        href: '/news'
      },
      {
        label: data.category?.translation?.name
      }
    ]} />
    {
      categorySlug === 'events' && <ComingEvents className="mb-10 mt-6 lg:mb-20 lg:mt-12" />
    }
    <div className="container serif mb-2 text-center text-[28px] text-major-900 lg:mb-10 lg:text-[32px]">{data.category?.translation?.name}</div>
    <ListWithCategory list={data.category?.translation?.posts?.nodes} pageInfo={data.category?.translation?.posts?.pageInfo} lang={lang} />
  </main>
}

export default PageNewsWithCategory