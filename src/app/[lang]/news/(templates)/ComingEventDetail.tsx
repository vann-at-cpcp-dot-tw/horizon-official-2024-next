"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useState, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { gql, useQuery } from "@apollo/client"
import RatioArea from "@src/components/custom/RatioArea"
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"
import HullDetail from "@src/app/[lang]/models/[seriesSlug]/[yachtSlug]/(templates)/HullDetail"
import ContentLightbox from "@src/components/custom/ContentLightbox"

// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeHullNode {
  // exteriorImages?: {
  //   image?: {
  //     node?: {
  //       mediaItemUrl: string
  //     }
  //   }
  // }[]
  [key:string]: any
}

interface TypeYachtNode {
  translation: {
    title: string
    yachtCustomFields: {
      hulls?: TypeHullNode[]
    }
  }
}

interface TypeProps {
  title: string
  subtitle: string
  scheduleDate: string
  content: string
  contactTitle: string
  contactNumber: string
  contactEmail: string
  showInfoTable?: {
    dateAndTimeRows?: {
      dateAndTimes: string
    }[]
    dockNumber: string
  }
  relatedHulls?: {
    yachtSlug: string
    hullName: string
  }[]
  [key:string]: any
}

interface TypeState {}

function createHullGQLString(list:{yachtSlug:string, hullName:string}[] | undefined, lang:string){
  if( !list ){
    return null
  }

  return list.reduce((acc:string, node:{yachtSlug:string, hullName:string}, index:number)=>{

    if( !node.yachtSlug ){ return acc }

    return `
      ${acc}
      yacht${index}:yacht(id:"${node?.yachtSlug}", idType: SLUG){
        translation(language: ${(lang || 'EN').toUpperCase()}){
          title
          yachtCustomFields {
            hulls {
              hullName
              vrEmbedUrl
              exteriorImages {
                image {
                  node {
                    mediaItemUrl
                  }
                }
              }
              interiorImages {
                image {
                  node {
                    mediaItemUrl
                  }
                }
                description
              }
              generalArrangementImages {
                title
                image {
                  node {
                    mediaItemUrl
                  }
                }
                imageM {
                  node {
                    mediaItemUrl
                  }
                }
              }
              embedVideosGallery {
                embedUrl
              }
              specTerms {
                loa {
                  metric
                  imperial
                }
                lwl {
                  metric
                  imperial
                }
                beam {
                  metric
                  imperial
                }
                draft {
                  metric
                  imperial
                }
                engines {
                  metric
                  imperial
                }
                generator {
                  metric
                  imperial
                }
                displacement {
                  metric
                  imperial
                }
                fuelCapacity {
                  metric
                  imperial
                }
                waterCapacity {
                  metric
                  imperial
                }
                recommendedCapacity {
                  metric
                  imperial
                }
                cabins {
                  metric
                  imperial
                }
              }
            }
          }
        }
      }
    `
  }, '')
}

