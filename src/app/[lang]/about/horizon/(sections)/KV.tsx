"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { Suspense } from 'react'
import { useStore } from '@src/store'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'

interface TypeProps {
  background: string
  description: string
  heroImageNode: React.ReactNode
  [key:string]: any
}

interface TypeState {}

function KV(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const { className } = props

  return <Suspense fallback={null}>
    <div className={twMerge('relative min-h-screen w-full flex flex-col', className)}
    style={{
      marginTop: `-${store.headerHeight}px`
    }}>
      <video className="absolute left-0 top-0 z-0 size-full object-cover" autoPlay playsInline muted loop
      src={`${props?.background}`}></video>

      <div className="min-size-full relative z-10 my-auto h-auto px-5">
        <div style={{
          padding: `${store.headerHeight}px 0px`,
        }}>
          <div className="relative mx-auto mb-8 w-full max-w-[956px] xl:w-[69%] xl:max-w-[1920px]">
            { props.heroImageNode }
          </div>
          <div className="relative mx-auto w-full max-w-[600px]">
            <div className="serif text-center text-[20px] text-white lg:leading-[1.8]">{props?.description}</div>
          </div>
        </div>
      </div>

    </div>
  </Suspense>
}

export default KV