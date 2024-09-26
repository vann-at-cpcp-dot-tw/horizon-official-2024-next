"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useState, useRef } from 'react'

import Image from "next/image"
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useWindowSize, useDomNodeSize } from "vanns-common-modules/dist/use/react"

import { isEmpty } from '~/lib/utils'
import { useStore } from '~/store'

interface TypeProps {
  list: {
    year: string
    title: string
    image: string
    placeholder?: string
    description?: string
  }[]
  [key:string]: any
}
interface TypeState {}

function SwiperMilestone(props:TypeProps, ref:React.ReactNode){
  const [swiper, setSwiper] = useState<SwiperClass>(({} as SwiperClass))
  const [swiperTimeline, setSwiperTimeline] = useState<SwiperClass>(({} as SwiperClass))
  const [realIndex, setRealIndex] = useState(0)
  const {size:slideFrameSize, setNode:setSlideFrameNode} = useDomNodeSize()
  const [maxDescriptionHeight, setMaxDescriptionHeight] = useState(0)
  const { className } = props

  return <Suspense fallback={null}>
    <div className={twMerge('overflow-hidden', className)}>

      <div className="swiper-milestone pointer-events-none !fixed w-full opacity-0">
        <div className="swiper-slide-active">
          <div className="slide-inner" ref={setSlideFrameNode}>
            <RatioArea className="pointer-events-none mb-3 opacity-0" ratio="56.25">
              <div></div>
            </RatioArea>
          </div>
        </div>

        <div className="swiper-slide-active">
          <div className="slide-inner">
            <RatioArea className="pointer-events-none opacity-0" ratio="56.25">
              <div className="absolute left-0 top-0 size-full">
                {
                  props?.list?.map((node, index)=>{
                    return <div className="absolute pb-10 text-[13px] font-300 text-white" key={index}
                    ref={(e)=>{
                      e?.clientHeight && e.clientHeight > maxDescriptionHeight ? setMaxDescriptionHeight(e?.clientHeight) :null
                    }}>{node?.description}</div>
                  })
                }
              </div>
            </RatioArea>
          </div>
        </div>
      </div>

      <div className="swiper-milestone swiper-milestone-timeline"
      style={{
        minHeight: `${slideFrameSize.height + maxDescriptionHeight}px`
        // minHeight: '457px'
      }}>
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
          // setRealIndex(e.realIndex)
        }}>
          {
            props?.list?.map?.((node, index)=>{
              return <SwiperSlide key={index}>
                <div className="slide-inner btn flex grow flex-col"
                onClick={()=>{
                  swiper.slideTo(index)
                  // swiperTimeline.slideTo(index)
                }}>
                  <div className="relative flex grow flex-col justify-start"
                  style={{
                    // background: 'pink',
                    // height: `${slideFrameSize.height + maxDescriptionHeight}px`
                    // maxHeight: '406px',
                    // minHeight: '406px',
                  }}>
                    <RatioArea className="mb-3" ratio="56.25">
                      <Image
                      className="absolute left-0 top-0 z-0 size-full object-cover"
                      src={node.image}
                      fill={true}
                      sizes="50vw"
                      placeholder={node?.placeholder ?'blur' :'empty'}
                      blurDataURL={node.placeholder}
                      alt="" />
                    </RatioArea>
                    <div className="pb-10">
                      <div className="description text-[13px] font-300 text-white">{node?.description}</div>
                    </div>
                  </div>
                  <div className="btn mt-auto">
                    <div className="mb-6 text-[12px] text-white">{node?.year}</div>
                    <div className="line"></div>
                    <div className="title line-clamp-1 text-[13px]">{node?.title}</div>
                  </div>
                </div>
              </SwiperSlide>
            })
          }
        </Swiper>
      </div>

      {/* <div className="swiper-milestone swiper-milestone-timeline">
        <Swiper
        className="!overflow-visible"
        speed={1000}
        spaceBetween={0}
        slidesPerView="auto"
        centeredSlides={true}
        onSwiper={(e)=>{
          setSwiperTimeline(e)
        }}
        onSlideChange={(e)=>{
          // setRealIndex(e.realIndex)
        }}>
          {
            props?.list?.map?.((node, index)=>{
              return <SwiperSlide key={index}>
                <div className="slide-inner btn flex grow flex-col"
                onClick={()=>{
                  // swiper.slideTo(index)
                }}>
                  <div className="btn mt-auto">
                    <div className="mb-6 text-[12px] text-white">{node?.year}</div>
                    <div className="line"></div>
                    <div className="title line-clamp-1 text-[13px]">{node?.title}</div>
                  </div>
                </div>
              </SwiperSlide>
            })
          }
        </Swiper>
      </div> */}
    </div>
  </Suspense>
}

export default SwiperMilestone