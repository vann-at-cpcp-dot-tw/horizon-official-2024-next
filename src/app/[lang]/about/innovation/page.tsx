import { Button } from '@src/components/ui/button'
import { fetchGQL } from "@src/lib/apollo"
import { QueryPageAboutInnovation } from '@src/queries/pages/about-innovation.gql'
import FeaturedVideo from "./(sections)/FeaturedVideo"
import ContentList from "../(templates)/ContentList"

export default async function PageAboutInnovation(){

  const data = await fetchGQL(QueryPageAboutInnovation)
  const { featuredVideo, contentList } = data?.aboutInnovation?.aboutInnovationCustomFields ?? {}

  return <main>
    <div className="container py-[90px] text-minor-900">
      <div className="serif mb-8 text-center text-[32px]">Innovation</div>
      <div className="serif mx-auto w-full max-w-[900px]">
        <p className="text-center text-[20px]">
        Horizon is committed to exceeding customer expectations and continuously improving upon the safety, design and construction of its yachts—while also keeping an eye on the future with new product development.<br/>
        From initial models to the birth of each yacht, Horizon steadfastly maintains 100% in-house production within the Group and in Taiwan, controlling every design detail to ensure the highest standards of navigational safety and quality. Horizon offers flexible customization while maintaining superior efficiency, garnering the trust of yacht owners worldwide.
        </p>
        <br/>
        <p className="text-center text-[20px]">Moreover, Horizon collaborates with internationally-renowned designers and authoritative organizations to uphold our cutting-edge technology, multi-faceted designs, and top-tier safety certifications. With a global network of offices and dealers, alongside our dedicated shipyard, the Group provides high-level, exclusive maintenance and service to Horizon owners across all five continents.</p>
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
