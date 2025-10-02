"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useEffect, useMemo, useState, useRef } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
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
  const imgRef = useRef<HTMLImageElement>(null)
  const viewport = useWindowSize()
  const imagePlaceholder = useMemo(()=>{
    const placeholderImage = getLowestWidthUrl(props?.imageNode?.srcSet || '')
    return {
      url: placeholderImage?.url || '',
      blur: calcBlur(placeholderImage?.width || 0, '10px', viewport.width)
    }
  }, [props?.imageNode?.srcSet, viewport.width])

  // 重置載入狀態並檢查快取圖片
  useEffect(() => {
    setMediaLoaded(false)
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setMediaLoaded(true)
    }
  }, [props?.imageNode?.mediaItemUrl, props?.video])

  return <Suspense fallback={null}>
    <div className="absolute left-0 top-0 z-0 size-full">
      <AnimatePresence>
        {!mediaLoaded && (
          <motion.div
          key="blur-overlay"
          className="pointer-events-none absolute left-0 top-0 z-20 size-full"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 1,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          }}>
            <img className="absolute left-0 top-0 z-0 size-full object-cover"
            src={imagePlaceholder.url}
            style={{
              filter: `blur(${imagePlaceholder.blur})`
            }}/>
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <Loading style={{width:'120px'}} fill="var(--color-golden-900)" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <img
                  ref={imgRef}
                  className="absolute left-0 top-0 z-0 size-full object-cover"
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