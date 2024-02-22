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
  title: string
  description: string
  [key:string]: any
}
interface TypeState {}

function Intro(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('lg:mb-24 mb-10', className)}>
      <div className="container">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="serif text-center text-[28px] text-golden-900 lg:mb-4 lg:text-[32px]">{props.title}</div>
          <div className="text-[15px] leading-[1.6] text-gray-700">{props.description}</div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default Intro