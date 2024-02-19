"use client"
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useState, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { motion } from "framer-motion"
import { usePathname, useRouter } from 'next/navigation'
import { gql, useQuery } from "@apollo/client"
import RatioArea from "@src/components/custom/RatioArea"
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"
import HullDetail from "@src/app/[lang]/models/[seriesSlug]/[yachtSlug]/(templates)/HullDetail"

// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

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
  title: string
  yachtCustomFields: {
    hulls?: TypeHullNode[]
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

function createHullGQLString(list:{yachtSlug:string, hullName:string}[] | undefined){
  if( !list ){
    return null
  }

  return list.reduce((acc:string, node:{yachtSlug:string, hullName:string}, index:number)=>{

    if( !node.yachtSlug ){ return acc }

    return `
      ${acc}
      yacht${index}:yacht(id:"${node?.yachtSlug}", idType: SLUG){
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
    `
  }, '')
}

function ComingEventDetail(props:TypeProps, ref:React.ReactNode){
  const router = useRouter()
  const { className } = props
  const pathname = usePathname()
  const [openHullIndex, setOpenHullIndex] = useState<number | null>(null)

  const hullGQLString = useMemo(()=>{
    return createHullGQLString(props?.relatedHulls)
  }, [props?.relatedHulls])

  const { data:hullData } = useQuery<{[key:string]:TypeYachtNode}>(gql `query QueryHulls {
    ${hullGQLString}
  }`, {
    skip: !hullGQLString
  })

  const hullList = useMemo(()=>{
    if( !hullData || !props?.relatedHulls){
      return []
    }

    const reduced =  Object.values(hullData).reduce<{yachtName:string, hull:TypeHullNode}[]>((acc, yachtNode:TypeYachtNode, index:number)=>{
      const findHullName = props?.relatedHulls?.[index]?.hullName
      const foundedHull = yachtNode?.yachtCustomFields?.hulls?.find?.((hullNode)=>hullNode?.hullName === findHullName)

      if( !findHullName || !foundedHull ){
        return acc
      }

      return [
        ...acc,
        {
          yachtName: yachtNode?.title,
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

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <motion.div className="fixed left-0 top-0 z-[99999] size-full bg-golden-300"
      variants={{
        enter: {
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: [0.215, 0.610, 0.355, 1.000]
          }
        },
        exit: {
          opacity: 0,
          transition: {
            duration: 1,
            ease: [0.215, 0.610, 0.355, 1.000]
          }
        },
      }}
      initial="exit"
      animate="enter">

        <div className="absolute left-0 top-0 size-full overflow-auto bg-golden-300 pb-10">

          <div className="container-fluid sticky left-0 top-0 mb-4 pt-2">
            <div className="flex">
              <div className="btn -ml-4 -mt-1 bg-golden-300"
            onClick={(e)=>{
              e.stopPropagation()
              router.push(`${pathname}`, {scroll:false})
            }}>
                <Image src={`${BASE_PATH}/assets/img/icon_menu_x.svg`} width={48} height={48} alt=""/>
              </div>
            </div>
          </div>

          <div className="container mb-10 text-center">
            <div className="text-gray-500">Coming Event</div>
            <div className="serif text-[40px] text-major-900">{props.title}</div>
            <div className="mb-3 text-[14px] text-gray-900">{props.subtitle}</div>
            <div className="text-[14px] text-gray-500">{props.scheduleDate}</div>
          </div>

          <div className="MCE-CONTENT mb-10">
            <div className="container">
              <div className="mx-auto w-full max-w-[900px]" dangerouslySetInnerHTML={{__html:props?.content}}></div>
            </div>
          </div>

          {
            !isEmpty(hullList) && <div className="mb-[96px]">
              <div className="container serif mb-6 text-center text-[40px] italic text-major-900">ON DISPLAY</div>
              <div className="container-fluid mb-[96px]">
                <div className="row justify-center">
                  {
                    hullList.map((node, index)=>{
                      return <div className="col-6 mb-5" key={index}>
                        <RatioArea className="mb-3" ratio="56.25">
                          <Image className="absolute left-0 top-0 size-full object-cover" fill={true} src={node.hull?.exteriorImages?.[0]?.image?.node?.mediaItemUrl || ''} sizes="50vw" alt="" />
                        </RatioArea>
                        <div className="serif mb-4 text-center text-[24px] text-minor-900">{node.yachtName} <span className="text-[22px]">/</span> {node.hull?.hullName}</div>
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
            </div>
          }

          <div className="container serif mb-10 text-center">
            <div className="mb-5 text-[40px] italic leading-[1.18] text-minor-900">{ props?.contactTitle }</div>
            <div className="text-[24px] text-gray-900">
              <a href={`tel:${props.contactNumber?.replace?.(' ', '')?.replace?.('-', '')}`}>{ props.contactNumber }</a>
            </div>
            <div className="text-[24px] text-gray-900">
              <a href={`mailto:${props.contactEmail}`}>{props.contactEmail}</a>
            </div>
          </div>


          <div className="container">
            <div className="relative mx-auto w-full max-w-[900px]">
              <div className="serif text-[24px] italic text-major-900">Show Info</div>
              {
                props?.showInfoTable?.dateAndTimeRows?.map((node, index:number)=>{
                  return <div className="border-b border-gray-500 py-3 text-gray-700" key={index}>
                    <div className="row flex-nowrap">
                      <div className="col-auto">
                        <div className="w-[190px]">{index === 0 ?'Date and Times' :''}</div>
                      </div>
                      <div className="col-12 shrink">{ node?.dateAndTimes }</div>
                    </div>
                  </div>
                })
              }
              {
                props?.showInfoTable?.dockNumber && <div className="border-b border-gray-500 py-3 text-gray-700">
                  <div className="row flex-nowrap">
                    <div className="col-auto">
                      <div className="w-[190px]">Dock no.</div>
                    </div>
                    <div className="col-12 shrink">{ props?.showInfoTable?.dockNumber }</div>
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
        </div>
      </motion.div>
    </div>

    {
      openHullData &&
      <HullDetail className="fixed z-[999999]"
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
      }}
      />
    }

  </Suspense>
}

export default ComingEventDetail