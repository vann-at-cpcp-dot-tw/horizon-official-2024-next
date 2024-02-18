"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { Suspense, useContext, useEffect } from 'react'
import { CommonDataContext } from '@src/app/[lang]/providers'
import { useParams } from 'next/navigation'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import LinkWithLang from "@src/components/custom/LinkWithLang"

interface TypeProps {}
interface TypeState {}
interface TypeYachtNode {
  slug: string
  title: string
}

function SeriesList(props:TypeProps, ref:React.ReactNode){

  const commonData = useContext(CommonDataContext)
  const { yachtSeriesList:allSeries } = commonData
  const { lang } = useParams()

  return <Suspense fallback={null}>
    <div className="flex">
      {
        allSeries?.nodes?.map((node, index:number)=>{
          return <div className="mb-10 w-1/2" key={index}>
            <RatioArea className="mb-4" ratio="63.47">
              <LinkWithLang className="size-full absolute left-0 top-0" href={`/models/${node.slug}`} lang={lang}>
                <Image className="size-full absolute left-0 top-0 z-0 object-cover" fill={true} src={node?.yachtsSeriesCustomFields?.seriesKeyImage?.node?.mediaItemUrl || ''} alt="" />
              </LinkWithLang>
            </RatioArea>
            <div className="px-6 lg:px-12">
              <div className="">
                <LinkWithLang className="serif text-[40px] leading-none text-golden-900" href={`/models/${node.slug}`} lang={lang}>{node?.name}</LinkWithLang>
              </div>
              <div className="flex">
                {
                  // node?.yachts?.nodes?.map((yachtNode:TypeYachtNode, yachtNodeIndex:number)=>{
                  //   return <div className="pr-2.5" key={yachtNodeIndex}>
                  //     <LinkWithLang className="block py-1.5 text-gray-500" href={`/models/${node.slug}`} lang={lang}>
                  //       { yachtNode.title }
                  //     </LinkWithLang>
                  //   </div>
                  // })
                }
              </div>
            </div>
          </div>
        })
      }
    </div>
  </Suspense>
}

export default SeriesList