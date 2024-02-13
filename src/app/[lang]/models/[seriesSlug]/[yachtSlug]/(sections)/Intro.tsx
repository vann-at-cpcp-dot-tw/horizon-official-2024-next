const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

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
    <div className={twMerge('', className)}>
      <div className="container mb-24">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="serif mb-4 text-center text-[32px] text-golden-900">{props.title}</div>
          <div className="text-[15px] leading-[1.6] text-gray-700">{props.description}</div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default Intro