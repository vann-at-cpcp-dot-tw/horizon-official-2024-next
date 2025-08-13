"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useMemo, useEffect, useState, ReactNode } from 'react'

import Image from "next/image"
import { useParams } from 'next/navigation'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useDomNodeSize } from 'vanns-common-modules/dist/use/react'

import LinkWithLang from '~/components/custom/LinkWithLang'

import IconMenuBack from "./icons/MenuBack"

interface TypeProps {
  listTitle: string
  list?: {
    slug: string
    label: string
    content?: string | ReactNode
    link?: string
    mediaItemUrl?: string
    placeholder?: string
    srcSet?: string
  }[]
  swiperOptions?: {
    autoplay?: {
      [key:string]: any
    }
  }
  onSlideChange?: Function
}

interface TypeState {}

function SwiperOverflow(props:TypeProps){
  const params = useParams()
  const { lang } = params
  const [bodyWidth, setBodyWidth] = useState(0)
  const [swiper, setSwiper] = useState<SwiperClass>(({} as SwiperClass))
  const [realIndex, setRealIndex] = useState(0)
  const { size:centerSize, setNode:setCenterNode } = useDomNodeSize()
  const { size:paginationSize, setNode:setPaginationNode } = useDomNodeSize()
  const centerRight = useMemo(()=>{
    return (bodyWidth - centerSize.width) / 2
  }, [bodyWidth])

  const useModules = useMemo(()=>{
    let useModules = []
    if( props?.swiperOptions?.autoplay ){
      useModules.push(Autoplay)
    }
    return useModules
  }, [props.swiperOptions])

  useEffect(()=> {
    const observer = new ResizeObserver(mutationRecords => {
      setBodyWidth(document.body.clientWidth)
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
    }
  },[])

  return <Suspense fallback={null}>
    <div className="relative ml-[-20px] overflow-hidden lg:ml-0">
      <div className="relative mx-auto w-full lg:w-[70%]"
      ref={setCenterNode}
      style={{
        maxWidth: 'calc(100% - 80px)'
      }}>
        {
          swiper?.isLocked === false && <div className="absolute left-5 top-1/2 z-10 -translate-y-1/2"
          style={{
            marginTop: `-${paginationSize?.height}px`
          }}>
            <div className={`btn group flex size-8 items-center justify-center rounded-full border  border-white hover:border-golden-900 hover:bg-golden-900 active:border-golden-900 active:bg-golden-900 lg:size-12 ${swiper.isBeginning ?'disabled opacity-50' :''} mt-[18px] lg:mt-[14px]`}
              onClick={()=>{
                swiper.slidePrev()
              }}>
              <IconMenuBack className="w-8 lg:w-12" stroke="white"/>
            </div>
          </div>
        }

        {
          swiper?.isLocked === false &&<div className="absolute right-5 top-1/2 z-10 -translate-y-1/2"
          style={{
            marginTop: `-${paginationSize?.height}px`
          }}>
            <div className={`btn group flex size-8 items-center justify-center rounded-full border border-white hover:border-golden-900 hover:bg-golden-900 active:border-golden-900 active:bg-golden-900 lg:size-12 ${swiper.isEnd ?'disabled opacity-50' :''} mt-[18px] lg:mt-[14px]`}
              onClick={()=>{
                swiper.slideNext()
              }}>
              <IconMenuBack className="w-8 lg:w-12" stroke="white"
              style={{
                transform: 'rotate(180deg)'
              }} />
            </div>
          </div>
        }

        <Swiper className="!overflow-visible"
        modules={useModules}
        autoplay={props?.swiperOptions?.autoplay}
        speed={1000}
        spaceBetween={20}
        slidesPerView={1}
        onSwiper={(e)=>{
          setSwiper(e)
        }}
        onSlideChange={(e)=>{
          setRealIndex(e.realIndex)
          props?.onSlideChange?.({
            realIndex: e.realIndex
          })
        }}>
          {
            props?.list?.map?.((node, index)=>{
              return <SwiperSlide key={index}
              onTouchStart={()=>{
                if( props?.swiperOptions?.autoplay ){
                  swiper?.autoplay?.pause?.()
                }
              }}
              onTouchEnd={()=>{
                if( props?.swiperOptions?.autoplay ){
                  swiper?.autoplay?.resume?.()
                }
              }}
              onMouseEnter={()=>{
                if( props?.swiperOptions?.autoplay ){
                  swiper?.autoplay?.pause?.()
                }
              }}
              onMouseLeave={()=>{
                if( props?.swiperOptions?.autoplay ){
                  swiper?.autoplay?.resume?.()
                }
              }}>
                <RatioArea className="group" ratio="56.25">
                  {
                    node?.link && <div className="pointer-events-none absolute left-0 top-0 z-10 flex size-full items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100"
                    style={{
                      background: 'rgba(0, 46, 79, 0.5)',
                      transition: 'all .4s'
                    }}>
                      <div className="flex size-[56px] items-center justify-center rounded-full bg-golden-700">
                        <i className="bi bi-plus-lg text-[24px] text-white"></i>
                      </div>
                    </div>
                  }

                  <LinkWithLang className="absolute left-0 top-0 z-0 size-full" href={node?.link || ''} lang={lang}>
                    <>
                      <Image className="absolute left-0 top-0 z-0 size-full object-cover"
                      fill={true}
                      src={node?.mediaItemUrl || ''}
                      sizes="52.25vw"
                      placeholder="blur"
                      // blurDataURL={node?.placeholder}
                      priority={true}
                      alt="" />

                      <div className="absolute left-0 top-0 z-10 size-full">{ node?.content }</div>
                    </>
                  </LinkWithLang>
                </RatioArea>
              </SwiperSlide>
            })
          }
        </Swiper>

        <div className="my-4 flex !flex-nowrap items-center"
        ref={setPaginationNode}
        style={{
          width: `${centerSize.width + centerRight}px`
        }}>
          <div className="row lg:row-gap-6 row-gap-2 flex-nowrap">
            <div className="col-auto">
              <div className="serif mt-1 text-[13px] leading-none text-gray-300  lg:mt-1.5 lg:text-[16px]">{props?.listTitle} /</div>
            </div>
            <div className="col-12 shrink">
              <div className="row lg:row-gap-6 row-gap-3">
                {
                  props?.list?.map?.((node, index)=>{
                    return <div className="col-auto mb-2" key={index}>
                      <div className={`serif btn text-[21px] leading-none lg:text-[28px] ${realIndex === index ?'text-minor-900' :'text-gray-300'}`}
                      onClick={()=>{
                        swiper.slideTo(index)
                      }}
                      onTouchStart={()=>{
                        if( props?.swiperOptions?.autoplay ){
                          swiper?.autoplay?.pause?.()
                        }
                      }}
                      onTouchEnd={()=>{
                        if( props?.swiperOptions?.autoplay ){
                          swiper?.autoplay?.resume?.()
                        }
                      }}
                      onMouseEnter={()=>{
                        if( props?.swiperOptions?.autoplay ){
                          swiper?.autoplay?.pause?.()
                        }
                      }}
                      onMouseLeave={()=>{
                        if( props?.swiperOptions?.autoplay ){
                          swiper?.autoplay?.resume?.()
                        }
                      }}>{node?.label}</div>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Suspense>
}

export default SwiperOverflow