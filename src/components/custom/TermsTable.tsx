"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
import { Suspense, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '~/store'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/helpers'
import { motion } from "framer-motion"


interface TypeProps {
  terms: {
    termName: string
    termValue: string
  }[]
  [key:string]: any
}

interface TypeState {}

function TermsTable(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props

  return <Suspense fallback={null}>

    <div className={twMerge('', className)}>
      {
        props?.terms?.map((node, index)=>{
          return <motion.div className="border-b border-gray-500 py-3 text-gray-700" key={index}
            variants={{
              enter: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1,
                  delay: index*0.1,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }
              },
              exit: {
                opacity: 0,
                y: 20,
                transition: {
                  duration: 0.5,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }
              }
            }}
            initial="exit"
            exit="exit"
            animate="enter">
            <div className="row flex-nowrap">
              <div className="col-auto">
                <div className="w-[190px]">{ node.termName }</div>
              </div>
              <div className="col-12 shrink">
                {node?.termValue}
              </div>
            </div>
          </motion.div>
        })
      }
    </div>
  </Suspense>
}

export default TermsTable