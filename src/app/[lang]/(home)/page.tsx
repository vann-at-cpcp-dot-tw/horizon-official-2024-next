import { fetchGQL } from "@src/lib/apollo"
import { QueryHomePage } from '@src/queries/pages/home.gql'
import dynamic from "next/dynamic"

import KV from "./(sections)/KV"
import Series from "./(sections)/Series"
import ComingEvents from "../news/(templates)/ComingEvents"
import News from "./(sections)/News"
import ImageAutoPlaceholder from "@root/src/components/custom/ImageAutoPlaceholder"
const Intro = dynamic(() => import("./(sections)/Intro"), {ssr: false})
const IntroAfterSeries = dynamic(() => import("./(sections)/IntroAfterSeries"), {ssr: false})

export default async function PageHome({
  params
}:{
  params: {
    lang: string
  }
}){
  const data = await fetchGQL(QueryHomePage)
  const { homePageKeyVision, homePageIntroduction, homePageAchievements } = data?.homePageSettings?.homePageCustomFields ?? {}
  const { heroImage:kvImage, heroVideo:kvVideo, mainTitle:kvTitle } = homePageKeyVision ?? {}
  const { lang } = params

  return <main>
    <KV
    title={kvTitle}
    imageNode={
      <ImageAutoPlaceholder className="absolute left-0 top-0 z-0 size-full object-cover"
      src={kvImage?.node?.mediaItemUrl || ''}
      fill={true}
      sizes="100vw" />
    }
    video={kvVideo?.node?.mediaItemUrl}
    achievements={homePageAchievements} />
    <Intro />
    <Series />
    <IntroAfterSeries smallVideo={homePageIntroduction?.smallVideo?.node?.mediaItemUrl} wideVideo={homePageIntroduction?.innovationVideo?.node?.mediaItemUrl} lang={lang}/>
    <ComingEvents className="mb-8 lg:mb-16" isSmallLayout />
    <News list={data?.posts?.nodes} lang={lang}/>
  </main>
}
