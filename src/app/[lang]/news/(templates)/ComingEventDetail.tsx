"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import { Suspense, useMemo, useState, useEffect } from 'react'

import { gql, useQuery } from "@apollo/client"
import Image from "next/image"
import { usePathname, useRouter, useParams } from 'next/navigation'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import HullDetail from '~/app/[lang]/models/[seriesSlug]/[yachtSlug]/(templates)/HullDetail'
import ContentLightbox from '~/components/custom/ContentLightbox'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { Button } from '~/components/ui/button'
import buttonStyles from '~/components/ui/button.module.sass'
import { isEmpty } from '~/lib/utils'
import { QuerySingleHull } from '~/queries/categories/hull.gql'

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
    slug: string
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
        translation(language: ${lang.toUpperCase()}){
          slug
          title
          yachtCustomFields {
            hulls {
              hullName
              exteriorImages {
                image {
                  node {
                    mediaItemUrl
                  }
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
  const { __ } = useTranslate()
  const { className } = props
  const pathname = usePathname()
  const params = useParams()
  const { lang } = params
  const [openHull, setOpenHull] = useState<{yachtSlug:string | null, yachtName:string|null, hullName:string|null} | null>(null)
  const hullGQLString = useMemo(()=>{
    return createHullGQLString(props?.relatedHulls, 'EN') // 20250426 新增需求：Hull 只接英文版
  }, [props?.relatedHulls, lang])

  const { data:hullListData } = useQuery<{[key:string]:TypeYachtNode}>(gql `query QueryHulls {
    ${hullGQLString}
  }`, {
    skip: !hullGQLString,
    context: {
      uri: HQ_API_URL,
    },
  })

  const { data:openHullData, error:openHullError, loading:openHullLoading } = useQuery(QuerySingleHull, {
    skip: !openHull?.yachtSlug || !openHull?.hullName,
    context: {
      uri: HQ_API_URL,
    },
    variables: {
      yachtSlug: openHull?.yachtSlug,
      hullName: openHull?.hullName
    }
  })

  const hullList = useMemo(()=>{
    if( !props?.relatedHulls || !hullListData){
      return []
    }

    const reduced = Object.values(hullListData).reduce<{yachtName:string, yachtSlug:string, hull:TypeHullNode}[]>((acc, yachtNode:TypeYachtNode, index:number)=>{
      const findHullName = props?.relatedHulls?.[index]?.hullName
      const foundedHull = yachtNode?.translation?.yachtCustomFields?.hulls?.find?.((hullNode)=>hullNode?.hullName === findHullName)

      if( !findHullName || !foundedHull ){
        return acc
      }

      return [
        ...acc,
        {
          yachtSlug: yachtNode?.translation?.slug,
          yachtName: yachtNode?.translation?.title,
          hull: foundedHull
        }
      ]
    }, [])

    return reduced

  }, [hullListData, props?.relatedHulls])

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
        <div className="mb-4 text-gray-500">{ __('Coming Event') }</div>
        <div className="serif mb-2 text-[32px] leading-[1.2] text-major-900 lg:text-[40px]">{props.title}</div>
        <div className="mb-3 text-[14px] text-gray-900">{props.subtitle}</div>
        <div className="font-300 text-golden-700 lg:text-[20px]">{props.scheduleDate}</div>
      </div>

      <div className="MCE-CONTENT mb-8 lg:mb-16">
        <div className="container">
          <pre className="mx-auto w-full max-w-[900px]" dangerouslySetInnerHTML={{__html:props?.content}}></pre>
        </div>
      </div>

      {
        !isEmpty(hullList) && <>
          <div className="container serif mb-3 text-center text-[32px] italic text-major-900 lg:mb-6 lg:text-[40px]">
            { __('ON DISPLAY') }
          </div>
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
                          setOpenHull({
                            yachtSlug: node.yachtSlug,
                            yachtName: node.yachtName,
                            hullName: node.hull?.hullName,
                          })
                        }}>
                        { __('MORE DETAIL') }
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
          <div className="serif text-[21px] italic text-major-900 lg:text-[24px]">{ __('Show Info') }</div>
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
                  <div className="serif w-full lg:w-[190px]">{ __('Dock no.') }</div>
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
      }}>{ __('Close') }</div>
      </div>
    </ContentLightbox>

    {
      openHull?.hullName && <HullDetail className="fixed z-[99999]"
      hullName={openHull?.hullName}
      yachtName={openHull?.yachtName}
      {...(openHullData?.hull || {})}
      asComponent
      onClose={()=>{
        setOpenHull(null)
      }}
      onUnMounted={()=>{
        document.body.classList.add('lb-open')
      }} />
    }
  </>
}

export default ComingEventDetail