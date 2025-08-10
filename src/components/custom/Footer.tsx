"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'

import { Suspense, useRef, useReducer, useEffect, useState, useContext } from 'react'

import { useParams } from "next/navigation"
import { twMerge } from 'tailwind-merge'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import { ICommonData, useCommonData } from "~/app/[lang]/providers"
import Alert from "~/components/custom/Alert"
import Loading from '~/components/custom/icons/Loading'
import { Button } from '~/components/ui/button'
import { isEmpty } from '~/lib/utils'
import { useStore } from "~/store"
import useForm from "~/use/useForm"

import LinkWithLang from "./LinkWithLang"

interface TypeProps {
  className?: string
}
interface TypeState {
  footerHeight: number
}

function Footer(props:TypeProps){
  const viewport = useWindowSize()
  const footerRef = useRef<HTMLDivElement>(null)
  const store = useStore()
  const { __ } = useTranslate()
  const [state, setState] = useReducer((state:TypeState, updateState:{})=>({...state, ...updateState}), {
    // init state
    footerHeight: 0,
  })
  const [subscriptionInputFocus, setSubscriptionInputFocus] = useState(false)

  const {form, setForm, loading:submitLoading, handleSubmit} = useForm(`${HQ_API_BASE}wp-json/api/v1/subscription-log/push`, {
    email: '',
    dealer_region: process.env.NEXT_PUBLIC_DEALER_REGION || 'GLOBAL',
  })

  const { lang } = useParams()

  const commonData = useCommonData()
  const { externalLinks } = commonData ?? {}

  useEffect(()=>{
    setState({
      footerHeight: footerRef.current?.clientHeight || 0,
    })
  }, [viewport.width, viewport.height, footerRef?.current?.clientHeight])

  useEffect(()=>{
    function inputBlurHandler(e:any){
      if( e.target.id !== 'SubscriptionButtonFooter' && e.target.id !== 'SubscriptionInputFooter'){
        setSubscriptionInputFocus(false)
      }
    }
    document.body.addEventListener('click', inputBlurHandler)
    return ()=>{
      document.body.removeEventListener('click', inputBlurHandler)
    }
  }, [])

  return <Suspense fallback={null}>
    <Alert id="Subscription" title="Success">
      <div className="text-center text-[#4A4A4A]">{ __('You have successfully subscribed to the newsletter.') }</div>
    </Alert>
    <div className={twMerge('text-white relative bg-major-900', props?.className)} ref={footerRef}>
      <div className="container-fluid mb-16 pt-20 lg:mb-32">
        <div className="serif mb-2.5 text-center text-[21px] font-300 lg:mb-5">
          <div dangerouslySetInnerHTML={{ __html:__(`BRAND PUBLICATION <br class='block lg:hidden'/>SUBSCRIPTION`) || ''}}></div>
        </div>
        <form className="row row-gap-0 flex-nowrap items-end justify-center"
        onSubmit={(e)=>{
          e.preventDefault()
          handleSubmit(form).then((result)=>{
            if( result.success ){
              store.lightboxOpen('Subscription')
            }
          })
        }}>
          <div className="col-12 shrink" style={{maxWidth:'220px'}}>
            <input id="SubscriptionInputFooter" className="serif h-[44px] w-full border-b border-golden-700 bg-transparent p-0 pb-2 text-center placeholder:text-gray-700" type="email" placeholder={__('Your email')} required
            value={form.email}
            onChange={(e)=>{
              setForm({
                email: e.target.value
              })
            }}
            onFocus={()=>{
              setSubscriptionInputFocus(true)
            }} />
          </div>
          {
            subscriptionInputFocus && <div className="col-auto">
              {
                submitLoading
                  ? <Loading style={{width:'44px'}} fill="var(--color-golden-900)"/>
                  : <Button id="SubscriptionButtonFooter" type="submit" className="rounded-none border border-golden-700 bg-major-900 text-golden-700 hover:bg-golden-700 hover:text-white active:bg-golden-700 active:text-white">
                    { __('SUBMIT') }
                  </Button>
              }
            </div>
          }
        </form>
      </div>

      <div className="container-fluid border-b border-golden-700 pb-6">
        <div className="row">
          <div className="lg:col-8 col-12">
            <div className="row lg:row-gap-8">
              <div className="col-12 lg:col-auto lg:border-r">
                <LinkWithLang className="btn-opacity block py-2.5 leading-none lg:py-0" href="/QA" lang={lang}>
                  Q<span className='text-[13px]'>&</span>A
                </LinkWithLang>
              </div>

              {
                externalLinks?.career && <div className="col-12 lg:col-auto lg:border-r">
                  <a className="btn-opacity block py-2.5 leading-none lg:py-0" href={externalLinks?.career} target="_blank">
                    { __('Career') }
                  </a>
                </div>
              }

              {
                CONTENT_TYPE === 'hq' && <div className="col-12 lg:col-auto lg:border-r">
                  <LinkWithLang className="btn-opacity block py-2.5 leading-none lg:py-0" href="/investor" lang={lang}>
                    { __('Investor') }
                  </LinkWithLang>
                </div>
              }
              <div className="col-12 lg:col-auto lg:border-r">
                <LinkWithLang className="btn-opacity block py-2.5 leading-none lg:py-0" href="/privacy-policy" lang={lang}>
                  { __('Privacy Policy') }
                </LinkWithLang>
              </div>
              <div className="col-12 lg:col-auto">
                <LinkWithLang className="btn-opacity block py-2.5 leading-none lg:py-0" href="/terms-and-conditions" lang={lang}>
                  { __('Terms and Conditions') }
                </LinkWithLang>
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
                  if( !externalLinks?.socialMedia?.[node.key] ){
                    return
                  }

                  return <div className="col-auto" key={index}>
                    <a className="btn-opacity block py-2.5 text-[24px] leading-none lg:py-0 lg:text-[18px]" href={externalLinks.socialMedia[node.key]} target="_blank">
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