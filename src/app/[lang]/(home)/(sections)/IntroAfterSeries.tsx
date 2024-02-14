"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useRef } from 'react'
import RatioArea from "@src/components/custom/RatioArea"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import OverflowContent from "@src/components/custom/OverflowContent"
import { useInView } from "framer-motion"
interface TypeProps {
  smallVideo: string
  wideVideo: string
  lang: string
}
interface TypeState {}

function IntroAfterSeries(props:TypeProps, ref:React.ReactNode){
  const animateAnchorRef = useRef(null)
  const animateAnchorIsInView = useInView(animateAnchorRef, {
    margin: `0px 0px -${window.innerHeight/4}px 0px`
  })

  return <Suspense fallback={null}>
    <div>
      <div className="container-fluid my-[100px]"
    style={{
      maxWidth: '1145px'
    }}>
        <div className="row items-center">
          <div className="px-2.5" style={{width:'45%'}}>
            <div className="pr-0 lg:pr-9">
              <RatioArea ratio="74.84">
                <video className="absolute left-0 top-0 z-0 h-full w-full border-[8px] border-white object-cover" autoPlay playsInline muted loop
              src={props?.smallVideo}
              style={{
                filter: 'grayscale()',
              }}></video>
              </RatioArea>
            </div>
          </div>
          <div className="px-2.5" style={{width:'55%'}} ref={animateAnchorRef}>
            <div className="pl-0 lg:pl-9" style={{maxWidth:'516px'}}>
              <OverflowContent
              animate={animateAnchorIsInView}>
                <div className="serif mb-1 text-center text-[48px] leading-[1.2] text-major-700">Bring <i>Your</i> Yachting<br/>Dreams <i>to</i> Life</div>
              </OverflowContent>
              <OverflowContent
              animate={animateAnchorIsInView}
              delay={0.25}>
                <div className="text-center text-[15px] leading-[1.8] text-gray-700">Each of Horizon’s eight luxury yacht series is unique in its style and function. Whether your passion lies in leisurely cruising, exploring offshore or discovering new grounds, there is a Horizon model designed with you in mind.</div>
              </OverflowContent>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mb-[60px] h-[608px] w-full">
        <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center p-5 text-center text-white">
          <div className="serif text-[32px] font-300 italic">
            <LinkWithLang href="/about/innovation" lang={props?.lang}>The Innovation Behind Horizon</LinkWithLang>
          </div>
          <div className="flex justify-center">
            <LinkWithLang className="border-b-[3px] border-b-white pb-1" href="/about/innovation" lang={props.lang}>Discover</LinkWithLang>
          </div>
        </div>
        <video className="absolute left-0 top-0 z-0 h-full w-full object-cover" autoPlay playsInline muted loop
        src={props?.wideVideo}></video>
      </div>
    </div>
  </Suspense>
}

export default IntroAfterSeries