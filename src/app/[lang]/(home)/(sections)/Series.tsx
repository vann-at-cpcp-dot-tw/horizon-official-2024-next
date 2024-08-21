"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useMemo, useContext } from 'react'
import SwiperOverflow from '~/components/custom/SwiperOverflow'
import { ICommonData, useCommonData } from "~/app/[lang]/providers"
import { useTranslate } from "vanns-common-modules/dist/use/react"

interface TypeProps {}
interface TypeState {}

function Series(props:TypeProps, ref:React.ReactNode){

  const commonData = useCommonData()
  const { __ } = useTranslate()
  const { yachtSeriesList } = commonData ?? {}

  const seriesList = useMemo(()=>{
    return yachtSeriesList?.nodes?.map?.((listNode:ICommonData['yachtSeriesList']['nodes'][number])=>{
      return {
        slug: listNode.slug,
        label: listNode.name,
        link: `/models/${listNode.slug}`,
        mediaItemUrl: listNode?.yachtsSeriesCustomFields?.seriesKeyImage?.node?.mediaItemUrl,
        content: <div className="absolute left-0 top-0 flex size-full flex-col justify-end p-2.5 text-white lg:items-center lg:p-5">
          <div className="mb-2 text-[12px] font-700 lg:text-[15px]">{listNode?.name} { __('Series') }</div>
          <div className="serif mb-2 text-[16px] leading-[1.2] lg:text-[24px]">{listNode?.yachtsSeriesCustomFields?.seriesSimpleDescription}</div>
        </div>
      }
    })
  }, [yachtSeriesList])

  return <Suspense fallback={null}>
    <SwiperOverflow list={seriesList} listTitle="Series"
    swiperOptions={{
      autoplay: {
        delay: 3000,
        // disableOnInteraction: true,
        // disableOnInteraction: false,
        // pauseOnMouseEnter: true,
      }
    }}/>
  </Suspense>
}

export default Series