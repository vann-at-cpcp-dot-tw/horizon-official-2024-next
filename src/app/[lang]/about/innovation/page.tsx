const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import { Button } from '~/components/ui/button'
import { fetchGQL } from '~/lib/apollo'
import { QueryPageAboutInnovation } from '~/queries/pages/about-innovation.gql'
import FeaturedVideo from "../(templates)/FeaturedVideo"
import ContentList from "../(templates)/ContentList"
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'
import { param } from "jquery"

export default async function PageAboutInnovation({
  params
}:{
  params: {
    lang: string
  }
}){
  const { lang } = params
  const data = await fetchGQL(QueryPageAboutInnovation, {
    context: {
      uri: HQ_API_URL
    }
  })
  const { featuredVideo, contentList } = data?.aboutInnovation?.aboutInnovationCustomFields ?? {}
  const contentListWithPlaceholder = await Promise.all(
    contentList.map(async (node:any) => {
      return {
        ...node,
        basic: {
          ...node.basic,
          keyImage: {
            ...(node?.basic?.keyImage || {}),
            placeholder: await genImageBlurHash(node?.basic?.keyImage?.node?.mediaItemUrl)
          },
        },
      }
    })
  )
  return <main>
    <div className="container py-10 text-minor-900 lg:py-[90px]">
      <div className="serif mb-4 text-center text-[28px] leading-[1.2] lg:mb-8 lg:text-[32px]">Innovation</div>
      <div className="serif mx-auto w-full max-w-[900px]">
        <p className="text-center text-[16px] lg:text-[20px]">
        Horizon is committed to exceeding customer expectations and continuously improving upon the safety, design and construction of its yachts—while also keeping an eye on the future with new product development.<br/>
        From initial models to the birth of each yacht, Horizon steadfastly maintains 100% in-house production within the Group and in Taiwan, controlling every design detail to ensure the highest standards of navigational safety and quality. Horizon offers flexible customization while maintaining superior efficiency, garnering the trust of yacht owners worldwide.
        </p>
        <br/>
        <p className="text-center text-[16px] lg:text-[20px]">Moreover, Horizon collaborates with internationally-renowned designers and authoritative organizations to uphold our cutting-edge technology, multi-faceted designs, and top-tier safety certifications. With a global network of offices and dealers, alongside our dedicated shipyard, the Group provides high-level, exclusive maintenance and service to Horizon owners across all five continents.</p>
      </div>
    </div>

    {
      featuredVideo?.node?.mediaItemUrl && <FeaturedVideo src={ featuredVideo.node.mediaItemUrl } />
    }

    <ContentList list={contentListWithPlaceholder} />
  </main>
}
