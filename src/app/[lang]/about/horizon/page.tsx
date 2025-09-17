const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import ImageAutoPlaceholder from "~/components/custom/ImageAutoPlaceholder"
import { Button } from '~/components/ui/button'
import { fetchGQL } from "~/lib/apollo/server"
import { QueryPageAboutHorizon } from '~/queries/pages/about-horizon.gql'

import Achievement from "./(sections)/Achievement"
import Discover from "./(sections)/Discover"
import History from "./(sections)/History"
import KV from "./(sections)/KV"
import Milestone from "./(sections)/Milestone"
import NumericalData from "./(sections)/NumericalData"

export default async function PageAboutHorizon({
  params
}:{
  params: Promise<{
    lang: string
  }>
}){
  const { lang } = await params
  const data = await fetchGQL(QueryPageAboutHorizon, {
    context: {
      uri: HQ_API_URL
    }
  })
  const { aboutHorizonCustomFields } = data?.aboutHorizon ?? {}
  const { firstScreen, discoverHorizon, imageAfterDiscoverHorizon, numericalData, achievement, history} = aboutHorizonCustomFields ?? {}

  return <main>
    <KV
    background={firstScreen?.backgroundVideo?.node?.mediaItemUrl}
    heroImageNode={<img src={firstScreen?.heroImage?.node?.mediaItemUrl} srcSet={firstScreen?.heroImage?.node?.srcSet} sizes="(min-width:1200px) 1920px, (max-width:991px) 100vw, 956px" />}
    description={firstScreen?.description} />

    <Discover
    content={discoverHorizon}
    imageAfterContent={imageAfterDiscoverHorizon?.node} />


    <NumericalData
    yachtsBuild={numericalData?.yachtsBuild}
    overSqftArea={numericalData?.overSqftArea}
    iso9001Certified={numericalData?.iso9001Certified}
    employees={numericalData?.employees} />

    <Achievement items={achievement?.map?.((node:any)=>{
      return {
        mediaItemUrl: node?.image?.node?.mediaItemUrl,
        srcSet: node?.image?.node?.srcSet
      }
    })} />

    <History content={history} />

    <Milestone lang={lang} />
  </main>
}
