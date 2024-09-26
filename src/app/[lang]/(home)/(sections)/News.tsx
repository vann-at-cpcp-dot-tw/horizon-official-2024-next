"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useMemo } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import LinkWithLang from '~/components/custom/LinkWithLang'

import NewsListItem from "../../news/(templates)/ListItem"


interface TypeProps {
  list?: {
    [key:string]: any
  }[]
  lang: string
  [key:string]: any
}
interface TypeState {}

function News(props:TypeProps, ref:React.ReactNode){
  const { __ } = useTranslate()
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
            href: `/news/${catNode?.slug}`,
            slug: catNode?.slug
          }
        })
      }
    })
    return list || []
  }, [props.list])

  return <Suspense fallback={null}>
    <div className={twMerge('lg:pb-24 pb-12', className)}>
      <div className="container">
        <div className="row justify-center">
          {
            posts?.map((node:{[key:string]:any}, index:number)=>{
              return <div className="lg:col-4 col-12 mb-5 lg:mb-10" key={index}>
                <NewsListItem
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
          <span className="btn-text text-gray-700">{ __('More News') }</span>
        </LinkWithLang>
      </div>
    </div>
  </Suspense>
}

export default News