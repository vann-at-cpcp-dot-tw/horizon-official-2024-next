const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  stroke?: string
  width?: string | number
  [key:string]: any
}
interface TypeState {}

export default function MenuBack(props:TypeProps, ref:React.ReactNode){
  const { className, style={}, width, stroke='#002E4F' } = props
  return <Suspense fallback={null}>
    <svg className={twMerge('', className)} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{
      stroke,
      width: width ?typeof width === 'number' ?`${width}px` :width :null,
      ...style
    }}>
      <path d="M29 19L18 24.5V24.5L29 30" />
    </svg>
  </Suspense>
}
