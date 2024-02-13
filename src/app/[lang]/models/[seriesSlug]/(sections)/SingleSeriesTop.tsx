"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useContext, useEffect, useMemo } from 'react'
import { CommonDataContext } from '@src/app/[lang]/providers'
import { useRouter } from 'next/navigation'
import { useStore } from '@src/store'
import { useWindowSize } from 'react-use'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import Breadcrumb from "@src/components/custom/Breadcrumb"

interface TypeProps {
  slug: string
  [key:string]: any
}

interface TypeState {}

function SingleSeriesTop(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const router = useRouter()
  const viewport = useWindowSize()
  const commonData = useContext(CommonDataContext)
  const { yachtSeriesList:allSeries } = commonData
  const seriesData = useMemo(()=>{
    return allSeries?.nodes?.find((node:{slug:string})=>node.slug === props.slug)
  }, [allSeries])

  const { className } = props

  return <Suspense fallback={null}>
    <Breadcrumb className="pb-5 pt-10"
    list={[
      {
        label: 'Models',
        href: '/models'
      },
      {
        label: `${seriesData?.name} Series`,
      }
    ]} />
    <div className={twMerge('container max-w-[975px]', className)}>
      <div className="serif mb-2 text-center text-[40px] text-golden-900">{seriesData?.name} Series</div>
      <div className="serif mb-6 text-center text-[40px] text-minor-900">{seriesData?.yachtsSeriesCustomFields?.seriesSimpleDescription}</div>
      <div className="text-center text-gray-700">{seriesData?.description}</div>
    </div>
  </Suspense>
}

export default SingleSeriesTop