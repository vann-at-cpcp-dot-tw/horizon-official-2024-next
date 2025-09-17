"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useRef, useEffect, useState } from 'react'

import { motion } from "framer-motion"

import { useStore } from '~/store'

interface TypeProps {
  imageNode?: React.ReactNode
  video?: string
  title?: string
  achievements: {
    image?: {
      node?: {
        mediaItemUrl?: string
        srcSet?: string
      }
    }
  }[]
}
interface TypeState {}

function KV(props:TypeProps){
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
      <motion.div className="absolute left-1/2 top-0 size-full -translate-x-1/2 items-center justify-center overflow-hidden p-5"
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
            ? <video ref={videoRef} className="absolute left-0 top-0 z-0 size-full object-cover" src={props?.video} playsInline muted loop></video>
            : <>{ props?.imageNode || ''}</>
        }

        <div className="relative z-10 flex h-full items-center justify-center"
        style={{
          maxHeight: `calc(100% - ${store.headerHeight}px)`
        }}>
          <div className="serif text-center text-[36px] font-300 text-white lg:text-[49px]"
          style={{
            letterSpacing: '0.277em',
          }}>
            { props?.title }
          </div>
        </div>

        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2">
          <div className="animate__animated animate__infinite animate__float ">
            <i className="bi bi-mouse text-[28px] text-[#FAF8F5] lg:text-[32px]"></i>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 hidden lg:block">
          {
            props?.achievements?.map((node, index)=>{
              return <img key={index} src={node?.image?.node?.mediaItemUrl} srcSet={node?.image?.node?.srcSet} />
            })
          }
        </div>
      </motion.div>
    </div>
  </Suspense>
}

export default KV