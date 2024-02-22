const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { fetchGQL } from "@src/lib/apollo"
import { QueryMilestone } from '@src/queries/components/milestone.gql'
import SwiperMilestone from "./(sections)/SwiperMilestone"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { genImageBlurHash } from "@root/src/lib/genImageBlurHash"
import ContentLightbox from "@src/components/custom/ContentLightbox"

export default async function PageHome({
  params
}:{
  params: {
    lang: string
    data: {
      [key:string]: any
    }
  }
}){
  const { lang } = params
  const data = await fetchGQL(QueryMilestone)
  const { milestone } = data?.aboutHorizon?.aboutHorizonCustomFields ?? {}
  const milestoneList = await Promise.all(
    milestone?.map(async (node:any)=>{
      return {
        ...node,
        image: node?.image?.node?.mediaItemUrl,
        placeholder: await genImageBlurHash(node?.image?.node?.mediaItemUrl)
      }
    })
  )

  return <ContentLightbox
  theme="dark"
  background="#040922"
  stickyHeader={
    <div className="container pb-8 pt-10">
      <div className="serif text-center text-[24px] text-white">Milestone</div>
    </div>
  }
  closeIcon={
    <LinkWithLang className="btn" href={`${BASE_PATH}/about/horizon`} lang={lang}>
      <Image src={`${BASE_PATH}/assets/img/icon_menu_x.svg`} width={48} height={48} style={{filter:'grayscale(1) brightness(100)'}} alt=""/>
    </LinkWithLang>
  }>
    <div className=" my-auto">
      <SwiperMilestone list={milestoneList}/>
    </div>
  </ContentLightbox>
}
