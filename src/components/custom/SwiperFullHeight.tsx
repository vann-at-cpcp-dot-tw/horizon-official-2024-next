"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useState, useEffect } from 'react'

import { EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"
import { twMerge } from 'tailwind-merge'
import { useDomNodeSize } from 'vanns-common-modules/dist/use/react'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty, calcSizeByRatio } from '~/lib/utils'

import 'swiper/css/effect-fade'
import IconMenuBack from "./icons/MenuBack"

interface TypeProps {
  iframeRatio?: number
  list: {
    content?: React.ReactNode | string | number
    embedUrl?: string
    title?: string
  }[]
  [key:string]: any
}
interface TypeState {}

function SwiperFullHeight(props:TypeProps){
  const { className } = props
  const [swiper, setSwiper] = useState<SwiperClass>(({} as SwiperClass))
  const [realIndex, setRealIndex] = useState(0)

  const {size:contentWrapperSize, setNode:setContentWrapperNode} = useDomNodeSize()
  const [iframeSize, setIframeSize] = useState<{w:string|number, h:string|number}>({
    w: '100%',
    h: '100%',
  })

  useEffect(()=>{
    if( !props.iframeRatio || !contentWrapperSize.width){
      return
    }

    const widthBasedSize = calcSizeByRatio({w:contentWrapperSize.width, h:null, ratio:props.iframeRatio})
    const heightBasedSize = calcSizeByRatio({w:null, h:contentWrapperSize.height, ratio:props.iframeRatio})

    // 如果寬撐滿時高會超出，那就改成高撐滿模式
    if( widthBasedSize?.h && (widthBasedSize.h > contentWrapperSize.height) ){
      setIframeSize(heightBasedSize || iframeSize)
    }else{
      setIframeSize(widthBasedSize || iframeSize)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contentWrapperSize.width,
    contentWrapperSize.height,
    props.iframeRatio
  ])

  return <Suspense fallback={null}>
    <div className={twMerge(`lg:absolute relative w-full lg:h-full h-auto left-0 top-0 flex flex-col flex-nowrap overflow-hidden`, className)}>

      <div className="flex grow !flex-nowrap overflow-hidden p-5 lg:px-10">
        <div className="hidden flex-none items-center lg:flex">
          <div className={`btn group flex size-12 items-center justify-center rounded-full border border-gray-900 hover:border-golden-900 hover:bg-golden-900 active:border-golden-900 active:bg-golden-900 ${swiper.isBeginning ?'disabled opacity-50' :''}`}
          onClick={()=>{
            swiper.slidePrev()
          }}>
            <IconMenuBack className="w-12 !stroke-black hover:!stroke-white active:!stroke-white" />
          </div>
        </div>

        <div className="size-full shrink lg:px-5">
          <div className="relative size-full" ref={setContentWrapperNode}>
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
                    <div className={`relative size-full ${realIndex === index ?'opacity-1' :'opacity-0'}`}
                  style={{
                    transition: 'all .8s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
                  }}>
                      { node.content }
                      {
                        (node?.embedUrl && realIndex === index) && <iframe className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" src={node.embedUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        style={{
                          width: typeof iframeSize.w === 'string' ?iframeSize.w :`${iframeSize.w}px`,
                          height: typeof iframeSize.h === 'string' ?iframeSize.h :`${iframeSize.h}px`,
                        }}></iframe>
                      }
                    </div>
                  </SwiperSlide>
                })
              }
            </Swiper>
          </div>
        </div>

        <div className="hidden flex-none items-center lg:flex">
          <div className={`btn group flex size-12 items-center justify-center rounded-full border border-gray-900 hover:border-golden-900 hover:bg-golden-900 active:border-golden-900 active:bg-golden-900 ${swiper.isEnd ?'disabled opacity-50' :''}`}
            onClick={()=>{
              swiper.slideNext()
            }}>
            <IconMenuBack className="w-12 !stroke-black hover:!stroke-white active:!stroke-white"
            style={{
              transform: 'rotate(180deg)'
            }}/>
          </div>
        </div>
      </div>

      <div className="pb-5 lg:pb-10">
        <div className="flex justify-center lg:hidden">
          <div className="mx-2 flex flex-none items-center">
            <div className={`btn group flex size-9 items-center justify-center rounded-full border border-gray-900 hover:border-golden-900 hover:bg-golden-900 active:border-golden-900 active:bg-golden-900 ${swiper.isBeginning ?'disabled opacity-50' :''}`}
              onClick={()=>{
                swiper.slidePrev()
              }}>
              <IconMenuBack className="w-9 !stroke-black hover:!stroke-white active:!stroke-white" />
            </div>
          </div>

          <div className="mx-2 flex flex-none items-center">
            <div className={`btn group flex size-9 items-center justify-center rounded-full border border-gray-900 hover:border-golden-900 hover:bg-golden-900 active:border-golden-900 active:bg-golden-900 ${swiper.isEnd ?'disabled opacity-50' :''}`}
              onClick={()=>{
                swiper.slideNext()
              }}>
              <IconMenuBack className="w-9 !stroke-black hover:!stroke-white active:!stroke-white"
              style={{
                transform: 'rotate(180deg)'
              }}/>
            </div>
          </div>
        </div>
        {
          props?.list?.map((node, index)=>{
            if( realIndex === index ){
              return <div className="px-5 py-2.5 text-center text-gray-700" key={index}>{ node?.title }</div>
            }
          })
        }
        <div className="text-center text-gray-700">{realIndex+1}{/* &nbsp;/&nbsp; */}／{props?.list?.length}</div>
      </div>

    </div>
  </Suspense>
}

export default SwiperFullHeight