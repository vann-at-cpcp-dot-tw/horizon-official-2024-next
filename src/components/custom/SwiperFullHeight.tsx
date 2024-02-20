"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade } from 'swiper/modules'
import { SwiperClass } from "swiper/react"
import 'swiper/css/effect-fade'

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  list: {
    content?: React.ReactNode | string | number
    embedUrl?: string
    title?: string
  }[]
  [key:string]: any
}
interface TypeState {}

function SwiperFullHeight(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const [swiper, setSwiper] = useState<SwiperClass>(({} as SwiperClass))
  const [realIndex, setRealIndex] = useState(0)

  return <Suspense fallback={null}>
    <div className={twMerge('absolute w-full h-full left-0 top-0 flex flex-col flex-nowrap overflow-hidden', className)}>
      <div className="flex grow !flex-nowrap overflow-hidden">
        <div className="flex flex-none items-center">
          <div className={`btn group flex size-12 items-center justify-center rounded-full border border-gray-900 hover:border-golden-900 hover:bg-golden-900 ${swiper.isBeginning ?'disabled opacity-50' :''}`}
              onClick={()=>{
                swiper.slidePrev()
              }}>
            <Image className="grayscale group-hover:brightness-[1000]" src={`${BASE_PATH}/assets/img/icon_menu_back.svg`} width={48} height={48} alt="" />
          </div>
        </div>

        <div className="size-full shrink px-5">
          <Swiper
          className="h-full"
          modules={[EffectFade]}
          effect="fade"
          speed={500}
          spaceBetween={0}
          slidesPerView={1}
          initialSlide={realIndex}
          onSwiper={(e)=>{
            setSwiper(e)
          }}
          onSlideChange={(e)=>{
            setRealIndex(e.realIndex)
          }}>
            {
              props?.list?.map?.((node, index)=>{
                return <SwiperSlide key={index}>
                  <div className="relative size-full">
                    { node.content }
                    {
                      (node?.embedUrl && realIndex === index) && <iframe className="absolute left-0 top-0 z-10 size-full" src={node.embedUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                    }
                  </div>
                </SwiperSlide>
              })
            }
          </Swiper>
        </div>

        <div className="flex flex-none items-center">
          <div className={`btn group flex size-12 items-center justify-center rounded-full border border-gray-900 hover:border-golden-900 hover:bg-golden-900 ${swiper.isEnd ?'disabled opacity-50' :''}`}
              onClick={()=>{
                swiper.slideNext()
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
              return <div className="pt-5 text-center text-gray-700" key={index}>{ node?.title }</div>
            }
          })
        }
        <div className="text-center text-gray-700">{realIndex+1}{/* &nbsp;/&nbsp; */}／{props?.list?.length}</div>
      </div>

    </div>
  </Suspense>
}

export default SwiperFullHeight