"use client"

import { Suspense, useRef, useReducer, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { Button } from '@src/components/ui/button'
import LinkWithLang from "./LinkWithLang"
import { useParams } from "next/navigation"


interface TypeProps {
  className?: string
}
interface TypeState {
  footerHeight: number
}

function Footer(props:TypeProps, ref:React.ReactNode){
  const viewport = useWindowSize()
  const footerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useReducer((state:TypeState, updateState:{})=>({...state, ...updateState}), {
    // init state
    footerHeight: 0,
  })
  const [subscriptionInputFocus, setSubscriptionInputFocus] = useState(false)
  const { lang } = useParams()

  useEffect(()=>{
    setState({
      footerHeight: footerRef.current?.clientHeight || 0,
    })
  }, [viewport.width, viewport.height, footerRef?.current?.clientHeight])

  return <Suspense fallback={null}>
    <div className={twMerge('text-white relative bg-major-900', props?.className)} ref={footerRef}>
      <div className="container-fluid mb-[140px] pt-20">
        <div className="serif mb-5 text-center text-[21px] font-300">BRAND PUBLICATION SUBSCRIPTION</div>
        <form className="row row-gap-0 flex-nowrap items-end justify-center">
          <div className="col-12 shrink" style={{maxWidth:'220px'}}>
            <input className="serif h-[44px] w-full border-b border-golden-700 bg-transparent p-0 pb-2 text-center placeholder:text-gray-700" type="email" placeholder="Your email" required
            onFocus={()=>{
              setSubscriptionInputFocus(true)
            }}
            onBlur={()=>{
              setSubscriptionInputFocus(false)
            }}/>
          </div>
          {
            subscriptionInputFocus && <div className="col-auto">
              <Button type="submit" className="rounded-none border border-golden-700 bg-major-900 text-golden-700 hover:bg-golden-700 hover:text-white">SUBMIT</Button>
            </div>
          }
        </form>
      </div>

      <div className="container-fluid border-b border-golden-700 pb-6">
        <div className="row">
          <div className="col-8">
            <div className="row row-gap-8">
              <div className="col-auto border-r">
                <LinkWithLang className="block leading-none" href="/QA" lang={lang}>Q<span className="text-[13px]">&</span>A</LinkWithLang>
              </div>
              <div className="col-auto border-r">
                <LinkWithLang className="block leading-none" href="###" lang={lang}>Career</LinkWithLang>
              </div>
              <div className="col-auto border-r">
                <LinkWithLang className="block leading-none" href="/investor" lang={lang}>Investor</LinkWithLang>
              </div>
              <div className="col-auto border-r">
                <LinkWithLang className="block leading-none" href="/privacy-policy" lang={lang}>Privacy Policy</LinkWithLang>
              </div>
              <div className="col-auto">
                <LinkWithLang className="block leading-none" href="/terms-and-conditions" lang={lang}>Terms and Conditions</LinkWithLang>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="row row-gap-8 justify-end">
              <div className="col-auto">
                <a className="block leading-none" href="###" target="_blank">Facebook</a>
              </div>
              <div className="col-auto">
                <a className="block leading-none" href="###" target="_blank">Youtube</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        <div className="text-right text-[11px]">© Copyright Horizon All rights reserved.</div>
      </div>
    </div>
  </Suspense>
}

export default Footer