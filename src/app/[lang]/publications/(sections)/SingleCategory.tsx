"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useContext, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { useParams } from "next/navigation"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { CommonDataContext } from '@src/app/[lang]/providers'
import { useLazyQuery } from "@apollo/client"
import { QueryPublicationCategory } from '@src/queries/pages/publications-[publicationCategorySlug].gql'
import { TypePublicationCategoryNode, TypePublicationNode } from "../layout"

import Loading from "@src/components/custom/icons/Loading"
import PageNav from "@src/components/custom/PageNav"

import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import lgHash from 'lightgallery/plugins/hash'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import lgFullscreen from 'lightgallery/plugins/fullscreen'


// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  publicationCategory: {
    name: string
    publications: {
      nodes: {
        slug: string
        title: string
        publicationCustomFields: {
          relatedYachts?: {
            seriesSlug: string
          }[]
          album: {
            image?: {
              node?: {
                mediaItemUrl: string
              }
            }
          }[]
        }
      }[]
      pageInfo: {
        hasNextPage: boolean
        hasPreviousPage: boolean
        startCursor: string
        endCursor: string
      }
    }
  }
  [key:string]: any

}
interface TypeState {}

function SingleCategory(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const params = useParams()
  const { lang, publicationCategorySlug } = params
  const commonData = useContext(CommonDataContext)
  const { yachtSeriesList } = commonData ?? {}
  const[getData, { data, loading }] = useLazyQuery<{publicationCategory:TypePublicationCategoryNode}>(QueryPublicationCategory)
  const [queryYachtSeries, setQueryYachtSeries] = useState('')
  const publicationCategory = useMemo<TypePublicationCategoryNode>(()=>{
    return (data?.publicationCategory || props?.publicationCategory)
  }, [props.publicationCategory, data])

  if( loading ){
    return <div className="flex h-full flex-col items-center justify-center">
      <Loading style={{width:'120px'}} fill="var(--color-golden-900)"/>
    </div>
  }

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container-fluid mb-8 px-20">
        <div className="row row-gap-2 -mt-12 mb-12 !flex-nowrap items-baseline justify-center">
          <div className="col-auto text-gray-700">Select by</div>
          <div className="col-auto shrink">
            <div className="w-screen max-w-[180px]">
              <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
              value={queryYachtSeries}
              onChange={(e)=>{
                setQueryYachtSeries(e.target.value)
                getData({
                  variables: {
                    slug: publicationCategorySlug,
                    first: 12,
                    relatedYachtSeries: e.target.value || null
                  }
                })
              }}>
                <option value="">All Series</option>
                {
                  yachtSeriesList?.nodes?.map((node, index:number)=>{
                    return <option key={index} value={node.slug}>{node.name} Series</option>
                  })
                }
              </select>
            </div>
          </div>
        </div>

        <div className="row lg:row-gap-8">
          {
            publicationCategory?.publications?.nodes?.map((node:TypePublicationNode, index:number)=>{
              return <div className="col-auto mb-8" key={index}>
                <div className="btn relative"
                onClick={()=>{
                  if( document.querySelector(`#lg-${index} .lg-react-element > a:first-child`) ){
                    (document.querySelector(`#lg-${index} .lg-react-element > a:first-child`) as HTMLElement).click()
                  }
                }}>
                  <Image className="mb-2" src={`${node.publicationCustomFields?.album?.[0]?.image?.node?.mediaItemUrl || ''}`} alt=""
                  width={640}
                  height={320}
                  style={{
                    width: 'auto',
                    height: '320px'
                  }} />
                  <div className="relative h-8 text-gray-500">
                    <div className="absolute line-clamp-2 w-full">{ node.title }</div>
                  </div>
                </div>

                <div id={`lg-${index}`} key={index}>
                  <LightGallery
                  mode="lg-fade"
                  galleryId={node.slug}
                  licenseKey={process.env.NEXT_PUBLIC_LIGHT_GALLERY_KEY}
                  plugins={[lgThumbnail, lgZoom, lgAutoplay, lgFullscreen]}
                  speed={500}
                  toggleThumb={true}
                  allowMediaOverlap={true}
                  showZoomInOutIcons={true}
                  actualSize={false}
                  scale={0.66}
                  alignThumbnails="left">
                    {
                      node?.publicationCustomFields?.album?.map((pageNode, pageIndex)=>{
                        return <a className="hidden" data-src={pageNode?.image?.node?.mediaItemUrl || ''} key={`${index}-${pageIndex}`}>
                          <Image src={pageNode?.image?.node?.mediaItemUrl || ''} width={100} height={100} alt="" style={{height:'auto'}}/>
                        </a>
                      })
                    }
                  </LightGallery>
                </div>
              </div>
            })
          }
        </div>
      </div>

      <PageNav
      pageInfo={publicationCategory?.publications?.pageInfo}
      onPrevClick={()=>{
        getData({
          variables: {
            slug: publicationCategorySlug,
            before: publicationCategory?.publications?.pageInfo?.startCursor,
            last: 12,
          }
        })
      }}
      onNextClick={()=>{
        getData({
          variables: {
            slug: publicationCategorySlug,
            after: publicationCategory?.publications?.pageInfo?.endCursor,
            first: 12,
          }
        })
      }} />
    </div>
  </Suspense>
}

export default SingleCategory