const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import Image from "next/image"
import T from 'vanns-common-modules/dist/components/react/T'

import Breadcrumb from '~/components/custom/Breadcrumb'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { QueryPostsByCategory } from '~/queries/pages/news-[categorySlug].gql'

import ComingEvents from "../(templates)/ComingEvents"
import ListWithCategory from "../(templates)/ListWithCategory"

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

export default async function PageNewsWithCategory({params, searchParams}:TypeProps){
  const { lang, categorySlug } = params
  const postsPerPage = params.categorySlug === 'events' ?12 :10

  const data = await fetchGQL(QueryPostsByCategory, {
    context: {
      uri: HQ_API_URL
    },
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
        label: <T text="News" />,
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
