const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

// import { Suspense } from 'react'
// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty, convertYoutubeUrlToEmbed } from '@src/lib/helpers'
import { fetchGQL } from "@src/lib/apollo"
import { QuerySingleYachtPage } from '@src/queries/pages/models-[seriesSlug]-[yachtSlug].gql'
import { QuerySinglePublication } from '@src/queries/categories/publication.gql'
import { notFound } from "next/navigation"
import Breadcrumb from "@src/components/custom/Breadcrumb"
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
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"
import News from "@src/app/[lang]/(home)/(sections)/News"

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
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { params, searchParams } = props
  const { yachtSlug, seriesSlug, lang } = params

  const data = await fetchGQL(QuerySingleYachtPage, {
    variables: {
      slug: yachtSlug
    }
  })

  const { relatedPublicationSlug } = data?.yacht?.yachtCustomFields ?? {}

  const publicationData = relatedPublicationSlug
    ? await fetchGQL(QuerySinglePublication, {
      variables: {
        slug: relatedPublicationSlug
      }
    })
    : null

  const { title:yachtTitle, yachtSeriesList, yachtCustomFields } = data?.yacht ?? {}
  const { heroVideo, heroImage, yachtDescription, exteriorImages, interiorImages, specsTable, generalArrangementImages, vrPreview, videosPreview, embedVideosGallery, hulls } = yachtCustomFields ?? {}
  const { publication } = publicationData ?? {}
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
    notFound()
  }

  return <main className="relative">
    <Breadcrumb className="pb-5 pt-10"
      list={[
        {
          label: 'Models',
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

    <Intro title={yachtTitle} description={yachtDescription} />

    <SectionNav />

    <div className="mb-14" id="SECTION_EXTERIOR">
      <YachtsExteriorSwiper list={exteriorImages} />
    </div>

    <div className="mb-24" id="SECTION_INTERIOR">
      <YachtInteriorSwiper list={interiorImages} />
    </div>

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
      <Hulls yachtName={yachtTitle} list={hulls}/>
    </div>

    <Publication {...publication} />

    {
      data?.posts?.nodes && <div className="bg-gray-200 py-20">
        <div className="container">
          <div className="serif mb-4 text-center text-[24px] text-gray-900">NEWS</div>
          <News className="pb-0" list={data?.posts?.nodes} lang={lang} />
        </div>
      </div>
    }

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

export default PageSingleYacht