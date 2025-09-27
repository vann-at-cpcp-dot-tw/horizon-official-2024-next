const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import T from 'vanns-common-modules/dist/components/react/T'

import ContentLightbox from '~/components/custom/ContentLightbox'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { fetchGQL } from "~/lib/apollo/server"
import { QueryMilestone } from '~/queries/components/milestone.gql'

import SwiperMilestone from "./(sections)/SwiperMilestone"

export default async function PageHome({
  params
}:{
  params: Promise<{
    lang: string
    data: {
      [key:string]: any
    }
  }>
}){
  const { lang } = await params
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
        // placeholder: await genImageBlurHash(node?.image?.node?.mediaItemUrl) // 暫時停用，因似乎有性能問題，故回歸預設 placeholder
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
      <img src={`${APP_BASE}assets/img/icon_menu_x.svg`} style={{width:'48px', height:'48px', filter:'grayscale(1) brightness(100)'}} />
    </LinkWithLang>
  }>
    <div className="mb-auto lg:my-auto">
      <SwiperMilestone list={milestoneList}/>
    </div>
  </ContentLightbox>
}
