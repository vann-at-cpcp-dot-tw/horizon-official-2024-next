"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useMemo, useState } from 'react'

import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  gallery: {
    image?: {
      node?: ImageNode
    }
    placeholder?: string
  }[]
  [key:string]: any
}
interface TypeState {}

function PostSwiper(props:TypeProps){
  const { className } = props
  const [swiper, setSwiper] = useState<SwiperClass>(({} as SwiperClass))
  const [realIndex, setRealIndex] = useState(0)

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>

      <div className="mb-5">
        <Swiper
        speed={1000}
        spaceBetween={0}
        modules={[Autoplay]}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
        }}
        onSwiper={(e)=>{
          setSwiper(e)
        }}
        onSlideChange={(e)=>{
          setRealIndex(e.realIndex)
        }}>
          {
            props?.gallery?.map((node, index:number)=>{
              return <SwiperSlide key={index}>
                <RatioArea ratio="56.25">
                  {
                    <img className="absolute left-0 top-0 z-0 size-full object-cover"
                    src={node?.image?.node?.mediaItemUrl || ''}
                    srcSet={node?.image?.node?.srcSet || ''}
                    sizes="(max-width:991px) 100vw, 900px" />
                  }
                </RatioArea>
              </SwiperSlide>
            })
          }
        </Swiper>
      </div>

      {
        swiper?.isLocked === false && <div className="container-fluid overflow-hidden">
          <div className="row row-gap-2 flex-nowrap justify-center">
            {
              props?.gallery?.map((node, index)=>{
                return <div className="col group" key={index}
                  style={{
                    maxWidth: realIndex === index ?'68px' :'38px',
                    transition: 'all .8s cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                  }}>
                  <div
                    className="btn relative py-2"
                    onClick={()=>{
                      swiper.slideTo(index)
                    }}
                    onTouchStart={()=>{
                      swiper?.autoplay?.pause?.()
                    }}
                    onTouchEnd={()=>{
                      swiper?.autoplay?.resume?.()
                    }}
                    onMouseEnter={()=>{
                      swiper?.autoplay?.pause?.()
                    }}
                    onMouseLeave={()=>{
                      swiper?.autoplay?.resume?.()
                    }}>
                    <div className="absolute top-1/2 w-full -translate-y-1/2 group-hover:!h-[2px] group-active:!h-[2px]"
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
  </Suspense>
}

export default PostSwiper