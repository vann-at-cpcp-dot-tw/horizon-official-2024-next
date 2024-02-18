"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

interface TypeProps {
  gallery: {
    image?: {
      node?: {
        mediaItemUrl: string
      }
    }
    placeholder?: string
  }[]
  [key:string]: any
}
interface TypeState {}

function PostSwiper(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const [swiper, setSwiper] = useState<SwiperClass>(({} as SwiperClass))
  const [realIndex, setRealIndex] = useState(0)

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>

      <div className="mb-5">
        <Swiper
        speed={1000}
        // spaceBetween={0}
        slidesPerView={1}
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
                    <Image className="absolute left-0 top-0 z-0 h-full w-full object-cover"
                    src={node?.image?.node?.mediaItemUrl || ''}
                    width={900}
                    height={506}
                    priority={true}
                    placeholder={node?.placeholder ?'blur' :'empty'}
                    blurDataURL={node?.placeholder}
                    alt="" />
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
  </Suspense>
}

export default PostSwiper