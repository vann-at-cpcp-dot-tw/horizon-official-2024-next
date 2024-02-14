"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useEffect, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import useRefSize from "@src/hooks/useDomNodeSize"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, FreeMode, Autoplay } from 'swiper/modules'
import { SwiperClass } from "swiper/react"
import 'swiper/css/effect-fade'
import Marquee from "react-fast-marquee"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

// import 'swiper/css/free-mode'

interface TypeProps {
  list: {
    image?: {
      node?: {
        mediaItemUrl: string
      }
    }
    description: string
  }[]
  [key:string]: any
}
interface TypeState {}

function YachtInteriorSwiper(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const [swiper, setSwiper] = useState<SwiperClass>(({} as SwiperClass))
  const [swiperZoom, setSwiperZoom] = useState<SwiperClass>(({} as SwiperClass))
  const [realIndex, setRealIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(()=>{
    if( isOpen ){
      document.body.classList.add('lb-open')
    }else{
      document.body.classList.remove('lb-open')
    }
  }, [isOpen])

  return <Suspense fallback={null}>
    <div className={twMerge('overflow-hidden', className)}>
      <div className="container mb-5 text-center text-gray-500">Interior</div>
      {
        !isOpen && <Marquee
          speed={20}>
          {
            props?.list?.map?.((node, index)=>{
              return <div className="w-[35vw] px-1.5 lg:w-[23.42vw] lg:px-2.5" key={index}>
                <div className="btn"
                  onClick={()=>{
                    setRealIndex(index)
                    setIsOpen(true)
                  }}>
                  <RatioArea ratio="56.25">
                    <Image className="absolute left-0 top-0 z-0 h-full w-full object-cover" fill={true} sizes="23.42vw" src={node?.image?.node?.mediaItemUrl || ''} alt="" />
                  </RatioArea>
                </div>
              </div>
            })
          }
        </Marquee>
      }

      {
        isOpen && <div className="fixed left-0 top-0 z-[99999] flex h-full w-full flex-col justify-center bg-golden-300 p-10">
          <div className="sticky left-0 top-0 -ml-8 -mt-10 mb-8 flex pt-2">
            <div className="btn bg-golden-300"
            onClick={()=>{
              setIsOpen(false)
            }}>
              <Image src={`${BASE_PATH}/assets/img/icon_menu_x.svg`} width={48} height={48} alt=""/>
            </div>
          </div>

          <div className="flex grow !flex-nowrap overflow-hidden">
            <div className="flex flex-none items-center">
              <div className={`btn group flex h-12 w-12 items-center justify-center rounded-full border border-gray-900 hover:border-golden-900 hover:bg-golden-900 ${swiperZoom.isBeginning ?'disabled opacity-50' :''}`}
              onClick={()=>{
                swiperZoom.slidePrev()
              }}>
                <Image className="grayscale group-hover:brightness-[1000]" src={`${BASE_PATH}/assets/img/icon_menu_back.svg`} width={48} height={48} alt="" />
              </div>
            </div>

            <div className="h-full w-full shrink px-5">
              <Swiper
              className="h-full"
              modules={[EffectFade]}
              effect="fade"
              speed={500}
              spaceBetween={0}
              slidesPerView={1}
              initialSlide={realIndex}
              onSwiper={(e)=>{
                setSwiperZoom(e)
              }}
              onSlideChange={(e)=>{
                setRealIndex(e.realIndex)
              }}>
                {
                  props?.list?.map?.((node, index)=>{
                    return <SwiperSlide key={index}>
                      <div className="relative h-full w-full">
                        <Image className="" src={node?.image?.node?.mediaItemUrl || ''} fill={true} sizes="100vw" style={{objectFit: "contain"}} alt="" />
                      </div>
                    </SwiperSlide>
                  })
                }
              </Swiper>
            </div>

            <div className="flex flex-none items-center">
              <div className={`btn group flex h-12 w-12 items-center justify-center rounded-full border border-gray-900 hover:border-golden-900 hover:bg-golden-900 ${swiperZoom.isEnd ?'disabled opacity-50' :''}`}
              onClick={()=>{
                swiperZoom.slideNext()
              }}>
                <Image className="grayscale group-hover:brightness-[1000]" src={`${BASE_PATH}/assets/img/icon_menu_back.svg`} width={48} height={48} alt=""
                style={{
                  transform: 'rotate(180deg)'
                }}/>
              </div>
            </div>
          </div>

          <div>
            {
              props?.list?.map((node, index)=>{
                if( realIndex === index ){
                  return <div className="pt-5 text-center text-gray-700" key={index}>{ node?.description }</div>
                }
              })
            }
            <div className="text-center text-gray-700">{realIndex+1}{/* &nbsp;/&nbsp; */}／{props?.list?.length}</div>
          </div>
        </div>
      }
    </div>
  </Suspense>
}

export default YachtInteriorSwiper