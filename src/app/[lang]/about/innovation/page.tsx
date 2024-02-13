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
          Horizon Group provides a strong foundation for yacht building within a customer-oriented environment,<br/>
          where management and employees share a common goal.<br/>
          Horizon is committed to exceeding customer expectations and continuously improving upon the safety,<br/>
          design and construction of its yachts, while also keeping an eye on the future with new product development.
        </p>
        <br/>
        <p className="text-center text-[20px]">Our team comprises the finest craft experts, maritime engineers, and exclusive patent technologies, holding world records. From initial models to the birth of each yacht, we steadfastly maintain 100% in-house production within the group and in Taiwan, controlling every design detail to ensure the highest standards of navigational safety and quality. We offer flexible customization while maintaining superior efficiency, garnering the trust of yacht owners worldwide.</p>
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
