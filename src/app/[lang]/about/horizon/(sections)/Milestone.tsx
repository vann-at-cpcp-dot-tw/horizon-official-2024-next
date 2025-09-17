"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useWindowSize } from "vanns-common-modules/dist/use/react"
import { useTranslate } from "vanns-common-modules/dist/use/react"

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import milestonePic from '~~/public/assets/img/bg_about_milestone.jpg'

interface TypeProps {
  lang: string
  [key:string]: any
}
interface TypeState {}

function Milestone(props:TypeProps){
  const { __ } = useTranslate()
  const viewport = useWindowSize()
  const { className } = props

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="relative bg-minor-900">
        <RatioArea ratio={viewport.width && viewport.width >= 992 ?'39' :'56.25'}>
          <div className="absolute left-0 top-0 z-10 flex size-full items-center justify-center p-5">
            <div className="flex flex-col items-center text-white">
              <LinkWithLang className="serif mb-2 text-[32px] italic" href="/about/horizon/milestone" lang={props.lang}>
                { __('Milestone') }
              </LinkWithLang>
              <LinkWithLang className="btn-text btn-opacity" href="/about/horizon/milestone" lang={props.lang}>
                { __('Discover') }
              </LinkWithLang>
            </div>
          </div>

          <Image className="absolute left-0 top-0 z-0 size-full object-cover"
          src={milestonePic}
          fill={true}
          // placeholder="blur"
          alt="" />
        </RatioArea>
      </div>
    </div>
  </Suspense>
}

export default Milestone