"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useMemo, useState, useEffect } from 'react'

import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import LinkWithLang from '~/components/custom/LinkWithLang'
import { Button } from '~/components/ui/button'
import buttonStyles from '~/components/ui/button.module.sass'
import { isEmpty } from '~/lib/utils'

import IFrameGallery from "../(templates)/IFrameGallery"

interface TypeProps {
  preview: {
    previewVideo?: {
      node?: {
        mediaItemUrl: string
      }
    }
    previewImage?: {
      node?: ImageNode
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

function VRPreview(props:TypeProps){
  const { className } = props
  const { __ } = useTranslate()
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
              <div className="serif mb-4 text-center text-[24px] text-white">{ __('360° Virtual Tour') }</div>
              <div className="flex justify-center">
                <Button variant="outline" className={buttonStyles['rounded-outline-white-golden']}
                onClick={()=>{
                  setIsOpen(true)
                }}>
                  { __('Discover') }
                </Button>
              </div>
            </div>
          </div>
          {
            props?.preview?.previewVideo?.node?.mediaItemUrl
              ? <video className="absolute left-0 top-0 z-0 size-full object-cover" src={props?.preview?.previewVideo?.node?.mediaItemUrl} autoPlay playsInline muted loop></video>
              : <img className="absolute left-0 top-0 z-0 size-full object-cover"
              src={props?.preview?.previewImage?.node?.mediaItemUrl}
              srcSet={props?.preview?.previewImage?.node?.srcSet}
              sizes="100vw"/>
          }
        </div>
      </RatioArea>

      <div className="container pb-20 pt-3 text-center lg:pt-6">
        <div className="btn-text text-gray-700"
        onClick={()=>{
          scrollTo('#SECTION_HULLS', -10)
        }}>{ __('More Virtual Tour') }</div>
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