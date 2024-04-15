
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
import Image from "next/image"

import { Suspense } from 'react'
import { useStore } from '~/store'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/helpers'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import ImageAutoPlaceholder from "~/components/custom/ImageAutoPlaceholder"
interface TypeProps {
  heroImage: string
  heroImagePlaceHolder?: string
  [key:string]: any
}

interface TypeState {}

function KV(props:TypeProps, ref:React.ReactNode){
  const { className } = props

  return <div className={twMerge('relative  w-full', className)}>
    <RatioArea ratio="42.85">
      <ImageAutoPlaceholder className="absolute left-0 top-0 size-full" src={props?.heroImage} fill={true} sizes="100vw" />
    </RatioArea>

    <div className="py-12 lg:py-20">
      <div className="container text-center">
        <div className="serif mb-1.5 text-[24px] text-minor-900 lg:mb-3 lg:text-[32px]">The Horizon Group</div>
        <div className="serif mb-3 text-[16px] text-minor-900 lg:mb-6 lg:text-[20px]">Horizon Group is a specialized yacht conglomerate encompassing a composite material technology company,<br/>three shipyards, and a top-tier luxury yacht marina.</div>
        <div className="text-[14px] text-gray-300 lg:text-[17px]">100% Crafted in Kaohsiung, Taiwan</div>
      </div>
    </div>
  </div>
}

export default KV