"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useEffect, useMemo, useState } from 'react'

import { motion } from 'framer-motion'
import { useWindowSize } from "vanns-common-modules/dist/use/react"

import { isEmpty, getLowestWidthUrl, calcBlur } from '~/lib/utils'

import Loading from "../icons/Loading"

const variants = {
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 4,
      ease: [0.215, 0.610, 0.355, 1.000]
    }
  },
  exit: {
    opacity: 0,
    scale: 1.15,
    transition: {
      duration: 1,
      ease: [0.215, 0.610, 0.355, 1.000]
    }
  },
}

interface TypeProps {
  video: string
  imageNode: ImageNode
  children?: React.ReactNode
}

interface TypeState {}

function MenuVision(props:TypeProps){
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const viewport = useWindowSize()
  const imagePlaceholder = useMemo(()=>{
    const placeholderImage = getLowestWidthUrl(props?.imageNode?.srcSet || '')
    return {
      url: placeholderImage?.url || '',
      blur: calcBlur(placeholderImage?.width || 0, '10px', viewport.width)
    }
  }, [props?.imageNode?.srcSet, viewport.width])

  // 只檢查原圖載入狀態
  useEffect(() => {
    // 如果是影片或沒有圖片URL，直接返回
    if (props?.video || !props?.imageNode?.mediaItemUrl) {
      setMediaLoaded(false)
      return
    }

    // 重置載入狀態
    setMediaLoaded(false)

    let img: HTMLImageElement | null = new Image()
    let isCancelled = false

    // 先綁定事件處理器
    const handleLoad = () => {
      if (!isCancelled) {
        setMediaLoaded(true)
      }
    }

    const handleError = () => {
      if (!isCancelled) {
        // 載入失敗也設為 true，避免一直顯示 loading
        setMediaLoaded(true)
      }
    }

    img.onload = handleLoad
    img.onerror = handleError

    // 再設置 src
    img.src = props.imageNode.mediaItemUrl

    // 使用 setTimeout 避免 race condition，檢查是否已從快取載入
    setTimeout(() => {
      if (!isCancelled && img && img.complete && img.naturalWidth > 0) {
        setMediaLoaded(true)
      }
    }, 0)

    // Cleanup 函數
    return () => {
      isCancelled = true
      if (img) {
        img.onload = null
        img.onerror = null
        img = null
      }
    }
  }, [props?.video, props?.imageNode?.mediaItemUrl])

  return <Suspense fallback={null}>
    <div className="absolute left-0 top-0 z-0 size-full">
      {
        <motion.div className="pointer-events-none absolute left-0 top-0 z-20 size-full"
        variants={{
          enter: {
            opacity: 1,
            transition: {
              duration: 0,
              // delay: 0.25,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 1,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
        }}
        initial="exit"
        exit="exit"
        animate={!mediaLoaded ?'enter' :'exit'}>
          <img className="absolute left-0 top-0 z-0 size-full object-cover"
          src={imagePlaceholder.url}
          style={{
            filter: `blur(${imagePlaceholder.blur})`
          }}/>
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <Loading style={{width:'120px'}} fill="var(--color-golden-900)" />
          </div>
        </motion.div>
      }

      <div className="absolute left-0 top-0 z-0 size-full">
        <motion.div className="absolute left-0 top-0 z-10 size-full"
        variants={{
          enter: {
            opacity: 1,
            transition: {
              duration: 2,
              delay: 0.25,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
        }}
        initial="exit"
        exit="exit"
        animate={mediaLoaded ?'enter' :'exit'}>
          { props?.children }
        </motion.div>

        <motion.div
        className="absolute left-0 top-0 z-0 size-full"
        variants={variants}
        initial="exit"
        exit="exit"
        animate={mediaLoaded ?'enter' :'exit'}>
          {
            props?.video
              ? <video className="absolute left-0 top-0 z-0 size-full object-cover"
              src={props?.video}
              autoPlay
              playsInline
              muted
              loop
              onCanPlay={()=>{
                setMediaLoaded(true)
              }}></video>
              : <>
                {
                  <img className="absolute left-0 top-0 z-0 size-full object-cover"
                  src={props?.imageNode?.mediaItemUrl || ''}
                  srcSet={props?.imageNode?.srcSet || ''}
                  sizes="100vw"
                  onLoad={()=>{
                    setMediaLoaded(true)
                  }} />
                }
              </>
          }
        </motion.div>
      </div>
    </div>

  </Suspense>
}

export default MenuVision