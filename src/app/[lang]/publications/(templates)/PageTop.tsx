"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { useParams } from "next/navigation"
// import { useRouter } from 'next/navigation'
import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  publicationCategories: {
    nodes: {
      slug: string
      name: string
      publications: {
        nodes: {
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
  // const router = useRouter()
  // const viewport = useWindowSize()
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
      <div className="container serif mb-6 pt-16 text-center text-[32px] text-minor-900">PUBLICATION</div>
      <div className="container">
        <div className="row justify-center">
          <div className="col-auto">
            <LinkWithLang href="/publications" lang={lang} className={`btn ${!publicationCategorySlug ?'text-gray-900' :'text-gray-300'}`}>All</LinkWithLang>
          </div>
          {
            props?.publicationCategories?.nodes?.map((node:{slug:string, name:string}, index:number)=>{
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