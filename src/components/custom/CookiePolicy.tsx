"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useEffect, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { useParams } from "next/navigation"

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  [key:string]: any
}

interface TypeState {}

function CookiePolicy(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const params = useParams()
  const { lang } = params
  const [isAccepted, setIsAccepted] = useState(true)

  useEffect(()=>{
    if( window.localStorage.getItem("cookiePolicyAccepted") ){
      setIsAccepted(true)
    }else{
      setIsAccepted(false)
    }
  }, [])

  return <Suspense fallback={null}>
    <div className={twMerge(`${isAccepted ?'hidden' :'block'}`, className)}>
      <div className="fixed bottom-5 left-5 h-auto w-full max-w-[280px] rounded bg-[#FAF8F5] p-4"
      style={{
        zIndex:'999',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'
      }}>
        <div className="mb-2 text-[13px] text-[#4A4A4A]">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
        </div>
        <div className="flex flex-nowrap items-center justify-between">
          <div className="text-[13px] text-[#B6B6B6] underline">
            <LinkWithLang href="/privacy-policy" lang={lang}>Learn More our cookie policy</LinkWithLang>
          </div>
          <div className="btn font-900 text-[#040D1E] underline"
          onClick={()=>{
            setIsAccepted(true)
            window.localStorage.setItem("cookiePolicyAccepted", "1")
          }}>Accept</div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default CookiePolicy