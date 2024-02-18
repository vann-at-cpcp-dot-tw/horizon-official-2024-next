const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Button } from '@src/components/ui/button'
import { fetchGQL } from "@src/lib/apollo"
import { QueryPageAboutTheGroup } from '@src/queries/pages/about-the-group.gql'
import { isEmpty } from '@src/lib/helpers'
import KV from "./(sections)/KV"
import CompaniesGrids from "./(sections)/CompaniesGrids"
import GroupIntroduction from "./(sections)/GroupIntroduction"
import CompaniesIntros from "./(sections)/CompaniesIntros"
import { genImageBlurHash } from "@root/src/lib/genImageBlurHash"
interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

async function PageAboutTheGroup({params}:TypeProps){

  const { lang } = params
  const data = await fetchGQL(QueryPageAboutTheGroup)
  const {
    atgpHeroImage:heroImage,
    atgpGroupIntroduction:groupIntroduction,
    atgpOrganization:organizationRows
  } = data?.aboutTheGroup?.aboutTheGroupCustomFields ?? {}
  const heroImagePlaceHolder = await genImageBlurHash(heroImage?.node?.mediaItemUrl)

  return <main className="pb-[90px]">
    <KV heroImage={heroImage?.node?.mediaItemUrl || ''} heroImagePlaceHolder={heroImagePlaceHolder} />
    <CompaniesGrids organizationRows={organizationRows} />
    <GroupIntroduction content={groupIntroduction || ''} />
    <CompaniesIntros organizationRows={organizationRows} />
  </main>

}

export default PageAboutTheGroup