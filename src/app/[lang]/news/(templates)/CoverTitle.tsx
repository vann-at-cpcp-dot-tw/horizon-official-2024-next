"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useState, useEffect } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { motion } from "framer-motion"
import { useStore } from '@src/store'

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import useWindowSize from "@src/hooks/useWindowSize"

interface TypeProps {
  title: string
  date: string
  slug: string
  [key:string]: any
}
interface TypeState {}

function CoverTitle(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  const [KVEnterAble, setKVEnterAble] = useState(false)
  useEffect(()=>{
    if( store.isLoadingScreenFadedOut ){
      setKVEnterAble(true)
    }
  }, [store.isLoadingScreenFadedOut])
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <motion.div className="relative bg-white p-5 lg:py-8"
      variants={{
        enter: {
          opacity: 1,
          transition: {
            duration: 1,
            delay: 0.25,
            ease: [0.215, 0.610, 0.355, 1.000]
          }
        },
        exit: {
          opacity: 0,
          transition: {
            duration: 0.5,
            ease: [0.215, 0.610, 0.355, 1.000]
          }
        }
      }}
      initial="exit"
      exit="exit"
      animate={KVEnterAble ?'enter' :'exit'}>
        <motion.div className="relative text-center text-[14px] text-gray-300 lg:text-[17px]"
        variants={{
          enter: {
            opacity: 1,
            top: '0px',
            transition: {
              duration: 1,
              delay: 0.5,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
          exit: {
            opacity: 0,
            top: '20px',
            transition: {
              duration: 0.5,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          }
        }}
        initial="exit"
        exit="exit"
        animate={KVEnterAble ?'enter' :'exit'}>
          <LinkWithLang href={`/news/cover-story`} lang={props.lang}>Cover Story</LinkWithLang>
        </motion.div>
        <motion.div className="serif btn relative text-center text-[28px] text-minor-900 hover:text-golden-900 lg:text-[43px]"
        variants={{
          enter: {
            opacity: 1,
            top: '0px',
            transition: {
              duration: 1,
              delay: 0.5,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
          exit: {
            opacity: 0,
            top: '10px',
            transition: {
              duration: 0.75,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          }
        }}
        initial="exit"
        exit="exit"
        animate={KVEnterAble ?'enter' :'exit'}>
          <LinkWithLang href={`/news/cover-story/${props.slug}`} lang={props.lang}>{ props.title }</LinkWithLang>
        </motion.div>
        <motion.div className="relative text-center text-[12px] text-gray-300 lg:text-[14px]"
        variants={{
          enter: {
            opacity: 1,
            top: '0px',
            transition: {
              duration: 1,
              delay: 1,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          },
          exit: {
            opacity: 0,
            top: '20px',
            transition: {
              duration: 0.5,
              ease: [0.215, 0.610, 0.355, 1.000]
            }
          }
        }}
        initial="exit"
        exit="exit"
        animate={KVEnterAble ?'enter' :'exit'}>{ (props.date || '').slice(0, 10).replaceAll('-', '.') }</motion.div>
      </motion.div>
    </div>
  </Suspense>
}

export default CoverTitle