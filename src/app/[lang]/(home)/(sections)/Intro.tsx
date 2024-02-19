"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useRef } from 'react'
import LinkWithLang from "@src/components/custom/LinkWithLang"
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"
import { useParams } from "next/navigation"
import OverflowContent from "@src/components/custom/OverflowContent"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"

interface TypeProps {}
interface TypeState {}

function Intro(props:TypeProps, ref:React.ReactNode){

  const { lang } = useParams()
  const animateAnchorRef = useRef(null)
  const animateAnchorIsInView = useInView(animateAnchorRef, {
    margin: `0px 0px -${window.innerHeight/4}px 0px`
  })

  return <Suspense fallback={null}>
    <div className="py-12 lg:py-24">
      <div className="container mb-5 lg:mb-10" ref={animateAnchorRef}>
        <OverflowContent
        animate={animateAnchorIsInView}>
          <div className="serif mb-3 text-center text-[24px] text-major-700 lg:mb-6 lg:text-[48px]">Exploring <span className="italic">Possibilities</span>, Daring to   <span className="italic">Challenge</span>,<br/>and Pursuing Excellence.</div>
        </OverflowContent>
        <OverflowContent
        animate={animateAnchorIsInView}
        delay={0.25}>
          <div className="serif relative mx-auto max-w-[770px] text-center text-[15px] text-major-700 lg:text-[24px]">Innovation, technology, craftsmanship, design—these are the core tenants of Horizon, a leading luxury yacht builder that has been setting the industry standard for nearly four decades. From pioneering new yacht designs to employing the latest advanced composites technologies, Horizon, simply put, backs style with substance.
          </div>
        </OverflowContent>
        <br/><br className="hidden lg:block"/>
        <OverflowContent
        animate={animateAnchorIsInView}
        delay={0.5}>
          <div className="serif relative mx-auto max-w-[770px] text-center text-[15px] text-major-700 lg:text-[24px]">Whether you’re a seasoned owner or just beginning your journey, we invite you to discover new worlds with Horizon.</div>
        </OverflowContent>
      </div>

      <motion.div className="flex justify-center"
        variants={{
          enter: {
            opacity: 1,
            transition: {
              duration: 0.5,
              ease: [0.215, 0.610, 0.355, 1.000],
              delay: 0.75,
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
        animate={animateAnchorIsInView ?'enter' :'exit'}>
        <Button variant="outline" className={buttonStyles['rounded-outline']}>
          <LinkWithLang href="/about" lang={lang}>About</LinkWithLang>
        </Button>
      </motion.div>
    </div>
  </Suspense>
}

export default Intro