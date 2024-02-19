"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useState, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"
import IFrameGallery from "../(templates)/IFrameGallery"
// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

interface TypeProps {
  preview: {
    previewVideo?: {
      node?: {
        mediaItemUrl: string
      }
    }
    previewImage?: {
      node?: {
        mediaItemUrl: string
      }
    }
  }
  gallery: {
    title: string
    embedUrl: string
  }[]

  [key:string]: any
}

interface TypeState {}

function scrollTo(targetSelector:string, offset=0){
  const app = (document.getElementById('app') as HTMLElement)
  const target = (document.querySelector(targetSelector) as HTMLElement)
  if( !target || !app ){
    return
  }

  window.scrollTo({
    top: target.offsetTop - (Number(app.style.paddingTop.split('px')[0])  + offset),
    behavior: 'smooth'
  })
}

function VRPreview(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const hasContent = useMemo(()=>{
    return props?.gallery?.length > 0 && (props?.preview?.previewVideo?.node?.mediaItemUrl || props?.preview?.previewImage?.node?.mediaItemUrl)
  }, [props?.gallery, props?.previewVideo?.node?.mediaItemUrl, props?.previewImage?.node?.mediaItemUrl])

  const [isOpen, setIsOpen] = useState(false)


  if( !hasContent ){
    return null
  }

  return <Suspense fallback={null}>
    <div className={twMerge('relative', className)}>
      <RatioArea className="w-full" ratio="56.25">
        <div className="absolute left-0 top-0 size-full">
          <div className="absolute left-0 top-0 z-10 flex size-full items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
          }}>
            <div>
              <div className="serif mb-4 text-center text-[24px] text-white">360° Virtual Tour</div>
              <div className="flex justify-center">
                <Button variant="outline" className={buttonStyles['rounded-outline-white-golden']}
                onClick={()=>{
                  setIsOpen(true)
                }}>Discover</Button>
              </div>
            </div>
          </div>
          {
            props?.preview?.previewVideo?.node?.mediaItemUrl
              ? <video className="absolute left-0 top-0 z-0 size-full object-cover" src={props?.preview?.previewVideo?.node?.mediaItemUrl} autoPlay playsInline muted loop></video>
              : <Image className="absolute left-0 top-0 z-0 size-full object-cover" fill={true} sizes="100vw" src={props?.image || ''} alt=""/>
          }
        </div>
      </RatioArea>

      <div className="container pb-20 pt-6 text-center">
        <div className="btn-text text-gray-700"
        onClick={()=>{
          scrollTo('#SECTION_HULLS', -10)
        }}>More Virtual Tour</div>
      </div>
    </div>

    {
      isOpen && <IFrameGallery
        list={props?.gallery}
        onClose={()=>{
          setIsOpen(false)
        }} />
    }
  </Suspense>
}

export default VRPreview