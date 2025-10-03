"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import { Suspense, useMemo, useState, useEffect } from 'react'

import { useApolloClient, useQuery, gql } from "@apollo/client"
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

// 輕量級查詢：只取 yacht title 和 hulls 的基本資訊（用於列表顯示）
const QUERY_YACHT_HULL = gql`
  query QueryYachtHull($yachtSlug: ID!, $language: LanguageCodeEnum!) {
    yacht(id: $yachtSlug, idType: SLUG) {
      translation(language: $language) {
        slug
        title
        yachtCustomFields {
          hulls {
            hullName
            exteriorImages {
              image {
                node {
                  mediaItemUrl
                  srcSet
                }
              }
            }
          }
        }
      }
    }
  }
`

interface TypeHullNode {
  [key:string]: any
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

function ComingEventDetail(props:TypeProps){
  const router = useRouter()
  const { __ } = useTranslate()
  const { className } = props
  const pathname = usePathname()
  const params = useParams()
  const { lang } = params
  const client = useApolloClient()
  const [openHull, setOpenHull] = useState<{yachtSlug:string | null, yachtName:string|null, hullName:string|null} | null>(null)
  const [hullListData, setHullListData] = useState<{yachtName:string, yachtSlug:string, hull:TypeHullNode}[]>([])
  const [hullListLoading, setHullListLoading] = useState(false)

  const { data:openHullData, error:openHullError, loading:openHullLoading } = useQuery(QuerySingleHull, {
    fetchPolicy: 'cache-and-network',
    skip: !openHull?.yachtSlug || !openHull?.hullName,
    context: {
      uri: HQ_API_URL,
    },
    variables: {
      yachtSlug: openHull?.yachtSlug,
      hullName: openHull?.hullName
    }
  })

  // 使用 useEffect 來並行查詢多個 hulls
  useEffect(() => {
    const fetchHulls = async () => {
      if (!props?.relatedHulls || props.relatedHulls.length === 0) {
        setHullListData([])
        return
      }

      setHullListLoading(true)

      try {
        // 取得唯一的 yacht slugs
        const uniqueYachtSlugs = Array.from(new Set(props.relatedHulls.map(item => item.yachtSlug).filter(Boolean)))

        // 並行查詢所有 yachts（每個 yacht 只查一次）
        const yachtQueries = uniqueYachtSlugs.map(yachtSlug =>
          client.query({
            query: QUERY_YACHT_HULL,
            variables: {
              yachtSlug,
              language: 'EN' // 20250426 新增需求：Hull 只接英文版
            },
            context: {
              uri: HQ_API_URL
            },
            fetchPolicy: 'cache-and-network' // 優先快取，同時檢查更新
          })
        )

        const yachtResults = await Promise.all(yachtQueries)

        // 建立 yacht 資料的 map
        const yachtMap = new Map()
        yachtResults.forEach(result => {
          const yacht = result.data?.yacht?.translation
          if (yacht) {
            yachtMap.set(yacht.slug, yacht)
          }
        })

        // 組合最終資料
        const finalResults = props.relatedHulls
          .filter(item => item.yachtSlug && item.hullName)
          .map(item => {
            const yacht = yachtMap.get(item.yachtSlug)
            if (!yacht) return null

            const hull = yacht.yachtCustomFields?.hulls?.find(
              (h: TypeHullNode) => h.hullName === item.hullName
            )
            if (!hull) return null

            return {
              yachtSlug: yacht.slug,
              yachtName: yacht.title,
              hull
            }
          })
          .filter(Boolean) as {yachtName:string, yachtSlug:string, hull:TypeHullNode}[]

        setHullListData(finalResults)
      } catch (error) {
        console.error('Failed to fetch hulls:', error)
        setHullListData([])
      } finally {
        setHullListLoading(false)
      }
    }

    fetchHulls()
  }, [props?.relatedHulls, client])

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
        props?.relatedHulls && props.relatedHulls.length > 0 && (
          <>
            <div className="container serif mb-3 text-center text-[32px] italic text-major-900 lg:mb-6 lg:text-[40px]">
              { __('ON DISPLAY') }
            </div>
            {hullListLoading ? (
              <div className="container-fluid mb-6 lg:mb-20">
                <div className="row justify-center">
                  {props.relatedHulls.map((_, index: number) => (
                    <div className="col-12 lg:col-6 mb-10" key={index}>
                      <div className="animate-pulse">
                        <div className="mb-3 h-64 rounded bg-gray-200"></div>
                        <div className="mx-auto mb-2 h-8 w-3/4 rounded bg-gray-200"></div>
                        <div className="flex justify-center">
                          <div className="h-10 w-32 rounded bg-gray-200"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : !isEmpty(hullListData) ? (
              <div className="container-fluid mb-6 lg:mb-20">
                <div className="row justify-center">
                  {
                    hullListData.map((node, index: number)=>{
                      return <div className="col-12 lg:col-6 mb-10" key={index}>
                        <RatioArea className="mb-3" ratio="56.25">
                          <img
                          className="absolute left-0 top-0 size-full object-cover"
                          src={node.hull?.exteriorImages?.[0]?.image?.node?.mediaItemUrl || ''}
                          srcSet={node.hull?.exteriorImages?.[0]?.image?.node?.srcSet || ''}
                          sizes="(max-width:991px) 100vw, 50vw" />
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
            ) : null}
          </>
        )
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