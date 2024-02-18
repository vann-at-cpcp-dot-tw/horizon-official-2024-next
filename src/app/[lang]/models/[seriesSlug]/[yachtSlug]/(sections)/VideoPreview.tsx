"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useMemo, useState, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import RatioArea from "@src/components/custom/RatioArea"
import IFrameGallery from "../(templates)/IFrameGallery"
import useDomNodeSize from "@src/hooks/useDomNodeSize"
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

function VideoPreview(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const hasContent = useMemo(()=>{
    return props?.gallery?.length > 0 && (props?.preview?.previewVideo?.node?.mediaItemUrl || props?.preview?.previewImage?.node?.mediaItemUrl)
  }, [props?.gallery, props?.previewVideo?.node?.mediaItemUrl, props?.previewImage?.node?.mediaItemUrl])
  const [isOpen, setIsOpen] = useState(false)
  const {size:previewBlock, setNode:setPreviewBlock} = useDomNodeSize()
  const [isHovering, setIsHovering] = useState(false)
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
  })

  function onMouseMove(e:React.MouseEvent<HTMLDivElement>){
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setIsHovering(true)
    setMousePos({x, y})
  }


  if( !hasContent ){
    return null
  }

  return <Suspense fallback={null}>
    <div className={twMerge('relative mb-24', className)}>
      <RatioArea className="w-full" ratio="56.25">
        <div className="size-full absolute left-0 top-0 cursor-pointer overflow-hidden">
          <div className="size-full absolute left-0 top-0 z-10 flex items-center justify-center"
          ref={setPreviewBlock}
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
          }}
          onMouseMove={onMouseMove}
          onMouseLeave={()=>{
            setIsHovering(false)
          }}
          onClick={()=>{
            setIsOpen(true)
          }}>
            <div className="size-[64px] pointer-events-none absolute flex items-center justify-center rounded-full border border-white"
            style={{
              background: 'rgba(255,255,255,0.5)',
              ...(
                isHovering
                  ?{
                    left: `50%`,
                    top: '50%',
                    width: '128px',
                    height: '128px',
                    transform: `translate(calc(-50% + ${mousePos.x - (previewBlock.width/2)}px), calc(-50% + ${mousePos.y - (previewBlock.height/2)}px))`,
                    transition: 'transform .4s cubic-bezier(0.215, 0.610, 0.355, 1.000), width 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000), height 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
                  }
                  :{
                    left: '50%',
                    top: '50%',
                    width: '64px',
                    height: '64px',
                    marginLeft: '-32px',
                    marginTop: '-32px',
                    transition: 'all 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
                  }
              )
            }}>
              <i className="bi bi-play-fill text-[24px] text-white"
              style={{
                transform: `scale(${isHovering ?2 :1})`,
                transition: 'all 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
              }}></i>
            </div>
          </div>
          {
            props?.preview?.previewVideo?.node?.mediaItemUrl
              ? <video className="size-full absolute left-0 top-0 z-0 object-cover" src={props?.preview?.previewVideo?.node?.mediaItemUrl} autoPlay playsInline muted loop></video>
              : <Image className="size-full absolute left-0 top-0 z-0 object-cover" fill={true} sizes="100vw" src={props?.image || ''} alt=""/>
          }
        </div>
      </RatioArea>
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

export default VideoPreview