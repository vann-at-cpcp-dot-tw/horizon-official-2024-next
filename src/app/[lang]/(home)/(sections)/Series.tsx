"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useContext } from 'react'
import SwiperOverflow from "@src/components/custom/SwiperOverflow"
import { CommonDataContext } from '@src/app/[lang]/providers'

interface TypeProps {}
interface TypeState {}

function Series(props:TypeProps, ref:React.ReactNode){

  const commonData = useContext(CommonDataContext)
  const { yachtSeriesList } = commonData

  const seriesList = useMemo(()=>{
    return yachtSeriesList?.nodes?.map?.((listNode)=>{
      return {
        slug: listNode.slug,
        label: listNode.name,
        link: `/models/${listNode.slug}`,
        mediaItemUrl: listNode?.yachtsSeriesCustomFields?.seriesKeyImage?.node?.mediaItemUrl,
      }
    })
  }, [yachtSeriesList])

  return <Suspense fallback={null}>
    <SwiperOverflow list={seriesList} listTitle="Series"/>
  </Suspense>
}

export default Series