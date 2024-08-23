const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty, convertYoutubeUrlToEmbed } from '~/lib/utils'
import { fetchGQL } from '~/lib/apollo'
import { QuerySingleYachtPage, QuerySingleYachtHullsList } from '~/queries/pages/models-[seriesSlug]-[yachtSlug].gql'
import NotFound from "~/components/custom/NotFound"
import Breadcrumb from '~/components/custom/Breadcrumb'
import SectionNav from "./(templates)/SectionNav"
import KV from "./(sections)/KV"
import Intro from "./(sections)/Intro"
import YachtsExteriorSwiper from "./(sections)/YachtExteriorSwiper"
import YachtInteriorSwiper from "./(sections)/YachtInteriorSwiper"
import SpecTable from "./(sections)/SpecTable"
import GAGallery from "./(sections)/GAGallery"
import VRPreview from "./(sections)/VRPreview"
import VideoPreview from "./(sections)/VideoPreview"
import Hulls from "./(sections)/Hulls"
import Publication from "./(sections)/Publication"
import buttonStyles from '~/components/ui/button.module.sass'
import { Button } from '~/components/ui/button'
import News from '~/app/[lang]/(home)/(sections)/News'
import T from 'vanns-common-modules/dist/components/react/T'

interface TypeProps {
  params: {
    [key:string]: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

interface TypeState {}

async function PageSingleYacht(props:TypeProps, ref:React.ReactNode){
  const { params, searchParams } = props
  const { yachtSlug, seriesSlug, lang } = params

  const data = await fetchGQL(QuerySingleYachtPage, {
    context: {
      uri: HQ_API_URL
    },
    variables: {
      slug: yachtSlug,
      yachtSlugForRelatedPost: yachtSlug, // 因為線上不明原因，不認 ID! 這個 type，故再加傳一次 String
    }
  })

  const hullsData = await fetchGQL(QuerySingleYachtHullsList, {
    context: {
      uri: HQ_API_URL
    },
    variables: {
      slug: yachtSlug,
    }
  })

  const { relatedPublication } = data?.yacht?.EN?.yachtCustomFields ?? {}
  const { title:yachtTitle, yachtSeriesList, yachtCustomFields } = data?.yacht?.translation ?? {}
  const { heroVideo, heroImage, yachtDescription, exteriorImages, interiorImages, specsTable, generalArrangementImages, vrPreview, videosPreview, embedVideosGallery } = yachtCustomFields ?? {}

  const hulls = hullsData?.yacht?.translation?.yachtCustomFields?.hulls?.filter?.((node:any)=>!node?.isHidden)
  const parentSeries = yachtSeriesList?.nodes?.[0]

  const vrGallery = hulls?.reduce((acc:{hullName?:string, vrEmbedUrl?:string}[], node:{hullName?:string, vrEmbedUrl?:string})=>{
    if( !node?.hullName || !node?.vrEmbedUrl){
      return acc
    }

    return [
      ...acc,
      {
        title: node?.hullName,
        embedUrl: node?.vrEmbedUrl
      }
    ]
  }, [])

  const youtubeEmbedUrls = embedVideosGallery?.reduce((acc:{embedUrl:string, title:string}[], node:{embedUrl:string}, index:number)=>{
    const input = node.embedUrl
    return [
      ...acc,
      {
        title: `0${index+1}`,
        embedUrl: convertYoutubeUrlToEmbed(input)
      }
    ]
  }, [])

  if( isEmpty(yachtTitle) ){
    return <NotFound />
  }

  return <main className="relative">
    <Breadcrumb className="pb-5 pt-2.5 lg:pt-10"
      list={[
        {
          label: <T text="Models"/>,
          href: '/models'
        },
        ...(parentSeries?.name
          ?[
            {
              label: `${parentSeries?.name} Series`,
              href: `/models/${parentSeries?.slug}`
            }
          ]
          :[]
        ),
        {
          label: yachtTitle,
        }
      ]} />

    <KV video={heroVideo?.node?.mediaItemUrl || ''} image={heroImage?.node?.mediaItemUrl || ''} />

    <Intro title={yachtTitle}
    description={yachtDescription}
    classes={{
      description: 'text-center'
    }}/>

    <SectionNav />

    <YachtsExteriorSwiper list={exteriorImages} />

    <YachtInteriorSwiper list={interiorImages} />

    <div id="SECTION_SPEC">
      <SpecTable list={specsTable} />
    </div>

    <div id="SECTION_GA">
      <GAGallery list={generalArrangementImages} />
    </div>

    <div id="SECTION_VR">
      <VRPreview preview={vrPreview}  gallery={vrGallery} />
    </div>

    <div id="SECTION_VIDEO">
      <VideoPreview preview={videosPreview} gallery={youtubeEmbedUrls} />
    </div>

    <div id="SECTION_HULLS">
      {
        hulls?.length > 0 && <Hulls yachtName={yachtTitle} list={hulls}/>
      }
    </div>

    <Publication list={relatedPublication?.nodes|| []} />

    {
      data?.posts?.nodes && <div className="bg-gray-200 py-20">
        <div className="serif mb-4 text-center text-[24px] text-gray-900">
          <T text="NEWS" />
        </div>
        <News className="pb-0 lg:pb-0" list={data?.posts?.nodes} lang={lang} />
      </div>
    }

    <div className="container py-24 text-center">
      <div className="serif mb-6 text-[32px] text-minor-900">
        <T text="Personal <i>and</i>  Virtual Tours  <i>available.</i>" />
      </div>
      <div className="flex justify-center">
        <LinkWithLang href="/contact" lang={lang}>
          <Button className={`${buttonStyles['rounded-golden']}`}>
            <T text="Contact Us" />
          </Button>
        </LinkWithLang>
      </div>
    </div>
  </main>
}

export default PageSingleYacht