"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import imagesLoaded from 'imagesloaded'
import Image from "next/image"
import NProgress from 'nprogress'
import { useInterval } from 'react-use'
import { twMerge } from 'tailwind-merge'

import { isEmpty } from '~/lib/utils'
import { useStore } from '~/store'
import 'nprogress/nprogress.css'

interface TypeProps {
  className?: string
}

interface TypeState {}

function DOMLoader(props:TypeProps){
  const store = useStore()
  const [progressNumber, setProgressNumber] = useState(0.01)
  const [enterAniable, setEnerAniable] = useState(false)

  useEffect(()=>{
    if (typeof window !== 'undefined'){
      if( !NProgress.isStarted() ){
        NProgress.configure({ minimum:0.01, trickleSpeed:50 })
        NProgress.start()
      }

      document.body.classList.add('overflow-hidden')
      imagesLoaded(document.body, ()=>{
        setTimeout(()=>{
          NProgress.done()
          setProgressNumber(1)
        }, 500)
      })
    }
  }, [])

  useInterval(()=>{
    //NProgress 若沒有接收到 onload event，最大會跑到 0.994
    setProgressNumber( (!NProgress.status||NProgress.status>=0.99) ?1 :NProgress.status)
    // setProgressNumber((NProgress.status as number))
  }, progressNumber ?100 :null)

  useEffect(()=>{
    if( progressNumber >= 1){
      setTimeout(()=>{
        window.scrollTo(0, 0)
      }, 1)
      setEnerAniable(true)
      store.set({ isPageLoaded: true })
      document.body.classList.add('page-loaded')
      setTimeout(()=>{
        $('#DOMLoader').fadeOut(400)
        setTimeout(()=>{
          store.set({ isLoadingScreenFadedOut: true})
          document.body.classList.remove('overflow-hidden')
        }, 400)
      }, 500 + 1750)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressNumber])

  return <div id="DOMLoader" className={twMerge('fixed bg-golden-100 w-screen h-screen left-0 top-0 z-[999999] flex justify-center items-center', props?.className)}>

    <motion.div className="relative z-10 flex flex-nowrap items-center justify-center"
     variants={{
       enter: {
         opacity: 1,
         y: 0,
         transition: {
           duration: 1,
           // delay: 0.4,
           ease: [0.215, 0.610, 0.355, 1.000],
         }
       },
       exit: {
         opacity: 0,
         // y: 50,
         transition: {
           ease: [0.215, 0.610, 0.355, 1.000],
         }
       },
     }}
    initial="exit"
    animate={'enter'}
    exit="exit">
      <div className="flex flex-nowrap items-center justify-center bg-golden-100 px-2">
        <Image className="mx-1.5 w-[44px] lg:w-[54px]" src={`${APP_BASE}assets/img/logo_mark.svg`} width={54} height={34} priority={true} alt="" />
        <Image className="mx-1.5 w-[130px] lg:w-[140px]" src={`${APP_BASE}assets/img/logo_text.svg`} width={140} height={17} priority={true} alt="" />
      </div>
    </motion.div>

    <motion.div className="absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2 bg-[#002E4F]"
        variants={{
          enter: {
            opacity: 0,
            transition: {
              duration: 0,
              delay: 0.4,
            }
          },
          exit: {
            opacity: 1,
          },
        }}
       initial="exit"
       animate={enterAniable ?'enter' :'exit'}
       exit="exit"
    style={{
      marginTop: '34px',
      width: `${progressNumber*100}%`,
      transition: 'all .4s'
    }}></motion.div>

    <div className="absolute bottom-0 left-0 w-full overflow-hidden"
    style={{
      height:'calc(50% - 20px)',
      visibility: enterAniable ?'visible' :'hidden',
    }}>
      {
        [...(Array(7))].map((node, index)=>{
          return <motion.div className="absolute left-0 w-full bg-[#002E4F]" key={index}
          variants={{
            enter: {
              opacity: 0,
              height: '0px',
              top: '0%',
              transition: {
                duration: 2,
                delay: (index*0.12) + 0.4,
                ease: [0.215, 0.610, 0.355, 1.000],
              }
            },
            exit: {
              opacity: 1,
              height: '120px',
              top: '100%',
              transition: {
                ease: [0.215, 0.610, 0.355, 1.000],
              }
            },
          }}
          initial="exit"
          animate={enterAniable ?'enter' :'exit'}
          exit="exit"></motion.div>
        })
      }
    </div>
  </div>
}

export default DOMLoader