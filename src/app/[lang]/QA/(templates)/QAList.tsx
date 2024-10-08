"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useState } from 'react'

import { motion } from "framer-motion"
import Image from "next/image"
import { twMerge } from 'tailwind-merge'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  list?: {
    question: string
    answer: string
  }[]
  [key:string]: any
}
interface TypeState {}

function QAList(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  const [active, setActive] = useState(0)
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      {
        props?.list?.map((node, index)=>{
          return <div className="btn border-b border-gray-700 py-4" key={index}
          onClick={()=>{
            setActive(index)
          }}>
            <div className="flex !flex-nowrap items-center">
              <div className="w-full shrink font-900 text-gray-900">{node?.question}</div>
              <div className="flex flex-none items-center justify-center pl-5">
                {
                  active === index
                    ?<i className="bi bi-dash-lg block text-[24px] leading-none text-golden-900"></i>
                    :<i className="bi bi-plus-lg block text-[24px] text-golden-900"></i>
                }
              </div>
            </div>
            <motion.div className="overflow-hidden text-gray-700"
            variants={{
              enter: {
                height: 'auto',
                transition: {
                  duration: 0.8,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }
              },
              exit: {
                height: '0px',
                transition: {
                  duration: 0.5,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }
              }
            }}
            initial="exit"
            exit="exit"
            animate={active === index ?'enter' :'exit'}>
              <pre className="pt-5" dangerouslySetInnerHTML={{__html:node.answer}}></pre>
            </motion.div>
          </div>
        })
      }
    </div>
  </Suspense>
}

export default QAList