import { Button } from '@src/components/ui/button'
import { fetchGQL } from "@src/lib/apollo"
import { QueryPageAboutDesignAndCraft } from '@src/queries/pages/about-design.gql'
import FeaturedVideo from "./(templates)/FeaturedVideo"
// import ContentList from "./(sections)/ContentList"
import ContentList from "../(templates)/ContentList"
import { genImageBlurHash } from "@src/lib/genImageBlurHash"

export default async function PageAboutDesign(){

  const data = await fetchGQL(QueryPageAboutDesignAndCraft)
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
    <div className="container py-[90px] text-minor-900">
      <div className="serif mb-8 text-center text-[32px]">Extraordinary Design and Craftsmanship</div>
      <div className="serif mx-auto w-full max-w-[900px]">
        <p className="text-center text-[20px]">The “Horizon Style” is the creative combination of the expertise of the world’s leading yacht designers coupled with the unparalleled proficiency of Horizon’s in-house team of professional naval architects, engineers and designers. Using the most advanced visualization technology, such as 3D CAD and virtual reality, Horizon‘s team works closely with clients to provide thoughtful design advice, fulfill lifestyle requirements, and ensure the reliability, safety and performance of every new Horizon luxury yacht. </p>
      </div>
    </div>

    {
      featuredVideo?.node?.mediaItemUrl && <div className="mb-24">
        <FeaturedVideo src={ featuredVideo.node.mediaItemUrl } />
      </div>
    }

    <ContentList list={contentListWithPlaceholder} />
  </main>
}
