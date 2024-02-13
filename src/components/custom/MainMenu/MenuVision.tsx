const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { Suspense, useEffect, useState } from 'react'
import { isEmpty } from '@src/lib/helpers'
import { motion } from 'framer-motion'
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

function MenuVision(props:TypeProps, ref:React.ReactNode){
  const [mediaLoaded, setMediaLoaded] = useState(false)

  return <Suspense fallback={null}>
    <div className="absolute left-0 top-0 z-0 h-full w-full">

      {
        !mediaLoaded && <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <Loading style={{width:'120px'}} fill="var(--color-golden-900)" />
        </div>
      }

      <div className="absolute left-0 top-0 z-0 h-full w-full">
        <motion.div className="absolute left-0 top-0 z-10 h-full w-full"
        variants={{
          enter: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 2,
              delay: 0.25,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
          exit: {
            opacity: 0,
            y: 50,
            transition: {
              duration: 0.5,
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
        className="absolute left-0 top-0 z-0 h-full w-full"
        variants={variants}
        initial="exit"
        exit="exit"
        animate={mediaLoaded ?'enter' :'exit'}>
          {
            props?.video
              ? <video className="absolute left-0 top-0 z-0 h-full w-full object-cover"
              src={props?.video}
              autoPlay
              playsInline
              muted
              loop
              onCanPlay={()=>{
                setMediaLoaded(true)
              }}></video>
              : <Image className="absolute left-0 top-0 z-0 h-full w-full object-cover" fill={true} src={props?.image} alt=""
              onLoad={()=>{
                setMediaLoaded(true)
              }} />
          }
        </motion.div>
      </div>
    </div>

  </Suspense>
}

export default MenuVision