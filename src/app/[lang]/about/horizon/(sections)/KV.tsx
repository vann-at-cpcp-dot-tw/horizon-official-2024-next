"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { Suspense, useRef } from 'react'
import { useStore } from '@src/store'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { motion, useInView } from "framer-motion"
import OverflowContent from "@src/components/custom/OverflowContent"
import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  background: string
  description: string
  heroImageNode: React.ReactNode
  [key:string]: any
}

interface TypeState {}

function KV(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const { className } = props
  const viewport = useWindowSize()
  const animateAnchorRef = useRef(null)
  const animateAnchorIsInView = useInView(animateAnchorRef, {
    margin: `0px 0px -${(viewport.height || 0)/4}px 0px`
  })

  return <Suspense fallback={null}>
    <div className={twMerge('relative min-h-screen w-full flex flex-col', className)}
    style={{
      marginTop: `-${store.headerHeight}px`
    }}>
      <video className="absolute left-0 top-0 z-0 size-full object-cover" autoPlay playsInline muted loop
      src={`${props?.background}`}></video>

      <div className="min-size-full relative z-10 my-auto h-auto px-5">
        <div style={{
          padding: `${store.headerHeight}px 0px`,
        }}>
          <motion.div className="relative mx-auto mb-8 w-full max-w-[956px] xl:w-[69%] xl:max-w-[1920px]" ref={animateAnchorRef}
           variants={{
             enter: {
               opacity: 1,
               transition: {
                 duration: 1.6,
                 ease: [0.215, 0.610, 0.355, 1.000],
               }
             },
             exit: {
               opacity: 0,
               transition: {
                 duration: 0.5,
                 ease: [0.215, 0.610, 0.355, 1.000]
               }
             },
           }}
          initial="exit"
          animate={animateAnchorIsInView ?'enter' :'exit'}>
            { props.heroImageNode }
          </motion.div>
          <OverflowContent
          animate={animateAnchorIsInView}
          delay={0.25}>
            <div className="relative mx-auto w-full max-w-[600px]">
              <div className="serif text-center text-[20px] text-white lg:leading-[1.8]">{props?.description}</div>
            </div>
          </OverflowContent>
        </div>
      </div>

    </div>
  </Suspense>
}

export default KV