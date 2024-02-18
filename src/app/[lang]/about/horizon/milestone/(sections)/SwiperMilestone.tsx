"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@src/store'
import { useWindowSize } from 'react-use'
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
  const [realIndex, setRealIndex] = useState(0)
  const {size:slideFrameSize, setNode:setSlideFrameNode} = useDomNodeSize()
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('overflow-hidden', className)}>

      <div className="swiper-milestone"
      style={{
        minHeight: `${slideFrameSize.height}px`
      }}>
        <div className="absolute" ref={setSlideFrameNode}
          style={{
            width: 'calc(52.7vw - 40px)'
          }}>
          <RatioArea className="pointer-events-none opacity-0" ratio="56.25">
            <div></div>
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
                <div className="slide-inner btn flex flex-col"
                onClick={()=>{
                  swiper.slideTo(index)
                }}>
                  <div
                  className="flex flex-col justify-center"
                  style={{
                    height: `${slideFrameSize.height + 40}px`
                  }}>
                    <RatioArea className="mb-3" ratio="56.25">
                      <Image
                      className="size-full absolute left-0 top-0 z-0 object-cover"
                      src={node.image}
                      fill={true}
                      sizes="50vw"
                      placeholder={node?.placeholder ?'blur' :'empty'}
                      blurDataURL={node.placeholder}
                      alt="" />
                    </RatioArea>
                    <div className="description mb-10 line-clamp-2 text-[13px] font-300 text-white">{node?.description}</div>
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
    </div>
  </Suspense>
}

export default SwiperMilestone