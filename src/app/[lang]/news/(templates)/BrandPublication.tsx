"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense, useState } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"
import { useParams } from "next/navigation"

interface TypeProps {
  publicationCover: string
  pdf: string
  placeholder?: string
  [key:string]: any
}

interface TypeState {}

function BrandPublication(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  const params = useParams()
  const { lang } = params
  const [subscriptionInputFocus, setSubscriptionInputFocus] = useState(false)

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
              <form className="row row-gap-0 w-full flex-nowrap items-end justify-center">
                <div className="col-12 shrink" style={{maxWidth:'220px'}}>
                  <input className="serif h-[44px] w-full border-b border-gray-500 bg-transparent p-0 pb-2 text-center placeholder:text-gray-500" type="email" placeholder="Your email" required
                  onFocus={()=>{
                    setSubscriptionInputFocus(true)
                  }}
                  onBlur={()=>{
                    setSubscriptionInputFocus(false)
                  }}/>
                </div>
                {
                  subscriptionInputFocus && <div className="col-auto">
                    <Button type="submit" className="rounded-none border border-gray-500 bg-transparent text-gray-500 hover:border-golden-700 hover:bg-golden-700 hover:text-white active:border-golden-700 active:bg-golden-700 active:text-white">SUBMIT</Button>
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