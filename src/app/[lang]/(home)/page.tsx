import { fetchGQL } from "@src/lib/apollo"
import { QueryHomePage } from '@src/queries/pages/home.gql'

import KV from "./(sections)/KV"
import Intro from "./(sections)/Intro"
import Series from "./(sections)/Series"
import IntroAfterSeries from "./(sections)/IntroAfterSeries"
import CustomLightGallery from "@src/components/custom/CustomLightGallery"
export default async function PageHome({
  params
}:{
  params: {
    lang: string
  }
}){
  const data = await fetchGQL(QueryHomePage)
  const { homePageKeyVision, homePageIntroduction } = data?.homePageSettings?.homePageCustomFields ?? {}
  const { heroImage:kvImage, heroVideo:kvVideo, mainTitle:kvTitle } = homePageKeyVision ?? {}
  const { lang } = params
  return <main>
    <KV title={kvTitle} image={kvImage?.node?.mediaItemUrl} video={kvVideo?.node?.mediaItemUrl} />
    <Intro />
    <Series />
    <IntroAfterSeries smallVideo={homePageIntroduction?.smallVideo?.node?.mediaItemUrl} wideVideo={homePageIntroduction?.innovationVideo?.node?.mediaItemUrl} lang={lang}/>
  </main>
}
