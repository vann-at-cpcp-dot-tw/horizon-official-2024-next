"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`

import { Suspense, useEffect, useMemo } from 'react'

import { useQuery } from "@apollo/client"
import Image from "next/image"
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation"
import { twMerge } from 'tailwind-merge'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { QuerySingleHull } from '~/queries/categories/hull.gql'

import HullDetail from "../(templates)/HullDetail"

interface TypeProps {
  yachtName?: string
  list: {
    hullName: string
    vrEmbedUrl: string
  }[]
  [key:string]: any
}
interface TypeState {}

function Hulls(props:TypeProps, ref:React.ReactNode){
  const router = useRouter()
  const { className } = props
  const params = useParams()
  const { yachtSlug } = params
  const searchParams = useSearchParams()
  const queryHullName  = decodeURI(searchParams.get('hull') || '')
  const pathname = usePathname()
  const { __ } = useTranslate()
  const targetHull = useMemo(()=>{
    return props?.list?.find?.((node)=>node?.hullName?.toLowerCase() === queryHullName.toLowerCase())
  }, [queryHullName, props.list])

  const { data:openHullData, error:openHullError, loading:openHullLoading } = useQuery(QuerySingleHull, {
    skip: !yachtSlug || !targetHull?.hullName,
    context: {
      uri: HQ_API_URL
    },
    variables: {
      yachtSlug,
      hullName: targetHull?.hullName
    }
  })

  return <Suspense fallback={null}>
    <div className={twMerge('lg:py-24 py-12', className)}>
      <div className="container mb-4">
        <div className="mb-2 text-center text-gray-300">{ __('All Customization Detail') }</div>
        <div className="serif text-center text-[32px] text-gray-900">{ __('View by Crafts') }</div>
      </div>

      <div className="container">
        <div className="mx-auto w-full max-w-[800px]">
          <div className="row xl:row-gap-15 lg:row-gap-10 justify-center">
            {
              props?.list?.map((node, index)=>{
                return <div className="col-auto shrink" key={index}>
                  <div className="btn serif py-3 text-[23px] italic text-gray-300 hover:text-major-900 lg:text-[40px]"
                  onClick={()=>{
                    router.push(`${pathname}?hull=${node.hullName}`, {scroll:false})
                  }}>
                    { node?.hullName }
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </div>
    </div>

    {
      targetHull?.hullName && <HullDetail yachtName={props.yachtName} hullName={targetHull?.hullName} {...(openHullData?.hull || {})}/>
    }
  </Suspense>
}

export default Hulls