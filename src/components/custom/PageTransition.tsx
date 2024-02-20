"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { motion, AnimatePresence } from "framer-motion"
// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  children: React.ReactNode
  [key:string]: any
}
interface TypeState {}

function PageTransition(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
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