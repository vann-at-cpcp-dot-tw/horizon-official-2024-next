
"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useEffect, useState } from 'react'

import { motion } from "framer-motion"
import { twMerge } from 'tailwind-merge'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import { useIsClient } from 'vanns-common-modules/dist/use/react'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  children: React.ReactNode
  animate?: boolean | string
  duration?: number
  delay?: number
  viewport?: {[key:string]: any}
  [key:string]: any
}
interface TypeState {}

function OverflowContent(props:TypeProps){

  const viewport = useWindowSize()
  // const isClient = useIsClient()

  return (<Suspense fallback={null}>
    <div className="relative overflow-hidden">
      <div className="relative opacity-0">{ props.children }</div>
      {
        viewport.height && <motion.div className="absolute left-0 top-0 size-full"
        variants={{
          enter: {
            top: '0%'
          },
          exit: {
            top: '100%'
          }
        }}
        initial="exit"
        animate={typeof props?.animate === 'boolean' ?( props?.animate ?'enter' :'exit') :false}
        whileInView={typeof props?.animate !== 'boolean' ?'enter' :''}
        viewport={props.viewport || {
          margin: `0px 0px -${viewport.height / 4}px 0px` as any
        }}
        transition={{
          duration: props?.duration || 1.6,
          delay: props?.delay || 0,
          ease: [0.215, 0.610, 0.355, 1.000]
        }}>
          { props.children }
        </motion.div>
      }
    </div>
  </Suspense>)
}

export default OverflowContent