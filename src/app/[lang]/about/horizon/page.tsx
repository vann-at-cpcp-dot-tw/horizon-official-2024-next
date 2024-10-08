const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import Image from "next/image"

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
  params: {
    lang: string
  }
}){
  const { lang } = params
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
    heroImageNode={<ImageAutoPlaceholder src={`${firstScreen?.heroImage?.node?.mediaItemUrl}`} width={1920} height={1080} />}
    description={firstScreen?.description} />

    <Discover content={discoverHorizon} imageAfterContent={imageAfterDiscoverHorizon?.node?.mediaItemUrl} />


    <NumericalData
    yachtsBuild={numericalData?.yachtsBuild}
    overSqftArea={numericalData?.overSqftArea}
    iso9001Certified={numericalData?.iso9001Certified}
    employees={numericalData?.employees} />

    <Achievement items={achievement?.map?.((node:{image:{node:{mediaItemUrl:string}}})=>node?.image?.node?.mediaItemUrl || '')} />

    <History content={history} />

    <Milestone lang={lang} />
  </main>
}
