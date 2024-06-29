
"use client"

const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useCallback } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePathnameWithoutLang } from 'vanns-common-modules/dist/use/next'
import { isEmpty } from "vanns-common-modules/dist/lib/utils"
interface TypeProps {
  yachtConditions?: {
    slug: string
    name: string
  }[]
  lengthOptions?: {
    label: string
    minValue: string | number
    maxValue: string | number
  }[]
  yearOptions?: (string | number)[]
  [key:string]: any
}
interface TypeState {}



function ListFilters(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props

  const searchParams = useSearchParams()
  const pathname = usePathnameWithoutLang()
  const queryCondition = searchParams.get('condition')
  const queryYachtLength = searchParams.get('length')
  const queryYachtPrice = searchParams.get('price')
  const queryYachtYear = searchParams.get('year')
  const queryOrderby = searchParams.get('orderby')

  const genQueryString = useCallback((args:{key:string, value:string})=>{
    const { key, value } = args
    const queries = {
      condition: queryCondition || '',
      length: queryYachtLength || '',
      price: queryYachtPrice || '',
      year: queryYachtYear || '',
      orderby: queryOrderby || ''
    } as Record<string, string>

    if( key ){
      queries[key] = value
    }

    return new URLSearchParams(queries).toString()
  }, [
    pathname,
    queryCondition,
    queryYachtLength,
    queryYachtPrice,
    queryYachtYear,
    queryOrderby
  ])
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container mb-10">
        <div className="row justify-center lg:flex-nowrap">
          {
            props?.yachtConditions && <div className="col-6 shrink lg:col-auto">
              <div className="w-screen max-w-full lg:max-w-[177px]">
                <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                value={queryCondition || ''}
                onChange={(e)=>{
                  router.push(`${pathname}?${genQueryString({key:'condition', value:e.target.value})}`, {scroll:false})
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
            props?.lengthOptions && <div className="col-6 shrink lg:col-auto">
              <div className="w-screen max-w-full lg:max-w-[177px]">
                <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                value={queryYachtLength || ''}
                onChange={(e)=>{
                  router.push(`${pathname}?${genQueryString({key:'length', value:e.target.value})}`, {scroll:false})
                }}>
                  <option value="">All Lengths</option>
                  {
                    props.lengthOptions.map((node, index)=>{
                      return <option key={index} value={`${node?.minValue},${node?.maxValue}`}>{node?.label}</option>
                    })
                  }
                </select>
              </div>
            </div>
          }

          {
            !isEmpty(props?.yearOptions) && <div className="col-6 shrink lg:col-auto">
              <div className="w-screen max-w-full lg:max-w-[177px]">
                <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                value={queryYachtYear || ''}
                onChange={(e)=>{
                  router.push(`${pathname}?${genQueryString({key:'year', value:e.target.value})}`, {scroll:false})
                }}>
                  <option value="">All Years</option>
                  {
                    props?.yearOptions?.map((node, index)=>{
                      return <option key={index} value={`${node}`}>{node}</option>
                    })
                  }
                </select>
              </div>
            </div>
          }
        </div>
      </div>

      <div className="container">
        <div className="row row-gap-2 flex-nowrap items-center justify-end">
          <div className="col-auto text-gray-700">Sort By:</div>
          <div className="col-6 shrink lg:col-auto">
            <div className="w-screen max-w-full lg:max-w-[177px]">
              <select className="w-full border-b border-gray-700 bg-transparent text-gray-700"
                value={queryOrderby || ''}
                onChange={(e)=>{
                  router.push(`${pathname}?${genQueryString({key:'orderby', value:e.target.value})}`, {scroll:false})
                }}>
                <option value="">Latest Listing</option>
                <option value="length,desc">Length - Hight to Low</option>
                <option value="length,asc">Length - Low to Hight</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default ListFilters