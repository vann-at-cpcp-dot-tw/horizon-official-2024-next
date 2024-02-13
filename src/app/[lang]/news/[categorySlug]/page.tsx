const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const postsPerPage = 10

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { fetchGQL } from "@src/lib/apollo"
import { QueryPostsByCategory } from '@src/queries/pages/news-[categorySlug].gql'
import ListWithCategory from "../(templates)/ListWithCategory"
import ComingEvents from "../(templates)/ComingEvents"
import Breadcrumb from "@src/components/custom/Breadcrumb"

interface TypeProps {
  params: {
    categorySlug: string
    lang: string
  }
}

interface TypeState {}

async function PageNewsWithCategory({params}:TypeProps){
  const { lang, categorySlug } = params

  const data = await fetchGQL(QueryPostsByCategory, {
    variables: {
      slug: categorySlug,
      first: postsPerPage
    }
  })

  return <main className="grow pb-[120px]">
    <Breadcrumb
    list={[
      {
        label: 'News',
        href: '/news'
      },
      {
        label: data.category?.name
      }
    ]} />
    {
      categorySlug === 'events' && <ComingEvents className="mb-20" />
    }
    <div className="container serif mb-10 text-center text-[32px] text-major-900">{data.category?.name}</div>
    <ListWithCategory list={data?.category?.posts?.nodes} pageInfo={data?.posts?.pageInfo} lang={lang} />
  </main>
}

export default PageNewsWithCategory