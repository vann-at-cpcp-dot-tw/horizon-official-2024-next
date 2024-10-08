"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { twMerge } from 'tailwind-merge'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  children: React.ReactNode
  [key:string]: any
}
interface TypeState {}

function PageTransition(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  return <Suspense fallback={null}>
    {/* <AnimatePresence> */}
    <motion.div
    className="flex grow flex-col"
        variants={{
          enter: {
            opacity: 1,
            transition: {
              duration: 1.6,
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
        animate="enter">
      { props.children }
    </motion.div>
    {/* </AnimatePresence> */}
  </Suspense>
}

export default PageTransition