"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useState, useMemo, useEffect } from 'react'

import Image from "next/image"
import { EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useImageBlurHashes } from 'vanns-common-modules/dist/use/next'
import { useDomNodeSize } from 'vanns-common-modules/dist/use/react'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'

import ContentLightbox from '~/components/custom/ContentLightbox'
import SwiperFullHeight from '~/components/custom/SwiperFullHeight'

interface TypeProps {
  list: {
    image?: {
      node?: {
        mediaItemUrl: string
      }
    }
  }[]
  [key:string]: any
}
interface TypeState {}

function YachtsExteriorSwiper(props:TypeProps, ref:React.ReactNode){
  const viewport = useWindowSize()
  const { className } = props
  const {size:slideFrameSize, setNode:setSlideFrameNode} = useDomNodeSize()
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

  const images = useMemo(()=>{
    return props?.list?.map((node)=>node?.image?.node?.mediaItemUrl)
  }, [props.list])
  const imageBlurHashes = useImageBlurHashes(images)

  return <Suspense fallback={null}>

    <div id="SECTION_EXTERIOR" className={twMerge('relative overflow-hidden lg:mb-14 mb-7', className)}>

      <div className="container" style={{maxWidth:'1080px'}}>

        <div className="swiper-yacht-exterior mb-5"
          style={{
            minHeight: `${slideFrameSize.height}px`
          }}>
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 lg:pointer-events-auto"
            ref={setSlideFrameNode}
            style={{
              width: viewport.width && viewport.width >= 992 ?`calc(76.35vw - 40px)` :`calc(100vw - 40px - 16px)`
            }}>
            <RatioArea ratio="56.25">
              <div className="absolute left-0 top-0 hidden size-full items-center justify-between lg:flex">
                {
                  swiper?.isLocked === false && <>
                    <div className={`btn ${swiper.isBeginning ?'disabled opacity-50' :''}`}
                    onClick={()=>{
                      swiper.slidePrev()
                    }}>
                      <i className="bi bi-chevron-compact-left text-[64px] text-white"></i>
                    </div>
                    <div className={`btn ${swiper.isEnd ?'disabled opacity-50' :''}`}
                    onClick={()=>{
                      swiper.slideNext()
                    }}>
                      <i className="bi bi-chevron-compact-right text-[64px] text-white"></i>
                    </div>
                  </>
                }
              </div>
            </RatioArea>
          </div>

          <Swiper
            className="!overflow-visible"
            speed={1000}
            spaceBetween={0}
            slidesPerView="auto"
            centeredSlides={true}
            onSwiper={(e)=>{
              setSwiper(e)
            }}
            onSlideChange={(e)=>{
              setRealIndex(e.realIndex)
            }}>
            {
              props?.list?.map?.((node, index)=>{
                return <SwiperSlide key={index}>
                  <div className="slide-inner"
                    onClick={()=>{
                      viewport.width && viewport.width <= 991 ?setIsOpen(true) :null
                    }}>
                    <RatioArea ratio="56.25">
                      <Image className="absolute left-0 top-0 z-0 size-full object-cover"
                        priority={true}
                        src={node?.image?.node?.mediaItemUrl || ''}
                        placeholder={imageBlurHashes?.[index] ?'blur' :'empty'}
                        blurDataURL={imageBlurHashes?.[index]}
                        fill={true}
                        sizes="76.35vw"
                        alt="" />
                    </RatioArea>
                  </div>
                </SwiperSlide>
              })
            }
          </Swiper>
        </div>

        {
          swiper?.isLocked === false && <div className="container-fluid overflow-hidden">
            <div className="row row-gap-2 flex-nowrap justify-center">
              {
                props?.list?.map((node, index)=>{
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


      {
        isOpen && <ContentLightbox
        onClose={()=>{
          setIsOpen(false)
        }}>
          <SwiperFullHeight
          list={
            props?.list?.map((node, index)=>({
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
            }))
          } />
        </ContentLightbox>
      }
    </div>
  </Suspense>
}

export default YachtsExteriorSwiper