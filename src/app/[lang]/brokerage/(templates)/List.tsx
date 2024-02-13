"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useState, useMemo, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { QueryBrokerages } from '@src/queries/pages/brokerage.gql'
import { useLazyQuery } from "@apollo/client"
import { useRouter, useSearchParams } from 'next/navigation'
import usePathnameWithoutLang from "@root/src/hooks/usePathnameWithoutLang"
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

interface TypeProps {
  yachtConditions?: {
    slug: string
    name: string
  }[]
  brokerageLengthOptions?: {
    label: string
    minValue: string | number
    maxValue: string | number
  }[]
  brokeragePriceOptions?: {
    label: string
    minValue: string | number
    maxValue: string | number
  }[]
  brokerageYearOptions?: {
    value: string | number
  }[]
  [key:string]: any
}
interface TypeState {}

function List(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const viewport = useWindowSize()
  const { className } = props
  const router = useRouter()
  const pathname = usePathnameWithoutLang()
  const searchParams = useSearchParams()
  const[getData, { data, loading }] = useLazyQuery(QueryBrokerages)
  const [list, setList] = useState<[] | null>(null)

  // useEffect(()=>{

  //   setList(null)

  //   // 第一次進頁面，URL 還未做過任何查詢時
  //   if( queryCategory === null && querySeries === null && props.list){
  //    return
  //   }

  //   getData({
  //     variables: queryVariables
  //   })

  // }, [queryCategory, querySeries, pathname, props.list])

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>

      <div className="container">
        <div className="row justify-center lg:flex-nowrap">

          {
            props?.yachtConditions && <div className="col-6 shrink lg:col-auto">
              <div className="w-screen max-w-[177px]">
                <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                // value={queryCategory || ''}
                onChange={(e)=>{
                  // router.push(`${pathname}?category=${e.target.value}&series=${querySeries || ''}`, {scroll:false})
                }}>
                  <option value="">All Categories</option>
                  {
                    props.yachtConditions.map((node, index)=>{
                      return <option key={index} value={node.slug}>{node.name}</option>
                    })
                  }
                </select>
              </div>
            </div>
          }


          {
            props?.brokerageLengthOptions && <div className="col-6 shrink lg:col-auto">
              <div className="w-screen max-w-[177px]">
                <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                value=""
                onChange={()=>{}}>
                  <option value="">All Lengths</option>
                  {
                    props.brokerageLengthOptions.map((node, index)=>{
                      return <option key={index} value={`${node?.minValue},${node?.maxValue}`}>{node?.label}</option>
                    })
                  }
                </select>
              </div>
            </div>
          }

          {
            props?.brokeragePriceOptions && <div className="col-6 shrink lg:col-auto">
              <div className="w-screen max-w-[177px]">
                <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                value=""
                onChange={()=>{}}>
                  <option value="">All Prices</option>
                  {
                    props.brokeragePriceOptions.map((node, index)=>{
                      return <option key={index} value={`${node?.minValue},${node?.maxValue}`}>{node?.label}</option>
                    })
                  }
                </select>
              </div>
            </div>
          }

          {
            props?.brokerageYearOptions && <div className="col-6 shrink lg:col-auto">
              <div className="w-screen max-w-[177px]">
                <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                value=""
                onChange={()=>{}}>
                  <option value="">All Years</option>
                  {
                    props.brokerageYearOptions.map((node, index)=>{
                      return <option key={index} value={`${node?.value}`}>{node?.value}</option>
                    })
                  }
                </select>
              </div>
            </div>
          }
        </div>
      </div>

      <div className="container py-10">
        {
          props?.brokerages?.map((node, index)=>{
            return <div className="py-5" key={index}>{node.title}</div>
          })
        }
      </div>
    </div>
  </Suspense>
}

export default List