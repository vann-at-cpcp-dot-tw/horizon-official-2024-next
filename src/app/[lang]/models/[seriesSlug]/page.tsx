const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@src/store'
import useWindowSize from "@src/hooks/useWindowSize"
import { isEmpty } from '@src/lib/helpers'
import { fetchGQL } from '@src/lib/apollo'
import { QuerySingleSeriesPage } from '@src/queries/pages/models-[seriesSlug].gql'
import SingleSeriesTop from "./(sections)/SingleSeriesTop"
import YachtsSwiper from "./(sections)/YachtsSwiper"

interface TypeProps {
  params: {
    seriesSlug: string
  }
}

interface TypeState {}

interface TypeYachtNode {
  slug: string
  title: string
  yachtCustomFields?: {
    exteriorImages?: {
      image?: {
        node: {
          srcSet: string
          mediaItemUrl?: string
        }
      }
    }[]
    specsTable?: {
      specTerms: {
        [key:string]: {
          metric: string
          imperial: string
        }
      }
    }[]
  }
}

async function PageSingleSeries(props:TypeProps, ref:React.ReactNode){
  const { params } = props
  const { seriesSlug } = params
  const data = await fetchGQL(QuerySingleSeriesPage, {
    variables: {
      slug: seriesSlug
    }
  })
  const { yachtSeries } = data
  const { yachts } = yachtSeries
  const yachtsSwiperList = yachts.nodes?.map?.((node:TypeYachtNode)=>{
    return {
      slug: node.slug,
      label: node.title,
      link: `/models/${seriesSlug}/${node.slug}`,
      mediaItemUrl: node?.yachtCustomFields?.exteriorImages?.[0]?.image?.node?.mediaItemUrl || '',
      srcSet: node?.yachtCustomFields?.exteriorImages?.[0]?.image?.node?.srcSet || '',
      specTerms: node?.yachtCustomFields?.specsTable?.[0]?.specTerms
    }
  })

  return <Suspense fallback={null}>
    <SingleSeriesTop className="py-[60px]" slug={seriesSlug} />
    <YachtsSwiper list={yachtsSwiperList} />
  </Suspense>
}

export default PageSingleSeries