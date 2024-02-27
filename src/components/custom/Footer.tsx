"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useRef, useReducer, useEffect, useState, useContext } from 'react'

import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import { Button } from '@src/components/ui/button'
import LinkWithLang from "./LinkWithLang"
import { useParams } from "next/navigation"
import { CommonDataContext } from '@src/app/[lang]/providers'
import useWindowSize from "@src/hooks/useWindowSize"
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

  const commonData = useContext(CommonDataContext)
  const { externalLinks } = commonData?.globalSettings ?? {}
  useEffect(()=>{
    setState({
      footerHeight: footerRef.current?.clientHeight || 0,
    })
  }, [viewport.width, viewport.height, footerRef?.current?.clientHeight])

  return <Suspense fallback={null}>
    <div className={twMerge('text-white relative bg-major-900', props?.className)} ref={footerRef}>
      <div className="container-fluid mb-16 pt-20 lg:mb-32">
        <div className="serif mb-2.5 text-center text-[21px] font-300 lg:mb-5">BRAND PUBLICATION <br className="block lg:hidden"/>SUBSCRIPTION</div>
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
          <div className="lg:col-8 col-12">
            <div className="row lg:row-gap-8">
              <div className="col-12 lg:col-auto lg:border-r">
                <LinkWithLang className="block py-2.5 leading-none lg:py-0" href="/QA" lang={lang}>Q<span className="text-[13px]">&</span>A</LinkWithLang>
              </div>

              {
                externalLinks?.career && <div className="col-12 lg:col-auto lg:border-r">
                  <a className="block py-2.5 leading-none lg:py-0" href={externalLinks?.career} target="_blank">Career</a>
                </div>
              }

              {
                CONTENT_TYPE === 'hq' && <div className="col-12 lg:col-auto lg:border-r">
                  <LinkWithLang className="block py-2.5 leading-none lg:py-0" href="/investor" lang={lang}>Investor</LinkWithLang>
                </div>
              }
              <div className="col-12 lg:col-auto lg:border-r">
                <LinkWithLang className="block py-2.5 leading-none lg:py-0" href="/privacy-policy" lang={lang}>Privacy Policy</LinkWithLang>
              </div>
              <div className="col-12 lg:col-auto">
                <LinkWithLang className="block py-2.5 leading-none lg:py-0" href="/terms-and-conditions" lang={lang}>Terms and Conditions</LinkWithLang>
              </div>
            </div>
          </div>
          <div className="lg:col-4 col-12 mt-6 lg:mt-0">
            <div className="row lg:justify-end">
              {
                [
                  { key: 'facebook', icon: 'facebook'},
                  { key: 'instagram', icon: 'instagram'},
                  { key: 'twitter', icon: 'twitter-x'},
                  { key: 'youtube', icon: 'youtube'},
                  { key: 'linkedin', icon: 'linkedin'}
                ].map((node, index)=>{
                  if( !externalLinks.socialMedia?.[node.key] ){
                    return
                  }

                  return <div className="col-auto" key={index}>
                    <a className="block py-2.5 text-[24px] leading-none lg:py-0 lg:text-[18px]" href={externalLinks.socialMedia[node.key]} target="_blank">
                      <i className={`bi bi-${node.icon}`}></i>
                    </a>
                  </div>
                })
              }
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        <div className="text-center text-[11px] lg:text-right">© Copyright Horizon All rights reserved.</div>
      </div>
    </div>
  </Suspense>
}

export default Footer