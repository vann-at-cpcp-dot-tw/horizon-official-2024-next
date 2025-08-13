"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useState, useEffect } from 'react'

import { motion } from "framer-motion"
import Image from "next/image"
import { twMerge } from 'tailwind-merge'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { useStore } from '~/store'

interface TypeProps {
  image: string
  placeholder?: string
  [key:string]: any
}
interface TypeState {}

function CoverImage(props:TypeProps){
  const store = useStore()
  const { className } = props
  const [KVEnterAble, setKVEnterAble] = useState(false)
  useEffect(()=>{
    if( store.isLoadingScreenFadedOut ){
      setKVEnterAble(true)
    }
  }, [store.isLoadingScreenFadedOut])
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
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
        <Image className="object-cover"
      src={props?.image}
      fill={true}
      sizes="100vw"
      alt=""
      placeholder="blur"
      // blurDataURL={props?.placeholder}
      />
      </motion.div>
    </div>
  </Suspense>
}

export default CoverImage