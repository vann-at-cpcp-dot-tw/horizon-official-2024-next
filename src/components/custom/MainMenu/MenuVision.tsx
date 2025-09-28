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
  isImagePreloaded?: (srcSet: string) => boolean
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

  // 檢查 blur 圖是否已預載
  const isBlurImagePreloaded = props?.isImagePreloaded?.(props?.imageNode?.srcSet || '') || false

  // 只檢查原圖載入狀態
  useEffect(() => {
    // 重置載入狀態
    setMediaLoaded(false)

    // 如果是影片或沒有圖片URL，直接返回
    if (props?.video || !props?.imageNode?.mediaItemUrl) {
      return
    }

    // 只檢查原圖載入狀態
    const img = new Image()
    img.onload = () => setMediaLoaded(true)
    img.src = props.imageNode.mediaItemUrl

    // 如果圖片已經載入（來自快取）
    if (img.complete) {
      setMediaLoaded(true)
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
        animate={(!mediaLoaded && !isBlurImagePreloaded) ?'enter' :'exit'}>
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

      {/* 預載的 blur 圖，立即顯示 */}
      {
        isBlurImagePreloaded && !mediaLoaded && <motion.div className="absolute left-0 top-0 z-[15] size-full"
        variants={{
          enter: {
            opacity: 1,
            transition: {
              duration: 0.2,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
        }}
        initial="enter"
        exit="exit"
        animate={mediaLoaded ? 'exit' : 'enter'}>
          <img className="absolute left-0 top-0 z-0 size-full object-cover"
          src={imagePlaceholder.url}
          style={{
            filter: `blur(${imagePlaceholder.blur})`
          }}/>
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