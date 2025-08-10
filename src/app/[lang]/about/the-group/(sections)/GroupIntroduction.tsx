const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  content: string
  [key:string]: any
}
interface TypeState {}

function GroupIntroduction(props:TypeProps){
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container pb-16 lg:pb-[120px] lg:pt-10">
        <div className="mx-auto w-full max-w-[900px] text-gray-700">{props?.content}</div>
      </div>
    </div>
  </Suspense>
}

export default GroupIntroduction