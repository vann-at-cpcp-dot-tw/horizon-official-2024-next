"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import Image from "next/image"
import { useParams } from "next/navigation"
import { twMerge } from 'tailwind-merge'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { useStore } from '~/store'

interface TypeProps {
  publicationCategories: {
    nodes: {
      slug: string
      name: string
      publications: {
        nodes?: {
          slug: string
          title: string
        }[]
      }
    }[]
  }
  [key:string]: any
}
interface TypeState {}

function PageTop(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const { __ } = useTranslate()
  const { className } = props
  const params = useParams()
  const { lang, publicationCategorySlug }  = params

  return <Suspense fallback={null}>

    <div className={twMerge('', className)}
    style={{
      background: '#EEEBE6',
      paddingTop: `${store.headerHeight}px`,
      marginTop: `-${store.headerHeight}px`,
    }}>
      <div className="container serif mb-6 pt-16 text-center text-[32px] text-minor-900">{ __('PUBLICATION') }</div>
      <div className="container">
        <div className="row justify-center">
          <div className="col-auto">
            <LinkWithLang href="/publications" lang={lang} className={`btn ${!publicationCategorySlug ?'text-gray-900' :'text-gray-300'}`}>
              { __('All') }
            </LinkWithLang>
          </div>
          {
            props?.publicationCategories?.nodes?.map((node, index:number)=>{
              return <div className="col-auto" key={index}>
                <LinkWithLang href={`/publications/${node.slug}`} lang={lang} className={`btn ${publicationCategorySlug === node.slug ?'text-gray-900' :'text-gray-300'}`}>{ node.name }</LinkWithLang>
              </div>
            })
          }
        </div>
      </div>
    </div>
  </Suspense>
}

export default PageTop