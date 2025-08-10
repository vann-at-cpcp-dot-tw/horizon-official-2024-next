"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useEffect, useState, useMemo } from 'react'

import Image from "next/image"
import Marquee from "react-fast-marquee"
import { EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import 'swiper/css/effect-fade'
import { useImageBlurHashes } from 'vanns-common-modules/dist/use/next'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import ContentLightbox from '~/components/custom/ContentLightbox'
import SwiperFullHeight from '~/components/custom/SwiperFullHeight'

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

function YachtInteriorSwiper(props:TypeProps){
  const viewport = useWindowSize()
  const { className } = props
  const [realIndex, setRealIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { __ } = useTranslate()

  useEffect(()=>{
    if( isOpen ){
      document.body.classList.add('lb-open')
    }else{
      document.body.classList.remove('lb-open')
    }
  }, [isOpen])

  const images = useMemo(()=>{
    return props?.list?.map((node)=>node?.image?.node?.mediaItemUrl)
  }, [props.list])
  const imageBlurHashes = useImageBlurHashes(images)

  return <Suspense fallback={null}>
    <div id="SECTION_INTERIOR" className={twMerge('overflow-hidden lg:mb-24 mb-12', className)}>
      <div className="container mb-3 text-center text-gray-500 lg:mb-5">{ __('Interior') }</div>
      {
        !isOpen && <Marquee
          autoFill
          speed={20}>
          {
            props?.list?.map?.((node, index)=>{
              return <div className="w-[44vw] px-1.5 lg:w-[23.42vw] lg:px-2.5" key={index}>
                <div className="btn group"
                  onClick={()=>{
                    setRealIndex(index)
                    setIsOpen(true)
                  }}>
                  <RatioArea ratio="56.25">
                    <div className="absolute left-0 top-0 z-10 flex size-full cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'rgba(0, 46, 79, 0.5)',
                      transition: 'all .4s'
                    }}>
                      <div className="flex size-[56px] items-center justify-center rounded-full bg-golden-700">
                        <i className="bi bi-plus-lg text-[24px] text-white"></i>
                      </div>
                    </div>
                    <Image className="absolute left-0 top-0 z-0 size-full object-cover"
                    fill={true}
                    sizes="23.42vw"
                    src={node?.image?.node?.mediaItemUrl || ''}
                    placeholder={imageBlurHashes?.[index] ?'blur' :'empty'}
                    blurDataURL={imageBlurHashes?.[index]}
                    alt="" />
                  </RatioArea>
                </div>
              </div>
            })
          }
        </Marquee>
      }

      {
        isOpen && <ContentLightbox
        onClose={()=>{
          setIsOpen(false)
        }}>
          <SwiperFullHeight
          list={
            props?.list?.map?.((node, index)=>({
              content: <Image src={node?.image?.node?.mediaItemUrl || ''}
              fill={viewport.width && viewport.width >= 992 ?true :false}
              width={viewport.width && viewport.width >= 992 ?0 :1920}
              height={viewport.width && viewport.width >= 992 ?0 :1080}
              sizes="100vw"
              style={{
                objectFit: viewport.width && viewport.width >= 992 ?'contain' :'cover',
                width: '100%',
                height: viewport.width && viewport.width >= 992 ?'100%' :'auto'
              }}
                placeholder={imageBlurHashes?.[index] ?'blur' :'empty'}
                blurDataURL={imageBlurHashes?.[index]}
                alt="" />,
              title: node?.description
            }))
          }
          />
        </ContentLightbox>
      }
    </div>
  </Suspense>
}

export default YachtInteriorSwiper