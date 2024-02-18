const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Button } from '@src/components/ui/button'
import { fetchGQL } from "@src/lib/apollo"
import { QueryPageAboutHorizon } from '@src/queries/pages/about-horizon.gql'
import Image from "next/image"
import milestonePic from '@root/public/assets/img/bg_about_milestone.jpg'

import KV from "./(sections)/KV"
import Discover from "./(sections)/Discover"
import NumericalData from "./(sections)/NumericalData"
import Achievement from "./(sections)/Achievement"
import History from "./(sections)/History"
import RatioArea from "@src/components/custom/RatioArea"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import ImageAutoPlaceholder from "@src/components/custom/ImageWithPlaceholder"

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

    <div className="py-20">
      <Discover content={discoverHorizon} imageAfterContent={imageAfterDiscoverHorizon?.node?.mediaItemUrl} />
    </div>

    <div className="mb-[120px]">
      <NumericalData
       yachtsBuild={numericalData?.yachtsBuild}
       overSqftArea={numericalData?.overSqftArea}
       iso9001Certified={numericalData?.iso9001Certified}
       employees={numericalData?.employees} />
    </div>


    <Achievement items={achievement?.map?.((node:{image:{node:{mediaItemUrl:string}}})=>node?.image?.node?.mediaItemUrl || '')} />

    <div className="py-[120px]">
      <History content={history} />
    </div>

    <div className="relative bg-minor-900">
      <RatioArea ratio="39">
        <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center p-5">
          <div className="flex flex-col items-center text-white">
            <LinkWithLang className="serif mb-2 text-[32px] italic" href="/about/horizon/milestone" lang={lang}>Milestone</LinkWithLang>
            <LinkWithLang className="border-b-[3px] border-b-white pb-1" href="/about/horizon/milestone" lang={lang}>Discover</LinkWithLang>
          </div>
        </div>

        <Image className="absolute left-0 top-0 z-0 h-full w-full object-cover"
        src={milestonePic}
        fill={true}
        placeholder="blur"
        alt="" />
      </RatioArea>
    </div>
  </main>
}
