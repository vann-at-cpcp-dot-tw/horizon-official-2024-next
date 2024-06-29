"use client"

const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useContext, useState, useRef, useMemo, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'
import { TypePublicationNode, TypePublicationCategoryNode } from "../layout"
import { LocalDataContext } from "../(templates)/LocalDataProvider"
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperClass } from "swiper/react"
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
// import useImageBlurHashes from '~/use/useImageBlurHashes"
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'
import { useParams } from "next/navigation"
import RatioArea from "vanns-common-modules/dist/components/react/RatioArea"
interface TypeProps {
  [key:string]: any
}

interface TypeState {}


function All(props:TypeProps, ref:React.ReactNode){

  const { className } = props
  const params = useParams()
  const { lang } = params
  const localData = useContext(LocalDataContext)
  const { publicationCategories } = localData ?? {}
  const swiperRefs = useRef<SwiperClass[]>([])
  const [swiperProgress, setSwiperProgress] = useState<{[key:string]:number}>({})
  const viewport = useWindowSize()

  const [placeholderGroups, setPlaceholderGroups] = useState<[string][]>([])
  const coverImageGroups = useMemo(()=>{
    return publicationCategories?.nodes?.map?.((categoryNode:any)=>{
      return categoryNode?.publications?.nodes?.map?.((publicationNode:any)=>{
        return publicationNode?.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl || ''
      })
    }) || []
  }, [publicationCategories])

  useEffect(()=>{

    const genImageBlurHashes = async ()=>{
      const resources = await Promise.all(
        coverImageGroups.map(async (group:string[])=>{
          if( !Array.isArray(group) ){
            return []
          }

          return await Promise.all(
            group.map(async (imgUrl)=>{
              if( typeof imgUrl !== 'string'){ return '' }
              return await genImageBlurHash(imgUrl)
            })
          )
        })
      )
      setPlaceholderGroups(resources)
    }

    genImageBlurHashes()

  }, [coverImageGroups])


  return <Suspense fallback={null}>

    <div className={twMerge('overflow-hidden', className)}>

      {
        publicationCategories?.nodes?.map?.((categoryNode:TypePublicationCategoryNode, categoryIndex:number)=>{
          return <div className="container-fluid mb-12 px-5 lg:mb-24 lg:px-20" key={categoryIndex}>
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
                  <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#D0D0D0]"></div>
                  <div className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-golden-900"
                  style={{
                    width: `${swiperProgress[categoryIndex]}%`,
                    transition: 'all 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                  }}></div>
                </div>
              </div>
            </div>
            <Swiper
            className="swiper-publication-all !overflow-visible"
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

                  return <SwiperSlide key={`${categoryIndex}-${publicationIndex}`}
                  style={{
                    width: viewport.width && viewport.width >= 992 ?'calc(25vw - 80px)' :'calc(50vw - 80px)'
                  }}>
                    <a className="btn group relative block" href={publicationNode.publicationCustomFields?.publication?.pdf?.node?.mediaItemUrl} target="_blank">
                      <div className="relative">
                        <div className="pointer-events-none absolute left-0 top-0 z-10 flex size-full items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100"
                        style={{
                          background: 'rgba(0, 46, 79, 0.5)',
                          transition: 'all .4s'
                        }}>
                          <div className="flex size-[56px] items-center justify-center rounded-full bg-golden-700">
                            <i className="bi bi-plus-lg text-[24px] text-white"></i>
                          </div>
                        </div>
                        {

                          publicationNode?.publicationCustomFields?.publication?.publicationCover?.node?.mediaDetails?.width && <div className="mb-2">
                            <RatioArea ratio={(publicationNode.publicationCustomFields.publication.publicationCover.node.mediaDetails?.height / publicationNode.publicationCustomFields.publication.publicationCover.node.mediaDetails.width * 100) as number}>
                              <Image className="absolute size-full"
                              src={`${publicationNode.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl || ''}`}
                              alt=""
                              fill
                              sizes={viewport.width && viewport.width >= 992 ?'25vw' :'50vw'}
                              style={{
                                objectFit: 'cover',
                              }}
                              placeholder={placeholderGroups?.[categoryIndex]?.[publicationIndex] ?'blur' :'empty'}
                              blurDataURL={placeholderGroups?.[categoryIndex]?.[publicationIndex]}
                              priority={true} />
                            </RatioArea>
                          </div>
                        }
                      </div>

                      <div className="relative h-8 text-gray-500">
                        <div className="absolute line-clamp-2 w-full">{ publicationNode.title }</div>
                      </div>
                    </a>
                  </SwiperSlide>
                })
              }
              {
                categoryNode?.publications?.nodes?.length >= 6 && <SwiperSlide className="!w-auto">
                  <LinkWithLang className="btn group relative block" href={`/publications/${categoryNode.slug}`} lang={lang}>
                    <div className="relative">
                      <div className="absolute flex size-full items-center justify-center bg-gray-300 text-white">READ MORE</div>
                      <div className="pointer-events-none absolute left-0 top-0 z-10 flex size-full items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100"
                        style={{
                          background: 'rgba(0, 46, 79, 0.5)',
                          transition: 'all .4s'
                        }}>
                        <div className="flex size-[56px] items-center justify-center rounded-full bg-golden-700 text-white">
                          <i className="bi bi-plus-lg text-[24px] text-white"></i>
                        </div>
                      </div>
                      <Image className="opacity-0"
                      src={`${categoryNode?.publications?.nodes?.[5]?.publicationCustomFields?.publication?.publicationCover?.node?.mediaItemUrl || ''}`}
                      style={{
                        width: viewport.width && viewport.width>=992 ?'auto' :'66vw',
                        height: viewport.width && viewport.width>=992 ?`${categoryIndex === 0 ?525 :320}px` :'auto',
                      }}
                      width={380}
                      height={categoryIndex === 0 ?525 :320}
                      placeholder={placeholderGroups?.[categoryIndex]?.[0] ?'blur' :'empty'}
                      blurDataURL={placeholderGroups?.[categoryIndex]?.[0]}
                      priority={true}
                      alt="" />
                    </div>
                  </LinkWithLang>
                </SwiperSlide>
              }
            </Swiper>
          </div>
        })
      }
    </div>
  </Suspense>
}

export default All