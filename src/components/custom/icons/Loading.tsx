const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  fill?: string
  [key:string]: any
}
interface TypeState {}

function Loading(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
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

export default Loading