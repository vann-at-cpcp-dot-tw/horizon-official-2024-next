"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useEffect, useMemo, useState } from 'react'

import { motion } from 'framer-motion'
import Image from "next/image"
import { useImageBlurHashes } from 'vanns-common-modules/dist/use/next'

import { isEmpty } from '~/lib/utils'

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
  image: string
  children?: React.ReactNode
}

interface TypeState {}

function MenuVision(props:TypeProps){
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const images = useMemo(()=>{
    return [props?.image]
  }, [props.image])
  const imageBlurHashes = useImageBlurHashes(images)

  return <Suspense fallback={null}>
    <div className="absolute left-0 top-0 z-0 size-full">

      {
        <motion.div className="pointer-events-none absolute left-0 top-0 z-20 size-full"
        variants={{
          enter: {
            opacity: 1,
            transition: {
              duration: 0,
              delay: 0.25,
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
          { imageBlurHashes[0] && <Image className="absolute left-0 top-0 z-0 size-full object-cover" alt="" src={imageBlurHashes[0]} fill={true} /> }
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
                  <Image className="absolute left-0 top-0 z-0 size-full object-cover"
                  fill={true}
                  src={props?.image}
                  placeholder="blur"
                  // blurDataURL={imageBlurHashes[0]}
                  alt=""
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