"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@root/src/components/custom/RatioArea"
// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
import useWindowSize from "@root/src/hooks/useWindowSize"

import milestonePic from '@root/public/assets/img/bg_about_milestone.jpg'

interface TypeProps {
  lang: string
  [key:string]: any
}
interface TypeState {}

function Milestone(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  const viewport = useWindowSize()
  const { className } = props

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="relative bg-minor-900">
        <RatioArea ratio={viewport.width && viewport.width >= 992 ?'39' :'56.25'}>
          <div className="absolute left-0 top-0 z-10 flex size-full items-center justify-center p-5">
            <div className="flex flex-col items-center text-white">
              <LinkWithLang className="serif mb-2 text-[32px] italic" href="/about/horizon/milestone" lang={props.lang}>Milestone</LinkWithLang>
              <LinkWithLang className="btn-text btn-opacity" href="/about/horizon/milestone" lang={props.lang}>Discover</LinkWithLang>
            </div>
          </div>

          <Image className="absolute left-0 top-0 z-0 size-full object-cover"
          src={milestonePic}
          fill={true}
          placeholder="blur"
          alt="" />
        </RatioArea>
      </div>
    </div>
  </Suspense>
}

export default Milestone