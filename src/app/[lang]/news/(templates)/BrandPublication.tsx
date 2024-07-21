"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const HQ_API_BASE = process.env.NEXT_PUBLIC_HQ_API_BASE
const HQ_API_URL = `${HQ_API_BASE}graphql`
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useEffect, useState } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/utils'
import buttonStyles from '~/components/ui/button.module.sass'
import { Button } from '~/components/ui/button'
import { useParams } from "next/navigation"
import useForm from "~/use/useForm"
import Loading from '~/components/custom/icons/Loading'
import { useStore } from "~/store"

interface TypeProps {
  publicationCover: string
  pdf: string
  placeholder?: string
  [key:string]: any
}

interface TypeState {}

function BrandPublication(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const { className } = props
  const params = useParams()
  const { lang } = params
  const [subscriptionInputFocus, setSubscriptionInputFocus] = useState(false)
  const {form, setForm, loading:submitLoading, handleSubmit} = useForm(`${HQ_API_BASE}wp-json/api/v1/subscription-log/push`, {
    email: '',
    dealer_region: process.env.NEXT_PUBLIC_DEALER_REGION || 'GLOBAL',
  })

  useEffect(()=>{
    function inputBlurHandler(e:any){
      if( e.target.id !== 'SubscriptionButton' && e.target.id !== 'SubscriptionInput'){
        setSubscriptionInputFocus(false)
      }
    }
    document.body.addEventListener('click', inputBlurHandler)
    return ()=>{
      document.body.removeEventListener('click', inputBlurHandler)
    }
  }, [])

  if( !props?.publicationCover || !props?.pdf ){
    return null
  }

  return <Suspense fallback={null}>
    <div className={twMerge('bg-[#EEEBE6]', className)}>
      <div className="container py-12 lg:py-24">
        <div className="row items-center">
          <div className="lg:col-6 col-12 mb-8 lg:mb-0">
            <div className="row items-center">
              <div className="lg:col-6 col-12 mb-5 flex justify-center lg:mb-0">
                <a className="btn" href={props.pdf} target="_blank"
                style={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'
                }}>
                  <Image
                  src={props.publicationCover}
                  style={{height:'auto'}}
                  width={202}
                  height={278}
                  placeholder={props.placeholder ?'blur' :'empty'}
                  blurDataURL={props.placeholder}
                  alt="" />
                </a>
              </div>
              <div className="lg:col-6 col-12 mb-5 text-gray-500 lg:mb-0">
                <div className="mb-4 text-center text-[21px] font-300 lg:text-[28px]">The Newest Issue</div>
                <div className="mb-6 flex justify-center lg:mb-8">
                  <a className="btn" href={props.pdf} target="_blank">
                    <Button variant="outline" className={buttonStyles['rounded-outline']}>READ</Button>
                  </a>
                </div>
                <div className="flex justify-center">
                  <LinkWithLang href="/publications/brand-publication" lang={lang}>
                    <div className="btn-text text-gray-500">More Brand Publication</div>
                  </LinkWithLang>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-6 col-12 mb-6 lg:mb-0">
            <div className="serif mb-2 text-center text-[28px] font-300 text-gray-500 lg:mb-10 lg:text-[36px]">BRAND PUBLICATION<br/>SUBSCRIPTION</div>
            <div className="flex justify-center">
              <form className="row row-gap-0 w-full flex-nowrap items-end justify-center"
              onSubmit={(e)=>{
                e.preventDefault()
                handleSubmit(form).then((result)=>{
                  if( result.success ){
                    store.lightboxOpen('Subscription')
                  }
                })
              }}>
                <div className="col-12 shrink" style={{maxWidth:'220px'}}>
                  <input id="SubscriptionInput" className="serif h-[44px] w-full border-b border-gray-500 bg-transparent p-0 pb-2 text-center placeholder:text-gray-500" type="email" placeholder="Your email" required
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
                        : <Button id="SubscriptionButton" type="submit" className="rounded-none border border-gray-500 bg-transparent text-gray-500 hover:border-golden-700 hover:bg-golden-700 hover:text-white active:border-golden-700 active:bg-golden-700 active:text-white">SUBMIT</Button>
                    }
                  </div>
                }
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  </Suspense>
}

export default BrandPublication