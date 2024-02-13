"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@src/store'
import { useWindowSize } from 'react-use'
import { twMerge } from 'tailwind-merge'
import { isEmpty, numberWithCommas } from '@src/lib/helpers'
import { animate } from "framer-motion"
import dynamic from "next/dynamic"
const AniCounter = dynamic(() => import('@src/components/custom/dynamic/AniCounter'), {ssr: false})

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
    <div className={twMerge('container', className)}>
      <div className="container mb-14">
        <div className="row flex-nowrap justify-center">
          <div className="col-auto">
            <div className="serif flex !flex-nowrap items-end px-2 text-minor-900">
              <AniCounter className="text-[48px] italic" from={0} to={Number(props?.yachtsBuild)}/>
              <span className="serif text-[48px] italic">+&nbsp;</span>
              <span className="serif relative -top-4 block text-[22px]">yachts build</span>
            </div>
          </div>
          <div className="col-auto">
            <div className="serif flex !flex-nowrap items-end px-2 text-minor-900">
              <AniCounter className="text-[48px] italic" from={0} to={Number(props?.overSqftArea)}/>
              <span className="serif text-[48px] italic">sqft&nbsp;</span>
              <span className="serif relative -top-4 block text-[22px]">area</span>
            </div>
          </div>
        </div>
        <div className="row flex-nowrap justify-center">
          <div className="col-auto">
            <div className="serif flex !flex-nowrap items-end px-2 text-minor-900">
              <AniCounter className="text-[48px] italic" from={0} to={Number(props?.iso9001Certified)}/>
              <span className="serif relative -top-4 block text-[22px]">&nbsp;ISO 9001 certified  shipyard</span>
            </div>
          </div>
          <div className="col-auto">
            <div className="serif flex !flex-nowrap items-end px-2 text-minor-900">
              <AniCounter className="text-[48px] italic" from={0} to={Number(props?.employees)}/>
              <span className="serif text-[48px] italic">+&nbsp;</span>
              <span className="serif relative -top-4 block text-[22px]">dedicated employees</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="serif mx-auto w-full max-w-[730px] text-center text-[18px] text-gray-500">“The top 10 boat manufacturers with excellent sales performance emerged, along with the world&apos;s fifth-largest custom yacht manufacturer.”<br/><br/>- ShowBoats-Global OrderBook</div>
      </div>
    </div>
  </Suspense>
}

export default NumericalData