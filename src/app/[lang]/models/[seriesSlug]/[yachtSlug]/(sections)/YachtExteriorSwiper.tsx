"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import useDomNodeSize from "@src/hooks/useDomNodeSize"
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

interface TypeProps {
  list: {
    image?: {
      node?: {
        mediaItemUrl: string
      }
    }
  }[]
  [key:string]: any
}
interface TypeState {}

function YachtsExteriorSwiper(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const {size:slideFrameSize, setNode:setSlideFrameNode} = useDomNodeSize()
  const [swiper, setSwiper] = useState<SwiperClass>(({} as SwiperClass))
  const [realIndex, setRealIndex] = useState(0)

  return <Suspense fallback={null}>
    <div className={twMerge('relative overflow-hidden', className)}>
      <div className="swiper-yacht-exterior">
        <div className="container" style={{maxWidth:'1080px'}}>

          <div className="swiper-yacht-exterior mb-5"
        style={{
          minHeight: `${slideFrameSize.height}px`
        }}>

            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" ref={setSlideFrameNode}
          style={{
            width: 'calc(76.35vw - 40px)'
          }}>
              <RatioArea ratio="56.25">
                <div className="size-full absolute left-0 top-0 flex items-center justify-between">
                  {
                    swiper?.isLocked === false && <>
                      <div className={`btn ${swiper.isBeginning ?'disabled opacity-50' :''}`}
                    onClick={()=>{
                      swiper.slidePrev()
                    }}>
                        <i className="bi bi-chevron-compact-left text-[64px] text-white"></i>
                      </div>
                      <div className={`btn ${swiper.isEnd ?'disabled opacity-50' :''}`}
                    onClick={()=>{
                      swiper.slideNext()
                    }}>
                        <i className="bi bi-chevron-compact-right text-[64px] text-white"></i>
                      </div>
                    </>
                  }
                </div>
              </RatioArea>
            </div>

            <Swiper
            className="!overflow-visible"
            speed={1000}
            spaceBetween={0}
            slidesPerView="auto"
            centeredSlides={true}
            onSwiper={(e)=>{
              setSwiper(e)
            }}
            onSlideChange={(e)=>{
              setRealIndex(e.realIndex)
            }}>
              {
                props?.list?.map?.((node, index)=>{
                  return <SwiperSlide key={index}>
                    <div className="slide-inner">
                      <RatioArea className="" ratio="56.25">
                        <Image className="size-full absolute left-0 top-0 z-0 object-cover" priority={true} src={node?.image?.node?.mediaItemUrl || ''} fill={true} sizes="76.35vw" alt="" />
                      </RatioArea>
                    </div>
                  </SwiperSlide>
                })
              }
            </Swiper>
          </div>

          {
            swiper?.isLocked === false && <div className="container-fluid overflow-hidden">
              <div className="row row-gap-2 flex-nowrap justify-center">
                {
                  props?.list?.map((node, index)=>{
                    return <div className="col group" key={index}
                  style={{
                    maxWidth: realIndex === index ?'68px' :'38px',
                    transition: 'all .8s cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                  }}>
                      <div
                    className="btn relative py-2"
                    onClick={()=>{
                      swiper.slideTo(index)
                    }}>
                        <div className="absolute top-1/2 w-full -translate-y-1/2 group-hover:!h-[2px]"
                    style={{
                      background: realIndex === index ?'var(--color-golden-900)' :'var(--color-gray-300)',
                      height: realIndex === index ?'2px' :'1px',
                    }}></div>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  </Suspense>
}

export default YachtsExteriorSwiper