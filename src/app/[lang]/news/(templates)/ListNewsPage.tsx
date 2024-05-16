"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const postsPerPage = 6

import { Suspense, useMemo, useEffect, useContext, useRef, useState, useCallback } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty, arrayGenerate } from '~/lib/helpers'
import { useSearchObject } from 'vanns-common-modules/dist/use/next'
import { useLazyQuery } from "@apollo/client"
import { QueryNews } from '~/queries/categories/news.gql'
import PageNav from '~/components/custom/PageNav'
import Loading from '~/components/custom/icons/Loading'
import NewsListItem from "./ListItem"
import { ICommonData, useCommonData } from "~/app/[lang]/providers"
import { formatCategories } from "./ListItem"

export interface TypePostNode {
  slug: string
  title: string
  date: string
  categories?: {
    nodes?: {
      slug: string
      name: string
      parentId?: string | number
    }[]
  }
  filteredCategories?: {
    name: string
    slug: string
    href: string
  }[]
  postCustomFields: {
    gallery?: {
      image?: {
        node?: {
          mediaItemUrl: string
        }
      }
    }[]
  }
}

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

function List(props:TypeProps, ref:React.ReactNode){
  const { searchObject, updateSearch } = useSearchObject()
  const { className, lang } = props
  const [isFilterChanged, setIsFilterChanged] = useState(false)
  const [mergedList, setMergedList] = useState<TypePostNode[] | null>(props.list)

  const[getData, { data, loading }] = useLazyQuery(QueryNews, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setMergedList((prev)=>{
        return [
          ...(prev === null ?[] :prev),
          ...data?.posts?.nodes
        ]?.map((node:TypePostNode)=>{
          return {
            ...node,
            filteredCategories: formatCategories(node?.categories?.nodes)
          }
        })
      })
    },
  })

  const commonData = useCommonData()
  const { yachtSeriesList } = commonData ?? {}

  const pageInfo = useMemo(()=>{
    return data?.posts?.pageInfo || props?.pageInfo
  }, [data?.posts?.pageInfo, props.pageInfo])

  const allowedCategories = useMemo<{slug:string, name:string}[] | undefined>(()=>{
    return props?.categories?.nodes?.filter((node:{slug:string, name:string})=>{
      return !(['uncategorized', 'cover-story', 'events'].includes(node?.slug)) && !(node?.slug).includes('uncategorized')
    })
  }, [props?.categories])

  const queryVariables = useMemo(()=>{
    return {
      first: postsPerPage,
      relatedYachtSeries: searchObject.series || null,
      year: searchObject.year ?Number(searchObject.year) :null,
      ...(
        searchObject.category
          ? {
            categories: [searchObject.category],
            categoriesOperator: 'IN'
          }:{
            categories: [],
            categoriesOperator: 'NOT_IN'
          }
      )
    }
  }, [searchObject.series, searchObject.year, searchObject.category])

  useEffect(()=>{
    // 非手動調整 filter 的話不動作
    if( !isFilterChanged ){
      return
    }

    // 手動調整 filter 的話，需先重置 mergedList，因為 mergedList 只有在 按下 more 的時候，才需要被累加
    setMergedList(null)
    getData({
      variables: queryVariables
    })
  },[getData, searchObject.series, searchObject.year, searchObject.category, isFilterChanged])

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>

      <div className="container mb-6">
        <div className="row items-center lg:flex-nowrap">
          <div className="col-auto">
            <div className="text-[24px] font-300 text-minor-900">Latest News</div>
          </div>
          <div className="col-12 mt-2 shrink lg:mt-0">
            <div className="row !flex-nowrap justify-end">
              <div className="col-4 shrink lg:col-auto">
                <div className="w-full lg:w-screen lg:max-w-[130px]">
                  <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                  value={String(searchObject.category || '')}
                  onChange={(e)=>{
                    updateSearch({
                      category: e.target.value
                    })
                    setIsFilterChanged(true)
                  }}>
                    <option value="">All Categories</option>
                    {
                      allowedCategories?.map((node, index:number)=>{
                        return <option key={index} value={node.slug}>{node.name}</option>
                      })
                    }
                  </select>
                </div>
              </div>
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
                    <option value="">All Series</option>
                    {
                      yachtSeriesList?.nodes?.map((node:ICommonData['yachtSeriesList']['nodes'][number], index:number)=>{
                        return <option key={index} value={node.slug}>{node.name} Series</option>
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
                    setTimeout(() => {
                      setIsFilterChanged(true)

                    },100)
                  }}>
                    <option value="">All Years</option>
                    {
                      arrayGenerate(2018, new Date().getFullYear()).reverse()?.map((node:number, index:number)=>{
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

      <div className="container">
        <div className="row">
          {
            mergedList?.map((node:TypePostNode, index:number)=>{
              return <div className="lg:col-6 col-12 mb-10" key={index}>
                <NewsListItem
                href={`/news/${node?.filteredCategories?.[0]?.slug}/${node.slug}`}
                title={node?.title}
                date={node?.date}
                thumbnail={node?.postCustomFields?.gallery?.[0]?.image?.node?.mediaItemUrl || ''}
                categories={node?.filteredCategories} />
              </div>
            })
          }
        </div>
      </div>

      {
        loading
          ?<Loading style={{width:'44px'}} fill="var(--color-golden-900)"/>
          :<PageNav
          pageInfo={pageInfo}
          moreMode
          moreText="More News"
          onNextClick={()=>{
            getData({
              variables: {
                ...queryVariables,
                after: pageInfo?.endCursor,
                first: postsPerPage,
              }
            })
          }} />
      }

    </div>
  </Suspense>
}

export default List