"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo } from 'react'
import { useCommonData } from "~/app/[lang]/providers"
import { useRouter } from 'next/navigation'
import { useStore } from '~/store'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/helpers'
import Breadcrumb from '~/components/custom/Breadcrumb'

interface TypeProps {
  slug: string
  [key:string]: any
}

interface TypeState {}

function SingleSeriesTop(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const router = useRouter()
  const viewport = useWindowSize()
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
        label: 'Models',
        href: '/models'
      },
      {
        label: `${seriesData?.name} Series`,
      }
    ]} />
    <div className={twMerge('container max-w-[975px] lg:py-16 py-8', className)}>
      <div className="serif mb-2 text-center text-[32px] text-golden-900 lg:text-[40px]">{seriesData?.name} Series</div>
      <div className="serif mb-3 text-center text-[24px] leading-[1.3] text-minor-900 lg:mb-6 lg:text-[40px]">{seriesData?.yachtsSeriesCustomFields?.seriesSimpleDescription}</div>
      <div className="text-center text-gray-700">{seriesData?.description}</div>
    </div>
  </Suspense>
}

export default SingleSeriesTop