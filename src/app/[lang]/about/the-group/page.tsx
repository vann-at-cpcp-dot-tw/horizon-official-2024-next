const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Button } from '~/components/ui/button'
import { fetchGQL } from '~/lib/apollo'
import { QueryPageAboutTheGroup } from '~/queries/pages/about-the-group.gql'
import { isEmpty } from '~/lib/utils'
import KV from "./(sections)/KV"
import CompaniesGrids from "./(sections)/CompaniesGrids"
import GroupIntroduction from "./(sections)/GroupIntroduction"
import CompaniesIntros from "./(sections)/CompaniesIntros"
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

  return <main className="pb-10 lg:pb-24">
    <KV heroImage={heroImage?.node?.mediaItemUrl || ''} />
    <CompaniesGrids organizationRows={organizationRows} />
    <GroupIntroduction content={groupIntroduction || ''} />
    <CompaniesIntros organizationRows={organizationRows} />
  </main>

}

export default PageAboutTheGroup