
"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useCallback } from 'react'
import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { twMerge } from 'tailwind-merge'
import { i18n } from '~~/i18n.config'
import { tools as langTools } from "vanns-common-modules/dist/use/next/useLangGuard"
const { pathnameWithLang } = langTools(i18n)
import { useRouter } from "next/navigation"
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import buttonStyles from '~/components/ui/button.module.sass'
import { Button } from '~/components/ui/button'
import ContentLightbox from '~/components/custom/ContentLightbox'

interface TypeProps {
  children?: React.ReactNode
  [key:string]: any
}

interface TypeState {}

function Form(props:TypeProps, ref:React.ReactNode){
  const router = useRouter()
  const { referer, lang, children } = props
  const handleClose = useCallback(()=>{
    if( !referer ){
      router.push(pathnameWithLang('/', lang), {scroll:false})
      return
    }

    const url = new URL(referer)
    if( url.pathname.includes('/contact')){
      router.push(pathnameWithLang('/', lang), {scroll:false})
    }else{
      router.push(url.pathname, {scroll:false})
    }
  }, [router, referer, lang])

  const { className } = props

  return <ContentLightbox
  onClose={handleClose}>
    <>
      <div className="mb-10">
        <div className="hidden">{referer}</div>
        <div className="container serif text-center text-[40px] text-major-900">Contact Us</div>
        <div className="container serif mb-2 text-center text-[26px] italic leading-[1.2] text-gray-900 lg:mb-4">Thank you for visiting the our website.</div>
        <div className="container text-center text-[14px] text-gray-700">If you have any comments, inquiries or questions concerning our products & services,<br/>please complete the following form and we will get in touch with you soon.</div>
      </div>

      <form className="container"
          style={{
            maxWidth: '940px',
          }}>
        <div className="mb-8">
          <div className="serif mb-2 text-major-900">
            <span className="text-[24px] italic">Name *</span>
          </div>
          <input className="mb-4 w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300" type="text" placeholder="First Name" required />
          <input className="w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300" type="text" placeholder="Last Name" required />
        </div>

        <div className="mb-8">
          <div className="serif text-major-900">
            <span className="text-[24px] italic">Country *</span>
          </div>
          <input className="w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300" type="text" required />
        </div>

        <div className="mb-8">
          <div className="serif text-major-900">
            <span className="text-[24px] italic">Email *</span>
          </div>
          <input className="w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300" type="email" required />
        </div>

        <div className="mb-8">
          <div className="serif text-major-900">
            <span className="text-[24px] italic">Phone</span>
          </div>
          <input className="w-full border-b border-gray-500 bg-transparent pb-2 placeholder:text-gray-300" type="tel" />
        </div>

        <div className="mb-8">
          <div className="serif mb-2 text-major-900">
            <span className="text-[24px] italic">Message</span>
          </div>
          <RatioArea ratio="25">
            <textarea className="absolute left-0 top-0 size-full border border-gray-500 bg-transparent p-4 text-[16px]"></textarea>
          </RatioArea>
        </div>

        <div className="text-center text-[14px] text-gray-500">
            By submitting a contact request, you provide consent for us to collect and<br className="hidden lg:block"/> use your information pursuant to our <LinkWithLang className="btn-opacity underline hover:underline" href="/privacy-policy" lang={lang}>Privacy Policy and Terms of Use</LinkWithLang>
        </div>

        <div className="flex justify-center py-8">
          <Button variant="outline" className={buttonStyles['rounded-outline']} type="submit">SUBMIT</Button>
        </div>
      </form>

      { children }
    </>
  </ContentLightbox>
}

export default Form