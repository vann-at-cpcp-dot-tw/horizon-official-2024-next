const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import ImageAutoPlaceholder from "@root/src/components/custom/ImageAutoPlaceholder"
interface TypeProps {
  content: string
  imageAfterContent: string
  [key:string]: any
}
interface TypeState {}

function Discover(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('lg:py-20 py-16', className)}>
      <div className="container-fluid mb-6 lg:mb-[110px]">
        <div className="mb-4 text-center text-gray-300">Discover Horizon</div>
        <div className="mx-auto w-full max-w-[900px] leading-[1.6] text-gray-700">{props?.content}</div>
      </div>
      <RatioArea ratio="56.25">
        <ImageAutoPlaceholder src={props?.imageAfterContent} fill={true} sizes="100vw" />
      </RatioArea>
    </div>
  </Suspense>
}

export default Discover