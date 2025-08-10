"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useEffect } from 'react'

import { animate } from "framer-motion"
import dynamic from "next/dynamic"
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { useWindowSize } from "vanns-common-modules/dist/use/react"
import { useTranslate } from "vanns-common-modules/dist/use/react"

import { isEmpty, numberFormat } from '~/lib/utils'
import { useStore } from '~/store'
const AniCounter = dynamic(() => import('~/components/custom/dynamic/AniCounter'))

interface TypeProps {
  yachtsBuild?: string | number
  overSqftArea?: string | number
  iso9001Certified?: string | number
  employees?: string | number
  [key:string]: any
}

interface TypeState {}

function NumericalData(props:TypeProps){
  const { className } = props
  const { __ } = useTranslate()

  return <Suspense fallback={null}>
    <div className={twMerge('container lg:mb-[120px] mb-12', className)}>
      <div className="container mb-6 lg:mb-14">
        <div className="row justify-center">
          <div className="col-12 py-1 lg:col-auto lg:py-0">
            <div className="serif flex !flex-nowrap items-end justify-center px-2 text-minor-900">
              <AniCounter className="text-[32px] italic lg:text-[48px]" from={0} to={Number(props?.yachtsBuild)}/>
              <span className="serif text-[32px] italic lg:text-[48px]">+&nbsp;</span>
              <span className="serif relative -top-2 block text-[17px] lg:-top-4 lg:text-[22px]">{ __('yachts build') }</span>
            </div>
          </div>
          <div className="col-12 py-1 lg:col-auto lg:py-0">
            <div className="serif flex !flex-nowrap items-end justify-center px-2 text-minor-900">
              <AniCounter className="text-[32px] italic lg:text-[48px]" from={0} to={Number(props?.overSqftArea)}/>
              <span className="serif text-[32px] italic lg:text-[48px]">&nbsp;{ __('sqft') }&nbsp;</span>
              <span className="serif relative -top-2 block text-[17px] lg:-top-4 lg:text-[22px]">{ __('area') }</span>
            </div>
          </div>
        </div>
        <div className="row justify-center">
          <div className="col-12 py-1 lg:col-auto lg:py-0">
            <div className="serif flex !flex-nowrap items-end justify-center px-2 text-minor-900">
              <AniCounter className="text-[32px] italic lg:text-[48px]" from={0} to={Number(props?.iso9001Certified)}/>
              <span className="text-[32px] lg:text-[48px]">&nbsp;</span>
              <span className="serif relative -top-2 block text-[17px] lg:-top-4 lg:text-[22px]">{ __('ISO 9001 certified shipyard') }</span>
            </div>
          </div>
          <div className="col-12 py-1 lg:col-auto lg:py-0">
            <div className="serif flex !flex-nowrap items-end justify-center px-2 text-minor-900">
              <AniCounter className="text-[32px] italic lg:text-[48px]" from={0} to={Number(props?.employees)}/>
              <span className="serif text-[32px] italic lg:text-[48px]">+&nbsp;</span>
              <span className="serif relative -top-2 text-[17px] lg:-top-4 lg:text-[22px]">{ __('dedicated employees') }</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="serif mx-auto w-full max-w-[730px] text-center text-[18px] text-gray-500">“{ __('Horizon is willing to change major features within the predetermined envelope to suit a client, and that flexibility was important to this owner.') }”
          <div className="leading-[2.5]">- { __('BOAT International') }</div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default NumericalData