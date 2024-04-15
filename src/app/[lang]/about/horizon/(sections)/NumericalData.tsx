"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '~/store'
import { useWindowSize } from "vanns-common-modules/dist/use/react"
import { twMerge } from 'tailwind-merge'
import { isEmpty, numberFormat } from '~/lib/helpers'
import { animate } from "framer-motion"
import dynamic from "next/dynamic"
const AniCounter = dynamic(() => import('~/components/custom/dynamic/AniCounter'), {ssr: false})

interface TypeProps {
  yachtsBuild?: string | number
  overSqftArea?: string | number
  iso9001Certified?: string | number
  employees?: string | number
  [key:string]: any
}

interface TypeState {}

function NumericalData(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('container lg:mb-[120px] mb-12', className)}>
      <div className="container mb-6 lg:mb-14">
        <div className="row justify-center">
          <div className="col-12 py-1 lg:col-auto lg:py-0">
            <div className="serif flex !flex-nowrap items-end justify-center px-2 text-minor-900">
              <AniCounter className="text-[32px] italic lg:text-[48px]" from={0} to={Number(props?.yachtsBuild)}/>
              <span className="serif text-[32px] italic lg:text-[48px]">+&nbsp;</span>
              <span className="serif relative -top-2 block text-[17px] lg:-top-4 lg:text-[22px]">yachts build</span>
            </div>
          </div>
          <div className="col-12 py-1 lg:col-auto lg:py-0">
            <div className="serif flex !flex-nowrap items-end justify-center px-2 text-minor-900">
              <AniCounter className="text-[32px] italic lg:text-[48px]" from={0} to={Number(props?.overSqftArea)}/>
              <span className="serif text-[32px] italic lg:text-[48px]">&nbsp;sqft&nbsp;</span>
              <span className="serif relative -top-2 block text-[17px] lg:-top-4 lg:text-[22px]">area</span>
            </div>
          </div>
        </div>
        <div className="row justify-center">
          <div className="col-12 py-1 lg:col-auto lg:py-0">
            <div className="serif flex !flex-nowrap items-end justify-center px-2 text-minor-900">
              <AniCounter className="text-[32px] italic lg:text-[48px]" from={0} to={Number(props?.iso9001Certified)}/>
              <span className="text-[32px] lg:text-[48px]">&nbsp;</span>
              <span className="serif relative -top-2 block text-[17px] lg:-top-4 lg:text-[22px]">ISO 9001 certified shipyard</span>
            </div>
          </div>
          <div className="col-12 py-1 lg:col-auto lg:py-0">
            <div className="serif flex !flex-nowrap items-end justify-center px-2 text-minor-900">
              <AniCounter className="text-[32px] italic lg:text-[48px]" from={0} to={Number(props?.employees)}/>
              <span className="serif text-[32px] italic lg:text-[48px]">+&nbsp;</span>
              <span className="serif relative -top-2 text-[17px] lg:-top-4 lg:text-[22px]">dedicated employees</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="serif mx-auto w-full max-w-[730px] text-center text-[18px] text-gray-500">“Horizon is willing to change major features within the predetermined envelope to suit a client, and that flexibility was important to this owner.”
          <div className="leading-[2.5]">- BOAT International</div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default NumericalData