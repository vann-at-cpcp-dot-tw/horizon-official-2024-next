"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useMemo } from 'react'

import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import { useCommonData } from "~/app/[lang]/providers"
import Breadcrumb from '~/components/custom/Breadcrumb'
import { isEmpty } from '~/lib/utils'
import { useStore } from '~/store'

interface TypeProps {
  slug: string
  [key:string]: any
}

interface TypeState {}

function SingleSeriesTop(props:TypeProps, ref:React.ReactNode){
  const { __ } = useTranslate()
  const commonData = useCommonData()
  const { yachtSeriesList:allSeries } = commonData
  const seriesData = useMemo(()=>{
    return allSeries?.nodes?.find((node:{slug:string})=>node.slug === props.slug)
  }, [allSeries])

  const { className } = props

  return <Suspense fallback={null}>
    <Breadcrumb className="pb-5 pt-2.5 lg:pt-10"
    list={[
      {
        label: __('Models'),
        href: '/models'
      },
      {
        label: `${seriesData?.name} ${__('Series')}`,
      }
    ]} />
    <div className={twMerge('container max-w-[975px] lg:py-16 py-8', className)}>
      <div className="serif mb-2 text-center text-[32px] text-golden-900 lg:text-[40px]">{seriesData?.name} aa { __('Series') }</div>
      <div className="serif mb-3 text-center text-[24px] leading-[1.3] text-minor-900 lg:mb-6 lg:text-[40px]">{seriesData?.yachtsSeriesCustomFields?.seriesSimpleDescription}</div>
      <div className="text-center text-gray-700">{seriesData?.description}</div>
    </div>
  </Suspense>
}

export default SingleSeriesTop