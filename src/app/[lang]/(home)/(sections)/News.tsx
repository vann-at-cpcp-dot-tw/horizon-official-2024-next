"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useMemo } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import ListItem from "../../news/(templates)/ListItem"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

interface TypeProps {
  list?: {
    [key:string]: any
  }[]
  lang: string
  [key:string]: any
}
interface TypeState {}

function News(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const posts = useMemo<{
    [key:string]: any
  }[]>(()=>{
    const list = props.list?.map((node:{[key:string]:any})=>{
      return {
        ...node,
        filteredCategories: node?.categories?.nodes?.map((catNode:{[key:string]:any})=>{
          return {
            name: catNode?.name,
            href: `/news/${catNode?.slug}`
          }
        })
      }
    })

    return list || []
  }, [props.list])

  return <Suspense fallback={null}>
    <div className={twMerge('pb-24', className)}>
      <div className="container">
        <div className="row justify-center">
          {
            posts?.map((node:{[key:string]:any}, index:number)=>{
              return <div className="lg:col-4 col-12 mb-10" key={index}>
                <ListItem
                href={`/news/${node?.filteredCategories?.[0]?.slug}/${node.slug}`}
                title={node?.title}
                date={node?.date}
                thumbnail={node?.postCustomFields?.gallery?.[0]?.image?.node?.mediaItemUrl || ''}
                categories={node?.filteredCategories} />
              </div>
            })
          }
        </div>
      </div>
      <div className="container flex justify-center">
        <LinkWithLang href="/news" lang={props.lang}>
          <span className="btn-text text-gray-700">More News</span>
        </LinkWithLang>
      </div>
    </div>
  </Suspense>
}

export default News