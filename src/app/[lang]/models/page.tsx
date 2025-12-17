const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import { Suspense } from 'react'

import T from 'vanns-common-modules/dist/components/react/T'

import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'
import { filterYachtsByRegion } from '~/lib/yachtFilter'
import { QueryYachtsWithSeries } from '~/queries/pages/models.gql'

import SeriesList from "./(templates)/SeriesList"

interface TypeProps {
  params: Promise<{
    lang: string
  }>
}

interface TypeState {}

export default async function PageModels(props:TypeProps){
  const { lang } = await props.params
  const data = await fetchGQL(QueryYachtsWithSeries, {
    context: {
      uri: HQ_API_URL
    }
  })
  const translatedList = data?.yachtSeriesList?.nodes?.map((node:any)=>{
    const translation = node?.translation
    if (translation?.yachts?.nodes) {
      return {
        ...translation,
        yachts: {
          ...translation.yachts,
          nodes: filterYachtsByRegion(translation.yachts.nodes)
        }
      }
    }
    return translation
  })

  return <Suspense fallback={null}>
    <div className="py-8 lg:py-16">
      <div className="serif text-center text-[32px] leading-[1.2] text-minor-900 lg:text-[40px]">
        <T text="Our Series <i class='font-300'>Defined</i>" />
      </div>
    </div>
    {
      translatedList && <SeriesList list={translatedList} lang={lang} />
    }
  </Suspense>
}
