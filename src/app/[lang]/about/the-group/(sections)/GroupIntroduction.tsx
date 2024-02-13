const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'

interface TypeProps {
  content: string
  [key:string]: any
}
interface TypeState {}

function GroupIntroduction(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container pb-[120px] pt-10">
        <div className="mx-auto w-full max-w-[900px] text-gray-700">{props?.content}</div>
      </div>
    </div>
  </Suspense>
}

export default GroupIntroduction