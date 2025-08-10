'use client'
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

import NewsListItem from "./ListItem"

interface TypeProps {
  list: {
    slug: string
    title: string
    date: string
    postCustomFields: {
      gallery?: {
        image?: {
          node?: {
            mediaItemUrl: string
          }
        }
      }[]
    }
  }[]
  [key:string]: any
}
interface TypeState {}

function NewsPageEventsBlock(props:TypeProps){
  const { className } = props
  const { __ } = useTranslate()
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container mb-4">
        <div className="text-[24px] font-300 text-minor-900">
          { __('Events') }
        </div>
      </div>

      <div className="container">
        <div className="row">
          {
            props.list?.map?.((node, index)=>{
              if( !node?.slug ){
                return null
              }

              return <div className="lg:col-4 col-12 mb-10" key={index}>
                <NewsListItem
                title={node.title}
                date={node.date}
                href={`/news/events/${node.slug}`}
                thumbnail={node.postCustomFields?.gallery?.[0]?.image?.node?.mediaItemUrl || ''}
                categories={[
                  {
                    name: 'Events',
                    href: '/news/events'
                  }
                ]}/>
              </div>
            })
          }
        </div>
      </div>

      <div className="container text-center">
        <LinkWithLang
        className="btn-text text-gray-700"
        href="/news/events"
        lang={props.lang}
        >
          { __('More Events') }
        </LinkWithLang>
      </div>
    </div>
  </Suspense>
}

export default NewsPageEventsBlock