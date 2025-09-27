"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`
const postsPerPage = 10

import { Suspense, useMemo, useEffect, useState } from 'react'

import { useLazyQuery } from "@apollo/client"
import { useParams, useSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { useSearchObject,  } from 'vanns-common-modules/dist/use/next'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import { ICommonData, useCommonData } from "~/app/[lang]/providers"
import Loading from '~/components/custom/icons/Loading'
import LinkWithLang from '~/components/custom/LinkWithLang'
import PageNav from '~/components/custom/PageNav'
import { isEmpty, arrayGenerate } from '~/lib/utils'
import { QueryPostsByCategory } from '~/queries/pages/news-[categorySlug].gql'

import NewsListItem from "./ListItem"
import { TypePostNode } from "./ListNewsPage"

interface TypeProps {
  lang: string
  list: TypePostNode[]
  pageInfo: {
    endCursor: string
    hasNextPage: string
    hasPreviousPage: string
    startCursor: string
  }
  categories?:{
    nodes: {
      slug: string
      name: string
    }[]
  }
  [key:string]: any
}
interface TypeState {}

function ListWithCategory(props:TypeProps){
  const { searchObject, updateSearch } = useSearchObject()
  const { __ } = useTranslate()
  const [isFilterChanged, setIsFilterChanged] = useState(false)
  const params = useParams()
  const commonData = useCommonData()
  const { categorySlug } = params
  const { className, lang } = props
  const[getData, { data, loading }] = useLazyQuery(QueryPostsByCategory, {
    context: {
      uri: HQ_API_URL
    }
  })
  const { yachtSeriesList } = commonData ?? {}
  const listData = useMemo(()=>{
    let list = data?.category?.translation?.posts?.nodes || props?.list
    list = list?.map((node:{[key:string]:any})=>{
      return {
        ...node,
        filteredCategories: node?.categories?.nodes?.map((catNode:{[key:string]:any})=>{
          return {
            name: catNode?.name,
            href: `/news/${categorySlug}`
          }
        })
      }
    })
    return {
      list,
      pageInfo: data?.category?.translation?.posts?.pageInfo || props?.pageInfo,
    }
  }, [data, props?.list, props?.pageInfo, categorySlug])

  const highlightList = useMemo(()=>{
    return listData?.list?.slice(0, 4)
  }, [listData?.list])

  const gridList = useMemo(()=>{
    return listData?.list?.slice(4, listData?.list?.length || 999)
  }, [listData?.list])

  const queryVariables = useMemo(()=>{
    return {
      slug: categorySlug,
      first: postsPerPage,
      relatedYachtSeries: searchObject.series || null,
      year: searchObject.year ?Number(searchObject.year) :null,
    }
  }, [categorySlug, searchObject])

  useEffect(()=>{
    // 非手動調整 filter 的話不動作
    if( !isFilterChanged ){
      return
    }

    getData({
      variables: queryVariables
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ isFilterChanged, queryVariables ])

  if( loading ){
    return <div className="py-20">
      <Loading style={{width:'120px'}} fill="var(--color-golden-900)"/>
    </div>
  }


  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>

      <div className="container mb-6">
        <div className="row items-center lg:flex-nowrap">
          <div className="col-auto">
            <div className="text-[24px] font-300 text-minor-900">
              { __('Latest News') }
            </div>
          </div>
          <div className="col-12 mt-2 shrink lg:mt-0">
            <div className="row !flex-nowrap justify-end">
              <div className="col-4 shrink lg:col-auto">
                <div className="w-full lg:w-screen lg:max-w-[130px]">
                  <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                  value={String(searchObject.series || '')}
                  onChange={(e)=>{
                    updateSearch({
                      series: e.target.value
                    })
                    setIsFilterChanged(true)
                  }}>
                    <option value="">{ __('All Series') }</option>

                    {
                      yachtSeriesList?.nodes?.map((node:ICommonData['yachtSeriesList']['nodes'][number], index:number)=>{
                        return <option key={index} value={node.slug}>{node.name} { __('Series') }</option>
                      })
                    }
                  </select>
                </div>
              </div>
              <div className="col-4 shrink lg:col-auto">
                <div className="w-full lg:w-screen lg:max-w-[130px]">
                  <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                      value={String(searchObject.year || '')}
                      onChange={(e)=>{
                        updateSearch({
                          year: e.target.value
                        })
                        setIsFilterChanged(true)
                      }}>
                    <option value="">{ __('All Years') }</option>
                    {
                      arrayGenerate(2020, new Date().getFullYear()).reverse()?.map((node:number, index:number)=>{
                        return <option key={index} value={node}>{node}</option>
                      })
                    }
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-8">
        <div className="row">
          {
            highlightList?.map((node:TypePostNode, index:number)=>{
              return <div className={`mb-10 ${categorySlug === 'events' ?'lg:col-4 col-12' :'lg:col-6 col-12'}`} key={index}>
                <NewsListItem
                href={`/news/${categorySlug}/${node.slug}`}
                title={node?.title}
                date={node?.date}
                thumbnail={node?.postCustomFields?.gallery?.[0]?.image?.node}
                categories={node?.filteredCategories} />
              </div>
            })
          }
          {
            gridList?.map((node:TypePostNode, index:number)=>{
              return <div className="lg:col-4 col-6 mb-10" key={index}>
                <NewsListItem
                href={`/news/${categorySlug}/${node.slug}`}
                title={node?.title}
                date={node?.date}
                thumbnail={node?.postCustomFields?.gallery?.[0]?.image?.node}
                categories={node?.filteredCategories} />
              </div>
            })
          }
        </div>
      </div>

      <PageNav
      pageInfo={listData.pageInfo}
      onPrevClick={()=>{
        getData({
          variables: {
            ...queryVariables,
            before: listData.pageInfo?.startCursor,
            last: postsPerPage,
          }
        })

      }}
      onNextClick={()=>{
        getData({
          variables: {
            ...queryVariables,
            after: listData.pageInfo?.endCursor,
            first: postsPerPage,
          }
        })
      }} />
    </div>
  </Suspense>
}

export default ListWithCategory