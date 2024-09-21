const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  title: string
  description: string
  classes?: {
    description?: string
  }
  [key:string]: any
}
interface TypeState {}

function Intro(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('lg:mb-24 mb-10', className)}>
      <div className="container">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="serif text-center text-[28px] text-golden-900 lg:mb-4 lg:text-[32px]">{props.title}</div>
          <pre className={`text-[15px] leading-[1.6] text-gray-700 ${props?.classes?.description || ''}`} dangerouslySetInnerHTML={{__html: props.description || ''}}></pre>
        </div>
      </div>
    </div>
  </Suspense>
}

export default Intro