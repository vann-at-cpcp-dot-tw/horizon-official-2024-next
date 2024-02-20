"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useState, useId } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'

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
  title: string
  publicationCustomFields?: {
    relatedYachts?: {
      seriesSlug: string
    }[]
    album?: {
      image?: {
        node?: {
          mediaItemUrl: string
        }
      }
    }[]
  }
  [key:string]: any
}
interface TypeState {}

function Publication(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const uid = useId()
  const coverImage = useMemo(()=>{
    return props?.publicationCustomFields?.album?.[0]?.image?.node?.mediaItemUrl
  }, [props?.publicationCustomFields?.album])

  if( !props.title || !coverImage){
    return null
  }

  return <Suspense fallback={null}>
    <div className={twMerge('bg-[#E6E3DD] py-20', className)}>
      <div className="container mb-6 text-center text-[17px] text-gray-500">Brochure</div>
      <div className="container">
        <div className="row justify-center">
          {
            <div className="col-12 flex justify-center lg:col-auto">
              <div className="btn"
              style={{
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'
              }}
              onClick={()=>{
                (document.querySelector(`#lg-${window.CSS.escape(uid)} .lg-react-element a:first-child`) as HTMLElement)?.click?.()
              }}>
                <Image src={coverImage} width={420} height={300} alt="" />
              </div>
            </div>
          }
        </div>

        <div id={`lg-${uid}`}>
          <LightGallery
          licenseKey={process.env.NEXT_PUBLIC_LIGHT_GALLERY_KEY}
          plugins={[lgThumbnail, lgZoom, lgAutoplay, lgFullscreen]}
          speed={500}
          toggleThumb={true}
          allowMediaOverlap={true}
          showZoomInOutIcons={true}
          actualSize={false}
          scale={0.66}
          alignThumbnails="left"
          onAfterOpen={()=>{
            // document.body.classList.add('lg-open')
          }}
          onAfterClose={()=>{
            // document.body.classList.remove('lg-open')
          }}>
            {
              props?.publicationCustomFields?.album?.map((node, index)=>{
                return <a className="hidden" data-src={node?.image?.node?.mediaItemUrl || ''} key={index}>
                  <Image src={node?.image?.node?.mediaItemUrl || ''} width={100} height={100} alt="" />
                </a>
              })
            }
          </LightGallery>
        </div>
      </div>
    </div>
  </Suspense>
}

export default Publication