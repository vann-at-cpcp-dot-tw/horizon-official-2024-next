import { Button } from '@src/components/ui/button'
import { fetchGQL } from "@src/lib/apollo"
import { QueryPageAboutDesignAndCraft } from '@src/queries/pages/about-design.gql'
import FeaturedVideo from "./(templates)/FeaturedVideo"
// import ContentList from "./(sections)/ContentList"
import ContentList from "../(templates)/ContentList"

export default async function PageAboutDesign(){

  const data = await fetchGQL(QueryPageAboutDesignAndCraft)
  const { featuredVideo, contentList } = data?.aboutDesignAndCraft?.aboutDesignCustomFields ?? {}

  return <main>
    <div className="container py-[90px] text-minor-900">
      <div className="serif mb-8 text-center text-[32px]">Extraordinary Design and Craftsmanship</div>
      <div className="serif mx-auto w-full max-w-[900px]">
        <p className="text-center text-[20px]">“Horizon Style” is the creative combination of the expertise of the world’s leading yacht designers coupled with the unparalleled proficiency of Horizon’s in-house team of professional naval architects. Using the most advanced visualization technology, such as 3D CAD and virtual reality, Horizon‘s design team works closely with clients to provide thoughtful design advice, fulfill lifestyle requirements, and ensure the reliability, safety and performance of every new Horizon motoryacht.</p>
      </div>
    </div>

    {
      featuredVideo?.node?.mediaItemUrl && <div className="mb-24">
        <FeaturedVideo src={ featuredVideo.node.mediaItemUrl } />
      </div>
    }

    <ContentList list={contentList} />
  </main>
}
