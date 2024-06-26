const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import Image from "next/image"
import { Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import ImageAutoPlaceholder from "~/components/custom/ImageAutoPlaceholder"
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