"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const postsPerPage = 10

import { Suspense, useMemo, useEffect, useContext } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/helpers'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { usePathnameWithoutLang } from 'vanns-common-modules/dist/use/next'
import { useLazyQuery } from "@apollo/client"
import { QueryPostsByCategory } from '~/queries/pages/news-[categorySlug].gql'
import PageNav from '~/components/custom/PageNav'
import Loading from '~/components/custom/icons/Loading'
import NewsListItem from "./ListItem"
import { CommonDataContext, CommonDataContextType } from '~/app/[lang]/providers'
import { TypePostNode } from "./ListNewsPage"

// import { useStore } from '~/store'
// import useWindowSize from '~/use/useWindowSize"

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

function ListWithCategory(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const viewport = useWindowSize()
  const router = useRouter()
  const pathname = usePathnameWithoutLang()
  const searchParams = useSearchParams()
  const params = useParams()
  const { className, lang } = props
  const[getData, { data, loading }] = useLazyQuery(QueryPostsByCategory)
  const querySeries = searchParams.get('series')
  const { categorySlug } = params
  const commonData = useContext(CommonDataContext)
  const { yachtSeriesList } = commonData ?? {}

  const listData = useMemo(()=>{
    const originList = data?.category?.posts?.nodes || props?.list
    const list = originList?.map((node:{[key:string]:any})=>{
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
      pageInfo: data?.category?.posts?.pageInfo || props?.pageInfo,
    }
  }, [data, props.list, props.pageInfo, props.categories ])

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
      relatedYachtSeries: querySeries || null,
    }
  }, [querySeries])

  useEffect(()=>{

    // 第一次進頁面，URL 還未做過任何查詢時
    if( querySeries === null){
      return
    }

    getData({
      variables: queryVariables
    })

  }, [querySeries, pathname])

  if( loading ){
    return <div className="py-20">
      <Loading style={{width:'120px'}} fill="var(--color-golden-900)"/>
    </div>
  }


  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>

      <div className="container mb-4">
        <div className="row flex-nowrap justify-end">
          <div className="col-auto shrink">
            <div className="row row-gap-2 !flex-nowrap items-baseline">
              {/* <div className="col-auto text-gray-700">Series</div> */}
              <div className="col-auto shrink">
                <div className="w-screen max-w-[160px]">
                  <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                  value={querySeries || ''}
                  onChange={(e)=>{
                    router.push(`${pathname}?series=${e.target.value}`, {scroll:false})
                  }}>
                    <option value="">All Series</option>
                    {
                      yachtSeriesList?.nodes?.map((node:CommonDataContextType['yachtSeriesList']['nodes'][number], index:number)=>{
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

      <div className="container mb-8">
        <div className="row">
          {
            highlightList?.map((node:TypePostNode, index:number)=>{
              return <div className={`mb-10 ${categorySlug === 'events' ?'lg:col-4 col-12' :'lg:col-6 col-12'}`} key={index}>
                <NewsListItem
                href={`/news/${categorySlug}/${node.slug}`}
                title={node?.title}
                date={node?.date}
                thumbnail={node?.postCustomFields?.gallery?.[0]?.image?.node?.mediaItemUrl || ''}
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
                thumbnail={node?.postCustomFields?.gallery?.[0]?.image?.node?.mediaItemUrl || ''}
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