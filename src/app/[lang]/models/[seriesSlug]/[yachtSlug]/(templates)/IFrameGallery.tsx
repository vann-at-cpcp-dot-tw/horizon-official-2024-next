"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useState, useEffect } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import { useDomNodeSize } from 'vanns-common-modules/dist/use/react'

import ContentLightbox from '~/components/custom/ContentLightbox'
import Loading from '~/components/custom/icons/Loading'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { calcSizeByRatio } from '~/lib/utils'

interface TypeProps {
  list: {
    title: string
    embedUrl: string
  }[]
  onClose: Function
  background?: string
  iframeRatio?: number, // Number((16/9).toFixed(2))
  [key:string]: any
}
interface TypeState {}

function IFrameGallery(props:TypeProps, ref:React.ReactNode){

  const [activeIndex, setActiveIndex] = useState(0)
  const {size:contentWrapperSize, setNode:setContentWrapperNode} = useDomNodeSize()
  const [iframeSize, setIframeSize] = useState<{w:string|number, h:string|number}>({
    w: '100%',
    h: '100%',
  })

  useEffect(()=>{
    document.body.classList.add('lb-open')
    return ()=>{
      document.body.classList.remove('lb-open')
    }
  }, [])

  useEffect(()=>{
    if( !props.iframeRatio || !contentWrapperSize.width){
      return
    }

    const widthBasedSize = calcSizeByRatio({w:contentWrapperSize.width, h:null, ratio:props.iframeRatio})
    const heightBasedSize = calcSizeByRatio({w:null, h:contentWrapperSize.height, ratio:props.iframeRatio})

    // 如果寬撐滿時高會超出，那就改成高撐滿模式
    if( widthBasedSize?.h && (widthBasedSize?.h > contentWrapperSize.height) ){
      setIframeSize(heightBasedSize || iframeSize)
    }else{
      setIframeSize(widthBasedSize || iframeSize)
    }

  }, [contentWrapperSize.width, contentWrapperSize.height, props.iframeRatio])

  return <Suspense fallback={null}>

    <ContentLightbox
    isFullScreen
    theme="dark"
    stickyHeader={<div className="px-5 pb-5 lg:px-10 lg:pb-5">
      <div className="w-full overflow-auto">
        <div className="flex !flex-nowrap items-center">
          {
            props?.list?.map((node, index)=>{
              return <div className="flex flex-none !flex-nowrap items-center" key={index}
              style={{
                marginLeft: index === 0 ?'auto' :'0',
                marginRight: index+1 === props?.list?.length ?'auto' :'0'
              }}>
                <div className={`btn serif text-[15px] leading-[1.2] text-white hover:opacity-100 lg:text-[18px] ${activeIndex === index ?'opacity-100' :'opacity-50'}`}
              onClick={()=>{
                setActiveIndex(index)
              }}>{ node?.title }</div>
                {
                  index+1 < props?.list?.length && <div className="px-2.5">
                    {/* <i className="bi bi-dot text-white"></i> */}
                    <div className="size-1 rounded-full bg-white"></div>
                  </div>
                }
              </div>
            })
          }
        </div>
      </div>
    </div>}
    onClose={()=>{
      props.onClose()
    }}>
      <div className="relative flex grow flex-col justify-center px-5 pb-5 lg:px-10 lg:pb-10">

        <div className="relative size-full" ref={setContentWrapperNode}>

          <div className="absolute left-0 top-0 z-0 flex size-full items-center justify-center">
            <Loading style={{width:'120px'}} />
          </div>

          <iframe className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          src={props.list?.[activeIndex]?.embedUrl}
          style={{
            width: typeof iframeSize.w === 'string' ?iframeSize.w :`${iframeSize.w}px`,
            height: typeof iframeSize.h === 'string' ?iframeSize.h :`${iframeSize.h}px`,
          }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share">
          </iframe>

        </div>
      </div>
    </ContentLightbox>
  </Suspense>
}

export default IFrameGallery