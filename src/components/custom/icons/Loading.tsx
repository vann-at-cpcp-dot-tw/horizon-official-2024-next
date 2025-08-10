const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  fill?: string
  [key:string]: any
}
interface TypeState {}

export default function Loading(props:TypeProps){
  const { fill='#ffffff' } = props
  const { className, style={} } = props
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <svg
      style={{
        margin: 'auto',
        background: 'none',
        display: 'block',
        shapeRendering: 'auto',
        height: 'auto',
        ...style
      }}
      width="200px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid">
        <path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill={fill} stroke="none">
          <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform>
        </path>
      </svg>
    </div>
  </Suspense>
}