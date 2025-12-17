const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import { Suspense } from 'react'

import { useRouter } from 'next/navigation'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'

import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { filterYachtsByRegion } from '~/lib/yachtFilter'
import { QuerySingleSeriesPage } from '~/queries/pages/models-[seriesSlug].gql'
import { useStore } from '~/store'

import SingleSeriesTop from "./(sections)/SingleSeriesTop"
import YachtsSwiper from "./(sections)/YachtsSwiper"

interface TypeProps {
  params: Promise<{
    seriesSlug: string
  }>
}

interface TypeState {}

interface TypeYachtNode {
  slug: string
  title: string
  yachtCustomFields?: {
    excludeDealers?: string[] | null
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

export default async function PageSingleSeries(props:TypeProps){
  const { params } = props
  const { seriesSlug } = await params
  const data = await fetchGQL(QuerySingleSeriesPage, {
    context: {
      uri: HQ_API_URL
    },
    variables: {
      slug: seriesSlug
    }
  })
  const { yachtSeries } = data ?? {}
  const { yachts } = yachtSeries?.translation ?? {}
  const filteredYachts = filterYachtsByRegion(yachts?.nodes || [])
  const yachtsSwiperList = filteredYachts?.map?.((node:TypeYachtNode)=>{
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
    <SingleSeriesTop slug={seriesSlug} />
    <YachtsSwiper list={yachtsSwiperList} />
  </Suspense>
}

