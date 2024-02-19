"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
import Image from "next/image"
import { Suspense, useMemo, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import RatioArea from "@src/components/custom/RatioArea"
import useDomNodeSize from "@src/hooks/useDomNodeSize"
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { useWindowSize } from "react-use"

interface TypeProps {
  listTitle: string
  list?: {
    slug: string
    label: string
    link?: string
    mediaItemUrl?: string
    placeholder?: string
    srcSet?: string
  }[]
  onSlideChange?: Function
}

interface TypeState {}

function SwiperOverflow(props:TypeProps, ref:React.ReactNode){
  const params = useParams()
  const { lang } = params
  const viewport = useWindowSize()
  const [bodyWidth, setBodyWidth] = useState(0)
  const [swiper, setSwiper] = useState<SwiperClass>(({} as SwiperClass))
  const [realIndex, setRealIndex] = useState(0)
  const { size:centerSize, setNode:setCenterNode } = useDomNodeSize()

  const centerRight = useMemo(()=>{
    return (bodyWidth - centerSize.width) / 2
  }, [bodyWidth])

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
        <Swiper className="!overflow-visible"
        // loop
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
              return <SwiperSlide key={index}>
                <RatioArea className="group" ratio="56.25">
                  {
                    node?.link && <div className="pointer-events-none absolute left-0 top-0 z-10 flex size-full items-center justify-center opacity-0 group-hover:opacity-100"
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
                    {
                      <Image className="absolute left-0 top-0 z-0 size-full object-cover"
                      fill={true}
                      src={node?.mediaItemUrl || ''}
                      sizes="52.25vw"
                      placeholder={node?.placeholder ?'blur' :'empty'}
                      blurDataURL={node?.placeholder}
                      priority={true}
                      alt="" />
                    }
                  </LinkWithLang>
                </RatioArea>
              </SwiperSlide>
            })
          }
        </Swiper>

        <div className="my-4 flex !flex-nowrap items-center"
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