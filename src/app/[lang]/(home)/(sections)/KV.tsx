"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { Suspense, useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@src/store'
import { useWindowSize } from 'react-use'
import { isEmpty } from '@src/lib/helpers'
import { motion } from "framer-motion"
import ImageAutoPlaceholder from "@root/src/components/custom/ImageWithPlaceholder"

interface TypeProps {
  imageNode?: React.ReactNode
  video?: string
  title?: string
}
interface TypeState {}

function KV(props:TypeProps, ref:React.ReactNode){
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
    <div className="relative h-screen w-full overflow-hidden"
    style={{
      maxHeight: `calc(100dvh - ${store.headerHeight}px)`,
    }}>
      <motion.div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 items-center justify-center overflow-hidden p-5"
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
            ? <video ref={videoRef} className="absolute left-0 top-0 z-0 h-full w-full object-cover" src={props?.video} playsInline muted loop></video>
            : <>{ props?.imageNode || ''}</>
        }
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="serif text-center text-[49px] font-300 text-white"
          style={{
            letterSpacing: '0.277em',
          }}>{props?.title}</div>
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[13px] text-[#FAF8F5]">Scroll Down</div>
        <div className="absolute bottom-5 right-5">
          <Image src={`${BASE_PATH}/assets/img/icon_sybass.svg`} width={108} height={40} alt=""/>
        </div>
      </motion.div>
    </div>
  </Suspense>
}

export default KV