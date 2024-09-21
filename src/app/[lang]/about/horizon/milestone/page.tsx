const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import Image from "next/image"
import T from 'vanns-common-modules/dist/components/react/T'
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'

import ContentLightbox from '~/components/custom/ContentLightbox'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { fetchGQL } from '~/lib/apollo'
import { QueryMilestone } from '~/queries/components/milestone.gql'

import SwiperMilestone from "./(sections)/SwiperMilestone"

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
  const data = await fetchGQL(QueryMilestone, {
    context: {
      uri: HQ_API_URL
    }
  })
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
      <div className="serif text-center text-[24px] text-white"><T text="Milestone"/></div>
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
