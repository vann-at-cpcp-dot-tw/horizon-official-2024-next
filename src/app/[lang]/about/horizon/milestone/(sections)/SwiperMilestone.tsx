"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { Suspense, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@src/store'
import useWindowSize from "@src/hooks/useWindowSize"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import useDomNodeSize from "@src/hooks/useDomNodeSize"
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"

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
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
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
                  swiperTimeline.slideTo(index)
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