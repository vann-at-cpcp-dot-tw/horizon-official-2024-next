
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/helpers'
import { QuerySingleCharter } from '~/queries/pages/charter-[yachtSlug].gql'
import { QuerySinglePublication } from '~/queries/categories/publication.gql'
import { fetchGQL } from "~/lib/apollo"
import Breadcrumb from "~/components/custom/Breadcrumb"
import SectionNav from '~/app/[lang]/models/[seriesSlug]/[yachtSlug]/(templates)/SectionNav'
import KV from '~/app/[lang]/models/[seriesSlug]/[yachtSlug]/(sections)/KV'
import Intro from '~/app/[lang]/models/[seriesSlug]/[yachtSlug]/(sections)/Intro'
import YachtsExteriorSwiper from '~/app/[lang]/models/[seriesSlug]/[yachtSlug]/(sections)/YachtExteriorSwiper'
import YachtInteriorSwiper from '~/app/[lang]/models/[seriesSlug]/[yachtSlug]/(sections)/YachtInteriorSwiper'
import SpecAndFeatures from '~/app/[lang]/brokerage/(templates)/SpecAndFeatures'
import Publication from '~/app/[lang]/models/[seriesSlug]/[yachtSlug]/(sections)/Publication'
import buttonStyles from '~/components/ui/button.module.sass'
import { Button } from '~/components/ui/button'

interface TypeProps {
  params: {
    lang: string
    [key:string]: string
  }
}

interface TypeState {}

async function PageSingleCharter({params}:TypeProps){
  const { lang, yachtSlug } = params
  const data = await fetchGQL(QuerySingleCharter, {
    variables: {
      slug: yachtSlug
    }
  })

  const { title:postTitle, customFields } = data?.post ?? {}
  const { priceCurrency } = data?.settings?.customFields ?? {}

  const publicationData = customFields?.relatedPublicationSlug
    ? await fetchGQL(QuerySinglePublication, {
      variables: {
        slug: customFields?.relatedPublicationSlug
      }
    })
    : null
  const { publication } = publicationData ?? {}


  return <main className="relative">
    <Breadcrumb className="pb-5 pt-2.5 lg:pt-10"
    list={[
      {
        label: 'Charter',
        href: '/charter'
      },
      {
        label: postTitle,
      }
    ]} />

    <KV video="" image={customFields?.heroImage?.node?.mediaItemUrl || ''} />

    <Intro className="mb-6" title={postTitle} description={customFields?.yachtDescription} />

    <div className="container mb-10 max-w-[940px]">
      <div className="serif text-[24px] leading-[1.6] text-gray-700">{priceCurrency || '$'} {customFields?.price}</div>
    </div>

    <SectionNav allowed={['Exterior', 'Interior', 'Features', 'Pricing & Toys']} />

    <YachtsExteriorSwiper list={customFields?.exteriorImages} />

    <YachtInteriorSwiper list={customFields?.interiorImages} />

    <div id="SECTION_FEATURES">
      <SpecAndFeatures
      title="Features"
      activeDefault="spec"
      specTerms={customFields?.specTerms}
      list={customFields?.featuresTable} />
    </div>

    <div id="SECTION_PRICING_TOYS">
      <SpecAndFeatures
      title="Pricing & Toys"
      activeDefault="spec"
      list={customFields?.pricingToysTable} />
    </div>

    <Publication {...publication} />

    <div className="container py-24 text-center">
      <div className="serif mb-6 text-[32px] text-minor-900">Personal <span className="italic">and</span>  Virtual Tours  <span className="italic">available.</span></div>
      <div className="flex justify-center">
        <LinkWithLang href="/contact" lang={lang}>
          <Button className={`${buttonStyles['rounded-golden']}`}>Contact Us</Button>
        </LinkWithLang>
      </div>
    </div>

  </main>
}

export default PageSingleCharter