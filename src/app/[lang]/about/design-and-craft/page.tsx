const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import T from 'vanns-common-modules/dist/components/react/T'
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'

import { Button } from '~/components/ui/button'
import { fetchGQL } from "~/lib/apollo/server"
import { QueryPageAboutDesignAndCraft } from '~/queries/pages/about-design.gql'

import ContentList from "../(templates)/ContentList"
import FeaturedVideo from "../(templates)/FeaturedVideo"

export default async function PageAboutDesign({
  params
}:{
  params: {
    lang: string
  }
}){
  const { lang } = params
  const data = await fetchGQL(QueryPageAboutDesignAndCraft, {
    context: {
      uri: HQ_API_URL
    }
  })
  const { featuredVideo, contentList } = data?.aboutDesignAndCraft?.aboutDesignCustomFields ?? {}
  const contentListWithPlaceholder = await Promise.all(
    contentList.map(async (node:any) => {

      const designPartners = node?.designPartners
        ?await Promise.all(node?.designPartners?.map(async (partnerNode:any)=>{
          return {
            ...partnerNode,
            image: {
              ...(partnerNode?.image || {}),
              placeholder: await genImageBlurHash(partnerNode?.image?.node?.mediaItemUrl)
            }
          }
        })) :[]

      return {
        ...node,
        basic: {
          ...node.basic,
          keyImage: {
            ...(node?.basic?.keyImage || {}),
            placeholder: await genImageBlurHash(node?.basic?.keyImage?.node?.mediaItemUrl)
          },
        },
        designPartners
      }
    })
  )
  return <main>
    <div className="container py-10 text-minor-900 lg:py-[90px]">
      <div className="serif mb-4 text-center text-[28px] leading-[1.2] lg:mb-8 lg:text-[32px]"><T text="Extraordinary Design and Craftsmanship" /></div>
      <div className="serif mx-auto w-full max-w-[900px]">
        <p className="text-center text-[16px] lg:text-[20px]">
          <T text="The “Horizon Style” is the creative combination of the expertise of the world’s leading yacht designers coupled with the unparalleled proficiency of Horizon’s in-house team of professional naval architects, engineers and designers. Using the most advanced visualization technology, such as 3D CAD and virtual reality, Horizon‘s team works closely with clients to provide thoughtful design advice, fulfill lifestyle requirements, and ensure the reliability, safety and performance of every new Horizon luxury yacht." />
        </p>
      </div>
    </div>

    {
      featuredVideo?.node?.mediaItemUrl && <FeaturedVideo src={ featuredVideo.node.mediaItemUrl } />
    }

    <ContentList list={contentListWithPlaceholder} />
  </main>
}
