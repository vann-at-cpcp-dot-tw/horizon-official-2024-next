const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Button } from '@src/components/ui/button'
import { fetchGQL } from "@src/lib/apollo"
import { QueryPageAboutHorizon } from '@src/queries/pages/about-horizon.gql'
import Image from "next/image"

import KV from "./(sections)/KV"
import Discover from "./(sections)/Discover"
import NumericalData from "./(sections)/NumericalData"
import Achievement from "./(sections)/Achievement"
import History from "./(sections)/History"
import ImageAutoPlaceholder from "@root/src/components/custom/ImageAutoPlaceholder"
import Milestone from "./(sections)/Milestone"

export default async function PageAboutHorizon({
  params
}:{
  params: {
    lang: string
  }
}){
  const { lang } = params
  const data = await fetchGQL(QueryPageAboutHorizon)
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
