"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useMemo, useState, useEffect } from 'react'

import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useDomNodeSize } from 'vanns-common-modules/dist/use/react'

import LinkWithLang from '~/components/custom/LinkWithLang'
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

function VideoPreview(props:TypeProps){
  const { className } = props
  const hasContent = useMemo(()=>{
    return props?.gallery?.length > 0 && (props?.preview?.previewVideo?.node?.mediaItemUrl || props?.preview?.previewImage?.node?.mediaItemUrl)
  }, [
    props?.gallery,
    props?.preview?.previewVideo?.node?.mediaItemUrl,
    props?.preview?.previewImage?.node?.mediaItemUrl
  ])
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
    <div className={twMerge('relative', className)}>
      <RatioArea className="w-full" ratio="56.25">
        <div className="absolute left-0 top-0 size-full cursor-pointer overflow-hidden">
          <div className="absolute left-0 top-0 z-10 flex size-full items-center justify-center"
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
            <div className="pointer-events-none absolute flex size-[64px] items-center justify-center rounded-full border"
            style={{
              ...(
                isHovering
                  ?{
                    left: `50%`,
                    top: '50%',
                    width: '128px',
                    height: '128px',
                    background: 'rgba(181,135,60,0.5)',
                    borderColor: 'var(--color-golden-900)',
                    transform: `translate(calc(-50% + ${mousePos.x - (previewBlock.width/2)}px), calc(-50% + ${mousePos.y - (previewBlock.height/2)}px))`,
                    transition: 'transform .4s cubic-bezier(0.215, 0.610, 0.355, 1.000), width 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000), height 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
                  }
                  :{
                    left: '50%',
                    top: '50%',
                    width: '64px',
                    height: '64px',
                    background: 'rgba(255,255,255,0.5)',
                    borderColor: 'white',
                    marginLeft: '-32px',
                    marginTop: '-32px',
                    transition: 'all 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
                  }
              )
            }}>
              <i className="bi bi-play-fill text-[24px] text-white"
              style={{
                transform: `scale(${isHovering ?1.33 :1})`,
                transition: 'all 1.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
              }}></i>
            </div>
          </div>
          {
            props?.preview?.previewVideo?.node?.mediaItemUrl
              ? <video className="absolute left-0 top-0 z-0 size-full object-cover" src={props?.preview?.previewVideo?.node?.mediaItemUrl} autoPlay playsInline muted loop></video>
              : <img
                className="absolute left-0 top-0 z-0 size-full object-cover"
                src={props?.preview?.previewImage?.node?.mediaItemUrl}
                srcSet={props?.preview?.previewImage?.node?.srcSet}
                sizes="100vw" />
          }
        </div>
      </RatioArea>
    </div>

    {
      isOpen && <IFrameGallery
        iframeRatio={1.78}
        list={props?.gallery}
        onClose={()=>{
          setIsOpen(false)
        }} />
    }
  </Suspense>
}

export default VideoPreview