"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useEffect, useState, useMemo } from 'react'
import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import RatioArea from "@src/components/custom/RatioArea"
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade } from 'swiper/modules'
import { SwiperClass } from "swiper/react"
import 'swiper/css/effect-fade'
import Marquee from "react-fast-marquee"
import ContentLightbox from "@src/components/custom/ContentLightbox"
import useImageBlurHashes from "@root/src/hooks/useImageBlurHashes"
import SwiperFullHeight from "@src/components/custom/SwiperFullHeight"
import useWindowSize from "@src/hooks/useWindowSize"

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
  const viewport = useWindowSize()
  const { className } = props
  const [realIndex, setRealIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

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
      <div className="container mb-3 text-center text-gray-500 lg:mb-5">Interior</div>
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