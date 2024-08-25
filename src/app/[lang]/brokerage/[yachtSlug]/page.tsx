const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { QuerySingleBrokerage } from '~/queries/pages/brokerage-[yachtSlug].gql'
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
import T from 'vanns-common-modules/dist/components/react/T'

interface TypeProps {
  params: {
    lang: string
    [key:string]: string
  }
}

interface TypeState {}

async function PageSingleBrokerage({params}:TypeProps){
  const { lang, yachtSlug } = params
  const data = await fetchGQL(QuerySingleBrokerage, {
    variables: {
      slug: yachtSlug
    }
  })

  const { title:postTitle, customFields } = data?.post?.translation ?? {}
  const { relatedPublication } = data?.post?.translation?.customFields ?? {}

  return <main className="relative">
    <Breadcrumb className="pb-5 pt-2.5 lg:pt-10"
    list={[
      {
        label: DEALER_REGION === 'US' ?'Inventory' :'Brokerage',
        href: DEALER_REGION === 'US' ?'/inventory' :'/brokerage'
      },
      {
        label: postTitle,
      }
    ]} />

    <KV video="" image={customFields?.heroImage?.node?.mediaItemUrl || ''} />

    <Intro className="mb-6" title={postTitle} description={customFields?.yachtDescription} />

    <div className="container mb-10 max-w-[940px]">
      <div className="serif text-right text-[24px] leading-[1.6] text-gray-700">{customFields?.displayPrice}</div>
    </div>

    <SectionNav allowed={['Exterior', 'Interior', 'Features']} />

    <YachtsExteriorSwiper list={customFields?.exteriorImages} />

    <YachtInteriorSwiper list={customFields?.interiorImages} />

    <div id="SECTION_FEATURES">
      <SpecAndFeatures
      title={<T text="Features"/>}
      activeDefault="spec"
      specTerms={customFields?.specTerms}
      list={customFields?.featuresTable} />
    </div>


    <Publication list={relatedPublication?.nodes|| []} />

    <div className="container py-24 text-center">
      <div className="serif mb-6 text-[32px] text-minor-900">
        <T text="Personal and Virtual Tours <i>available.</i>"/>
      </div>
      <div className="flex justify-center">
        <LinkWithLang href="/contact" lang={lang}>
          <Button className={`${buttonStyles['rounded-golden']}`}>
            <T text="Contact Us"/>
          </Button>
        </LinkWithLang>
      </div>
    </div>

  </main>
}

export default PageSingleBrokerage