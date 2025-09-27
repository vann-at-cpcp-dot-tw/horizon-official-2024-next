"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useRef, useState, useEffect } from 'react'

import { motion } from "framer-motion"
import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import { useWindowSize } from "vanns-common-modules/dist/use/react"

import { useStore } from '~/store'

interface TypeProps {
  video: string
  image: ImageSrc
  [key:string]: any
}
interface TypeState {}

function KV(props:TypeProps){
  const viewport = useWindowSize()
  const { className } = props
  const store = useStore()
  const videoRef = useRef(null)
  const [KVEnterAble, setKVEnterAble] = useState(false)

  useEffect(()=>{
    if( !videoRef.current ){ return }
    if( store.isLoadingScreenFadedOut ){
      (videoRef.current as HTMLVideoElement).play()
    }
  }, [store.isLoadingScreenFadedOut, videoRef.current])

  useEffect(()=>{
    if( store.isLoadingScreenFadedOut ){
      setKVEnterAble(true)
    }
  }, [store.isLoadingScreenFadedOut])

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <RatioArea className="mb-6 lg:mb-12" ratio={viewport.width && viewport.width >= 992 ?'42.85' :'56.25'}>
        <motion.div className="absolute left-1/2 top-0 size-full -translate-x-1/2"
        variants={{
          enter: {
            top: '0%',
            width: '100%',
            transition: {
              duration: 1.6,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
          exit: {
            top: '50%',
            width: '50%',
            transition: {
              duration: 0.5,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          }
        }}
        initial="exit"
        exit="exit"
        animate={KVEnterAble ?'enter' :'exit'}>
          {
            props?.video
              ?<video ref={videoRef} className="absolute left-0 top-0 z-0 size-full object-cover" src={props?.video} playsInline muted loop autoPlay></video>
              :<img className="absolute left-0 top-0 z-0 size-full object-cover"
              src={props?.image?.src}
              srcSet={props?.image?.srcSet}
              sizes="100vw"/>
          }
        </motion.div>
      </RatioArea>
    </div>
  </Suspense>
}

export default KV