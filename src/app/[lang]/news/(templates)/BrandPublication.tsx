"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useId, useCallback, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"


import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import lgHash from 'lightgallery/plugins/hash'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import lgFullscreen from 'lightgallery/plugins/fullscreen'
import { useParams } from "next/navigation"

interface TypeProps {
  album: {
    image?: {
      node?: {
        mediaItemUrl: string
      }
    }
  }[]
  [key:string]: any
}

interface TypeState {}

function BrandPublication(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const uid = useId()
  const params = useParams()
  const { lang } = params
  const [subscriptionInputFocus, setSubscriptionInputFocus] = useState(false)
  const coverImage = useMemo(()=>{
    return props?.album?.[0]?.image?.node?.mediaItemUrl
  }, props?.publicationCustomFields?.album)

  const handleReadClick = useCallback(()=>{
    if( document.querySelector(`#lg-${window.CSS.escape(uid)} .lg-react-element a:first-child`) ){
      (document.querySelector(`#lg-${window.CSS.escape(uid)} .lg-react-element a:first-child`) as HTMLElement).click()
    }
  }, [uid])

  return <Suspense fallback={null}>
    <div className={twMerge('bg-[#EEEBE6]', className)}>
      <div className="container py-[96px]">
        <div className="row items-center">
          <div className="lg:col-6 col-12 mb-8 lg:mb-0">
            <div className="row items-center">
              <div className="lg:col-6 col-12 mb-5 flex justify-center lg:mb-0">
                <div className="btn"
                style={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'
                }}
                onClick={handleReadClick}>
                  <Image src={coverImage || ''} width={202} height={278} alt="" style={{height:'auto'}}/>
                </div>
              </div>
              <div className="lg:col-6 col-12 mb-5 text-gray-500 lg:mb-0">
                <div className="mb-2 text-center text-[28px] font-300">The Newest Issue</div>
                <div className="mb-8 flex justify-center">
                  <Button variant="outline" className={buttonStyles['rounded-outline']}
                  onClick={handleReadClick}>
                    READ
                  </Button>
                </div>
                <div className="flex justify-center">
                  <LinkWithLang href="/publications/brand-publication" lang={lang}>
                    <div className="btn-text text-gray-500">More Brand Publication</div>
                  </LinkWithLang>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-6 col-12 mb-6 lg:mb-0">
            <div className="serif mb-10 text-center text-[36px] font-300 text-gray-500">BRAND PUBLICATION<br/>SUBSCRIPTION</div>
            <div className="flex justify-center">
              <form className="row row-gap-0 w-full flex-nowrap items-end justify-center">
                <div className="col-12 shrink" style={{maxWidth:'220px'}}>
                  <input className="serif h-[44px] w-full border-b border-gray-500 bg-transparent p-0 pb-2 text-center placeholder:text-gray-500" type="email" placeholder="Your email" required
                  onFocus={()=>{
                    setSubscriptionInputFocus(true)
                  }}
                  onBlur={()=>{
                    setSubscriptionInputFocus(false)
                  }}/>
                </div>
                {
                  subscriptionInputFocus && <div className="col-auto">
                    <Button type="submit" className="rounded-none border border-gray-500 bg-transparent text-gray-500 hover:border-golden-700 hover:bg-golden-700 hover:text-white">SUBMIT</Button>
                  </div>
                }
              </form>
            </div>
          </div>
        </div>
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
            props?.album?.map((node, index)=>{
              return <a className="hidden" data-src={node?.image?.node?.mediaItemUrl || ''} key={index}>
                <Image src={node?.image?.node?.mediaItemUrl || ''} width={100} height={100} alt="" />
              </a>
            })
          }
        </LightGallery>
      </div>
    </div>
  </Suspense>
}

export default BrandPublication