function ComingEventDetail(props:TypeProps, ref:React.ReactNode){
  const router = useRouter()
  const { className } = props
  const pathname = usePathname()
  const params = useParams()
  const { lang } = params
  const [openHullIndex, setOpenHullIndex] = useState<number | null>(null)

  const hullGQLString = useMemo(()=>{
    return createHullGQLString(props?.relatedHulls, (lang as string))
  }, [props?.relatedHulls, lang])

  const { data:hullData } = useQuery<{[key:string]:TypeYachtNode}>(gql `query QueryHulls {
    ${hullGQLString}
  }`, {
    skip: !hullGQLString
  })

  const hullList = useMemo(()=>{
    if( !props?.relatedHulls || !hullData){
      return []
    }

    const reduced =  Object.values(hullData).reduce<{yachtName:string, hull:TypeHullNode}[]>((acc, yachtNode:TypeYachtNode, index:number)=>{
      const findHullName = props?.relatedHulls?.[index]?.hullName
      const foundedHull = yachtNode?.translation?.yachtCustomFields?.hulls?.find?.((hullNode)=>hullNode?.hullName === findHullName)

      if( !findHullName || !foundedHull ){
        return acc
      }

      return [
        ...acc,
        {
          yachtName: yachtNode?.translation?.title,
          hull: foundedHull
        }
      ]
    }, [])

    return reduced

  }, [hullData, props?.relatedHulls])

  const openHullData = useMemo(()=>{
    if( openHullIndex === null ){
      return null
    }
    return hullList?.[openHullIndex]
  }, [openHullIndex, hullList])


  useEffect(()=>{
    document.body.classList.add('lb-open')
    return ()=>{
      document.body.classList.remove('lb-open')
    }
  }, [])

  return <>
    <ContentLightbox
    onClose={()=>{
      router.push(`${pathname}`, {scroll:false})
    }}>

      <div className="container mb-10 text-center">
        <div className="mb-4 text-gray-500">Coming Event</div>
        <div className="serif mb-2 text-[32px] leading-[1.2] text-major-900 lg:text-[40px]">{props.title}</div>
        <div className="mb-3 text-[14px] text-gray-900">{props.subtitle}</div>
        <div className="text-[14px] text-gray-500">{props.scheduleDate}</div>
      </div>

      <div className="MCE-CONTENT mb-8 lg:mb-16">
        <div className="container">
          <div className="mx-auto w-full max-w-[900px]" dangerouslySetInnerHTML={{__html:props?.content}}></div>
        </div>
      </div>

      {
        !isEmpty(hullList) && <>
          <div className="container serif mb-3 text-center text-[32px] italic text-major-900 lg:mb-6 lg:text-[40px]">ON DISPLAY</div>
          <div className="container-fluid mb-6 lg:mb-20">
            <div className="row justify-center">
              {
                hullList.map((node, index)=>{
                  return <div className="lg:col-6 col-12 mb-10" key={index}>
                    <RatioArea className="mb-3" ratio="56.25">
                      <Image className="absolute left-0 top-0 size-full object-cover" fill={true} src={node.hull?.exteriorImages?.[0]?.image?.node?.mediaItemUrl || ''} sizes="50vw" alt="" />
                    </RatioArea>
                    <div className="serif mb-2 text-center text-[21px] text-minor-900 lg:mb-4 lg:text-[24px]">{node.yachtName} <span className="text-[22px]">/</span> {node.hull?.hullName}</div>
                    <div className="flex justify-center">
                      <Button variant="outline" className={`${buttonStyles['rounded-outline']}`}
                        onClick={()=>{
                          setOpenHullIndex(index)
                        }}>
                          MORE DETAIL
                      </Button>
                    </div>
                  </div>
                })
              }
            </div>
          </div>
        </>
      }

      <div className="container serif mb-10 text-center">
        <div className="mb-5 text-[32px] italic leading-[1.18] text-minor-900 lg:text-[40px]">{ props?.contactTitle }</div>
        <div className="text-[21px] text-gray-900 lg:text-[24px]">
          <a href={`tel:${props.contactNumber?.replace?.(' ', '')?.replace?.('-', '')}`}>{ props.contactNumber }</a>
        </div>
        <div className="text-[24px] text-gray-900">
          <a href={`mailto:${props.contactEmail}`}>{props.contactEmail}</a>
        </div>
      </div>

      <div className="container">
        <div className="relative mx-auto w-full max-w-[900px]">
          <div className="serif text-[21px] italic text-major-900 lg:text-[24px]">Show Info</div>
          {
            props?.showInfoTable?.dateAndTimeRows?.map((node, index:number)=>{
              return <div className="border-b border-gray-500 py-3 text-gray-700" key={index}>
                <div className="row lg:flex-nowrap">
                  <div className="col-12 lg:col-auto">
                    <div className="serif w-full lg:w-[190px]">{index === 0 ?'Date and Times' :''}</div>
                  </div>
                  <div className="col-12 shrink text-[15px]">{ node?.dateAndTimes }</div>
                </div>
              </div>
            })
          }
          {
            props?.showInfoTable?.dockNumber && <div className="border-b border-gray-500 py-3 text-gray-700">
              <div className="row lg:flex-nowrap">
                <div className="col-12 lg:col-auto">
                  <div className="serif w-full lg:w-[190px]">Dock no.</div>
                </div>
                <div className="col-12 shrink text-[15px]">{ props?.showInfoTable?.dockNumber }</div>
              </div>
            </div>
          }
        </div>
      </div>

      <div className="flex justify-center py-20">
        <div className="btn border-b-[3px] border-b-gray-500 pb-0.5 text-[15px] text-gray-500"
      onClick={(e)=>{
        e.stopPropagation()
        router.push(`${pathname}`, {scroll:false})
      }}>Close</div>
      </div>
    </ContentLightbox>

    {
      openHullData && <HullDetail className="fixed z-[99999]"
      hullName={openHullData.hull?.hullName}
      vrEmbedUrl={openHullData.hull?.vrEmbedUrl}
      exteriorImages={openHullData.hull?.exteriorImages}
      interiorImages={openHullData.hull?.interiorImages}
      specTerms={openHullData.hull?.specTerms}
      generalArrangementImages={openHullData.hull?.generalArrangementImages}
      embedVideosGallery={openHullData.hull?.embedVideosGallery}
      yachtName={openHullData?.yachtName}
      isComponent
      onClose={()=>{
        setOpenHullIndex(null)
      }}
      onUnMounted={()=>{
        document.body.classList.add('lb-open')
      }} />
    }
  </>
}

export default ComingEventDetail