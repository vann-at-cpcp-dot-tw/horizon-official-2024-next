const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import Image from "next/image"
import { fetchGQL } from '~/lib/apollo'
import { QueryMilestone } from '~/queries/components/milestone.gql'
import SwiperMilestone from "./(sections)/SwiperMilestone"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'
import ContentLightbox from '~/components/custom/ContentLightbox'

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
    <div className="container py-10">
      <div className="serif text-center text-[24px] text-white">Milestone</div>
    </div>
  }
  closeIcon={
    <LinkWithLang className="btn" href={`${APP_BASE}about/horizon`} lang={lang}>
      <Image src={`${APP_BASE}assets/img/icon_menu_x.svg`} width={48} height={48} style={{filter:'grayscale(1) brightness(100)'}} alt=""/>
    </LinkWithLang>
  }>
    <div className="mb-auto lg:my-auto">
      <SwiperMilestone list={milestoneList}/>
    </div>
  </ContentLightbox>
}
