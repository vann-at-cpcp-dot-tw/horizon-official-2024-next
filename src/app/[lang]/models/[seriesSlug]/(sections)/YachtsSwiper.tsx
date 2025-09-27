"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useState } from 'react'

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import SpecTable from '~/components/custom/SpecTable'
import SwiperOverflow from '~/components/custom/SwiperOverflow'
import { isEmpty } from '~/lib/utils'
import { useStore } from '~/store'

interface TypeProps {
  [key:string]: any
}
interface TypeState {}

interface TypeSwiperSlideNode {
  slug: string,
  label: string,
  link: string,
  mediaItemUrl?: string,
  srcSet?: string,
  specTerms?: {
    [key:string]: {
      metric: string
      imperial: string
    }
  }
}

function YachtsSwiper(props:TypeProps){
  const viewport = useWindowSize()
  const [realIndex, setRealIndex] = useState(0)
  const { className } = props
  const { __ } = useTranslate()
  return <Suspense fallback={null}>
    <div className={twMerge('mb-[120px]', className)}>
      <div className="mb-4">
        <SwiperOverflow
        list={props?.list}
        listTitle={ __('Models') as string }
        onSlideChange={(e:{realIndex:number})=>{
          setRealIndex(e.realIndex)
        }}/>
      </div>

      {
        props?.list?.map?.((node:TypeSwiperSlideNode, index:number)=>{
          if( realIndex ===  index){
            return <motion.div className="container-fluid" key={index}
            style={{
              maxWidth: viewport.width && viewport.width >= 992 ?'calc(70% + 40px)' :'100%',
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
              displayTermKeys={['loa', 'lwl', 'engines', 'cabins']}
              merged />
            </motion.div>
          }
        })
      }

    </div>
  </Suspense>
}

export default YachtsSwiper