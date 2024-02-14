"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@src/store'
import { useWindowSize } from 'react-use'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import SwiperOverflow from "@src/components/custom/SwiperOverflow"
import SpecTable from "@src/components/custom/SpecTable"
import { motion, AnimatePresence } from "framer-motion"

interface TypeProps {
  [key:string]: any
}
interface TypeState {}

interface TypeSwiperSlideNode {
  slug: string,
  label: string,
  link: string,
  srcSet?: string,
  mediaItemUrl?: string,
  specTerms?: {
    [key:string]: {
      metric: string
      imperial: string
    }
  }
}

function YachtsSwiper(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const router = useRouter()
  const viewport = useWindowSize()
  const [realIndex, setRealIndex] = useState(0)
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('mb-[120px]', className)}>
      <div className="mb-4">
        <SwiperOverflow
        list={props?.list}
        listTitle="Models"
        onSlideChange={(e:{realIndex:number})=>{
          setRealIndex(e.realIndex)
        }}/>
      </div>

      {
        props?.list?.map?.((node:TypeSwiperSlideNode, index:number)=>{
          if( realIndex ===  index){
            return <motion.div className="container-fluid" key={index}
            style={{
              maxWidth: 'calc(70.27% + 40px)'
            }}
            variants={{
              enter: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1,
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
              }
            }}
            initial="exit"
            exit="exit"
            animate={'enter'}>
              <SpecTable
              specTerms={node.specTerms}
              displayTermKeys={['loa', 'lwl', 'engines', 'recommendedCapacity', 'cabins']}
              merged />
            </motion.div>
          }
        })
      }

    </div>
  </Suspense>
}

export default YachtsSwiper