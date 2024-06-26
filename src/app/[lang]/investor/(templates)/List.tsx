"use client"

const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION
const postsPerPage = 10

import { Suspense, useState, useMemo, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { QueryInvestorPage } from '~/queries/pages/investor.gql'
import { useLazyQuery } from "@apollo/client"
import PageNav from '~/components/custom/PageNav'
import Loading from '~/components/custom/icons/Loading'

interface TypePostNode {
  [key:string]: any
}

interface TypeProps {
  list?: TypePostNode[],
  pageInfo?: {
    endCursor: string
    hasNextPage: string
    hasPreviousPage: string
    startCursor: string
  }
  [key:string]: any
}

interface TypeState {}

function List(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const viewport = useWindowSize()
  const { className } = props
  const [mergedList, setMergedList] = useState<TypePostNode[] | null>(null)
  const[getData, { data, loading }] = useLazyQuery(QueryInvestorPage, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setMergedList((prev)=>{
        return [
          ...(prev === null ?[] :prev),
          ...data?.posts?.nodes
        ]
      })
    },
  })

  const pageInfo = useMemo(()=>{
    return data?.posts?.pageInfo || props?.pageInfo
  }, [data?.posts?.pageInfo, props.pageInfo ])


  const queryVariables = {
    first: postsPerPage,
  }

  useEffect(()=>{

    setMergedList(null)

    // 第一次進頁面，URL 還未做過任何查詢時
    if( props.list ){
      setMergedList((prev)=>{
        const uniqueSet = new Set()
        const uniqueList = [
          ...(prev === null ?[] :prev),
          ...(props?.list || [])
        ].filter(item => {
          if( !item?.slug || uniqueSet.has(item.slug)){
            return false
          }
          uniqueSet.add(item.slug)
          return true
        })
        return uniqueList
      })
      return
    }

    getData({
      variables: queryVariables
    })

  }, [props.list])

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>

      <div className="container max-w-[940px]">
        {
          mergedList?.map((node, index)=>{
            return <div className="border-b border-gray-700 py-4" key={index}>
              <div className="row flex-nowrap items-center">
                <div className="col-auto">{(node?.date || '').slice(0, 10).replaceAll('-', '.')}</div>
                <div className="col">{node.title}</div>
                <div className="col-auto">
                  <a className="underline hover:underline" href={node?.customFields?.pdfFile?.node?.mediaItemUrl} target="_blank">PDF</a>
                </div>
              </div>
            </div>
          })
        }
      </div>


      {
        loading
          ?<Loading style={{width:'44px'}} fill="var(--color-golden-900)"/>
          :<div className="pt-5">
            <PageNav
            pageInfo={pageInfo}
            moreMode
            moreText="More"
            onNextClick={()=>{
              getData({
                variables: {
                  ...queryVariables,
                  after: pageInfo?.endCursor,
                  first: postsPerPage,
                }
              })
            }} />
          </div>
      }

    </div>
  </Suspense>
}

export default List