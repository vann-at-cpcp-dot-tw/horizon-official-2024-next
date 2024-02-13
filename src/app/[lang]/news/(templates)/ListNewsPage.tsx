"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const postsPerPage = 6

import { Suspense, useMemo, useEffect, useContext, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import { useRouter, useSearchParams } from 'next/navigation'
import usePathnameWithoutLang from "@src/hooks/usePathnameWithoutLang"
import { useLazyQuery } from "@apollo/client"
import { QueryNews } from '@src/queries/categories/news.gql'
import PageNav from "@src/components/custom/PageNav"
import Loading from "@src/components/custom/icons/Loading"
import ListItem from "./ListItem"
import { CommonDataContext } from '@src/app/[lang]/providers'
import { formatCategories } from "./ListItem"

// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

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
    relatedYachtSeries?: {
      seriesSlug: string
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
  // const store = useStore()
  // const viewport = useWindowSize()
  const router = useRouter()
  const pathname = usePathnameWithoutLang()
  const searchParams = useSearchParams()
  const { className, lang } = props

  const [mergedList, setMergedList] = useState<TypePostNode[] | null>(null)

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

  const queryCategory = searchParams.get('category')
  const querySeries = searchParams.get('series')
  const commonData = useContext(CommonDataContext)
  const { yachtSeriesList } = commonData ?? {}

  const pageInfo = useMemo(()=>{
    return data?.posts?.pageInfo || props?.pageInfo
  }, [data, props.list, props.pageInfo, props.categories ])

  const allowedCategories = useMemo<{slug:string, name:string}[] | undefined>(()=>{
    return props?.categories?.nodes?.filter((node:{slug:string, name:string})=>{
      return !(['uncategorized', 'cover-story', 'events'].includes(node?.slug))
    })
  }, [props?.categories])



  const queryVariables = useMemo(()=>{
    return {
      first: postsPerPage,
      relatedYachtSeries: querySeries || null,
      ...(
        queryCategory
          ? {
            categories: [queryCategory],
            categoriesOperator: 'IN'
          }:{
            categories: [],
            categoriesOperator: 'NOT_IN'
          }
      )
    }
  }, [queryCategory, querySeries])

  useEffect(()=>{

    setMergedList(null)

    // 第一次進頁面，URL 還未做過任何查詢時
    if( queryCategory === null && querySeries === null && props.list){
      setMergedList((prev)=>{
        const uniqueSet = new Set()
        const uniqueList = [
          ...(prev === null ?[] :prev),
          ...props?.list
        ].filter(item => {
          if (!uniqueSet.has(item.slug)) {
            uniqueSet.add(item.slug)
            return true
          }
          return false
        })?.map((node:TypePostNode)=>{
          return {
            ...node,
            filteredCategories: formatCategories(node?.categories?.nodes)
          }
        })

        return uniqueList
      })
      return
    }

    getData({
      variables: queryVariables
    })

  }, [queryCategory, querySeries, pathname, props.list])

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>

      <div className="container mb-4">
        <div className="row flex-nowrap items-center">
          <div className="col-auto">
            <div className="text-[24px] font-300 text-minor-900">Latest News</div>
          </div>
          <div className="col-12 shrink">
            <div className="row row-gap-8 !flex-nowrap justify-end">
              <div className="col-auto shrink">
                <div className="row row-gap-2 !flex-nowrap items-baseline">
                  {/* <div className="col-auto text-gray-700">Category</div> */}
                  <div className="col-auto shrink">
                    <div className="w-screen max-w-[160px]">
                      <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                      value={queryCategory || ''}
                      onChange={(e)=>{
                        router.push(`${pathname}?category=${e.target.value}&series=${querySeries || ''}`, {scroll:false})
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
                </div>
              </div>
              <div className="col-auto shrink">
                <div className="row row-gap-2 !flex-nowrap items-baseline">
                  {/* <div className="col-auto text-gray-700">Series</div> */}
                  <div className="col-auto shrink">
                    <div className="w-screen max-w-[160px]">
                      <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                      value={querySeries || ''}
                      onChange={(e)=>{
                        router.push(`${pathname}?category=${queryCategory}&series=${e.target.value}`, {scroll:false})
                      }}>
                        <option value="">All Series</option>
                        {
                          yachtSeriesList?.nodes?.map((node, index:number)=>{
                            return <option key={index} value={node.slug}>{node.name} Series</option>
                          })
                        }
                      </select>
                    </div>
                  </div>
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
                <ListItem
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