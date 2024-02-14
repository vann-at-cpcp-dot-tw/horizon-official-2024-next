"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
import Image from "next/image"

import { Suspense } from 'react'
import { useStore } from '@src/store'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"

interface TypeProps {
  heroImage: string
  [key:string]: any
}

interface TypeState {}

function KV(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const { className } = props

  return <Suspense fallback={null}>
    <div className={twMerge('relative  w-full', className)}>
      <RatioArea ratio="42.85">
        <Image className="absolute left-0 top-0 h-full w-full" src={props?.heroImage} fill={true} alt="" />
      </RatioArea>

      <div className="py-20">
        <div className="container text-center">
          <div className="serif mb-3 text-[32px] text-minor-900">The Horizon Group</div>
          <div className="serif mb-6 text-[20px] text-minor-900">Horizon Group is a specialized yacht conglomerate encompassing a composite material technology company,<br/>three shipyards, and a top-tier luxury yacht marina.</div>
          <div className="text-[17px] text-gray-300">100% Crafted in Kaohsiung, Taiwan</div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default KV