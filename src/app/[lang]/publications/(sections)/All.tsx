"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useContext, useState, useRef, useEffect } from 'react'
import Image from "next/image"
import { useRouter } from "next/navigation"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { TypePublicationNode, TypePublicationCategoryNode } from "../layout"
import { LocalDataContext } from "../(templates)/LocalDataProvider"
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"


interface TypeProps {
  [key:string]: any
}
interface TypeState {}

function All(props:TypeProps, ref:React.ReactNode){

  const { className } = props
  const localData = useContext(LocalDataContext)
  const { publicationCategories } = localData ?? {}
  const swiperRefs = useRef<SwiperClass[]>([])
  const [swiperProgress, setSwiperProgress] = useState<{[key:string]:number}>({})


  return <Suspense fallback={null}>

    <div className={twMerge('overflow-hidden', className)}>
      {
        publicationCategories?.nodes?.map?.((categoryNode:TypePublicationCategoryNode, categoryIndex:number)=>{
          return <div className="container-fluid mb-24 px-20" key={categoryIndex}>
            <div className="text-gray-300">{ categoryNode.name }</div>
            <div className="row row-gap-3 mb-3">
              <div className="col-auto">
                <div className="row row-gap-3">
                  <div className="col-auto"
                onClick={()=>{
                  (swiperRefs.current[categoryIndex] as SwiperClass).slidePrev()
                }}>
                    <i className={`bi bi-arrow-left btn text-[18px] text-golden-900 ${(swiperRefs.current[categoryIndex] as SwiperClass)?.isBeginning ?'pointer-events-none opacity-30' :''}`}></i>
                  </div>
                  <div className="col-auto"
                onClick={()=>{
                  (swiperRefs.current[categoryIndex] as SwiperClass).slideNext()
                }}>
                    <i className={`bi bi-arrow-right btn text-[18px] text-golden-900 ${(swiperRefs.current[categoryIndex] as SwiperClass)?.isEnd ?'pointer-events-none opacity-30' :''}`}></i>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="relative size-full">
                  <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-[#D0D0D0]"></div>
                  <div className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-golden-900"
                  style={{
                    width: `${swiperProgress[categoryIndex]}%`,
                    transition: 'all 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                  }}></div>
                </div>
              </div>
            </div>
            <Swiper
            className="!overflow-visible"
            // modules={[FreeMode]}
            // freeMode
            // centeredSlides={true}
            speed={1000}
            spaceBetween={32}
            slidesPerView="auto"
            onSwiper={(e)=>{
              swiperRefs.current[categoryIndex] = e
            }}
            onSlideChange={(e)=>{
              // setRealIndex(e.realIndex)
            }}
            onProgress={(e)=>{
              setSwiperProgress({
                ...swiperProgress,
                [categoryIndex]: e.progress * 100
              })
            }}>
              {
                categoryNode?.publications?.nodes?.map?.((publicationNode:TypePublicationNode, publicationIndex)=>{
                  return <SwiperSlide className="!w-auto" key={`${categoryIndex}-${publicationIndex}`}>
                    <a className="btn block" href={publicationNode.publicationCustomFields?.publication?.pdf?.node?.mediaItemUrl} target="_blank">
                      <Image className="mb-2" src={`${publicationNode.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl || ''}`} alt="" width={380} height={categoryIndex === 0 ?525 :320}
                      priority={true}
                    style={{
                      width: 'auto',
                      height: `${categoryIndex === 0 ?525 :320}px`
                    }} />
                      <div className="relative h-8 text-gray-500">
                        <div className="absolute line-clamp-2 w-full">{ publicationNode.title }</div>
                      </div>
                    </a>
                  </SwiperSlide>
                })
              }
            </Swiper>
          </div>
        })
      }
    </div>
  </Suspense>
}

export default All