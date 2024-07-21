"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'

import LinkWithLang from "~/components/custom/LinkWithLang"
import { isEmpty } from '~/lib/utils'
import Lightbox from "./Lightbox"
import { useStore } from "~/store"

interface IProps {
  id: string
  title?: string | React.ReactNode
  confirm?: string | React.ReactNode
  className?: string
  children?: string | React.ReactNode
}

interface IState {
  [key:string]: any
}

export default function Alert(props:IProps, ref:React.ReactNode){
  const store = useStore()
  const { id, className, title, children, confirm } = props ?? {}

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <Lightbox id={id}>
        <div>
          <div className="text-center text-[18px] font-900 text-[#4A4A4A]" style={{fontFamily:'sans-serif'}}>{title}</div>
          <div className="py-4">
            { children }
          </div>
          <div className="flex justify-center">
            <div className="btn-text text-center text-[18px] font-700 text-[#4A4A4A]"
            style={{fontFamily:'sans-serif'}}
            onClick={()=>{
              store.lightboxClose(id)
            }}>{confirm || 'OK'}</div>
          </div>
        </div>
      </Lightbox>
    </div>
  </Suspense>
}
