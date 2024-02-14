"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useRef, useState, useEffect } from 'react'
import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import RatioArea from "@src/components/custom/RatioArea"
import { motion } from "framer-motion"
import { useStore } from '@src/store'

interface TypeProps {
  video: string
  image: string
  [key:string]: any
}
interface TypeState {}

function KV(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
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
      <RatioArea className="mb-12" ratio="42.85">
        <motion.div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2"
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
              ?<video ref={videoRef} className="absolute left-0 top-0 z-0 h-full w-full object-cover" src={props?.video} playsInline muted loop autoPlay></video>
              :<Image className="absolute left-0 top-0 z-0 h-full w-full object-cover" fill={true} src={props?.image || ''} alt=""/>
          }
        </motion.div>
      </RatioArea>
    </div>
  </Suspense>
}

export default KV