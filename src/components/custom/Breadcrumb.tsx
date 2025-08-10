"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import Image from "next/image"
import { useParams } from "next/navigation"
import { twMerge } from 'tailwind-merge'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  list: {
    label: string | React.ReactNode
    href?: string
  }[]
  [key:string]: any
}
interface TypeState {}

function Breadcrumb(props:TypeProps){

  const { lang } = useParams()
  const { className } = props

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container-fluid text-[12px] lg:text-[16px]">
        <div className="row row-gap-0">
          {
            props?.list?.map?.((node, index)=>{
              return <div className="col-auto flex max-w-full" key={index}>
                {
                  node?.href
                    ? <LinkWithLang className="text-major-900" href={node.href} lang={lang}>{node.label}</LinkWithLang>
                    : <div className="text-gray-300">{node.label}</div>
                }
                {
                  index + 1 < props?.list?.length && <div className="text-major-900">{/* &nbsp;/&nbsp; */}／</div>
                }
              </div>
            })
          }
        </div>
      </div>
    </div>
  </Suspense>
}

export default Breadcrumb