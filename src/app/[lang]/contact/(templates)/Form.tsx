
"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useCallback } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty, pathnameWithLang } from '@src/lib/helpers'
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import RatioArea from "@root/src/components/custom/RatioArea"
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"

interface TypeProps {
  [key:string]: any
}

interface TypeState {}

function Form(props:TypeProps, ref:React.ReactNode){
  const router = useRouter()
  const { referer, lang } = props
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

  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>

      <motion.main className="fixed left-0 top-0 z-[99999] h-full w-full bg-golden-300"
      variants={{
        enter: {
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: [0.215, 0.610, 0.355, 1.000]
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
      animate="enter">

        <div className="absolute left-0 top-0 h-full w-full overflow-auto bg-golden-300 px-5 pb-10">
          <div className="hidden">{referer}</div>
          <div className="sticky left-0 top-0  -ml-2 mb-8 flex pt-2">
            <div className="btn bg-golden-300"
            onClick={handleClose}>
              <Image src={`${BASE_PATH}/assets/img/icon_menu_x.svg`} width={48} height={48} alt=""/>
            </div>
          </div>

          <div className="mb-10">
            <div className="container serif mb-4 text-center text-[40px] text-major-900">Contact Us</div>
            <div className="container serif text-center text-[26px] italic text-gray-900">Thank you for visiting the our website.</div>
            <div className="text-center text-[14px] text-gray-700">If you have any comments, inquiries or questions concerning our products & services,<br/>please complete the following form and we will get in touch with you soon.</div>
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
                <textarea className="absolute left-0 top-0 h-full w-full border border-gray-500 bg-transparent p-4 text-[16px]"></textarea>
              </RatioArea>
            </div>

            <div className="text-center text-[14px] text-gray-500">
            By submitting a contact request, you provide consent for us to collect and<br/>use your information pursuant to our <LinkWithLang className="underline" href="###" lang={lang}>Privacy Policy and Terms of Use</LinkWithLang>
            </div>

            <div className="flex justify-center py-8">
              <Button variant="outline" className={buttonStyles['rounded-outline']} type="submit">SUBMIT</Button>
            </div>
          </form>


        </div>
      </motion.main>
    </div>
  </Suspense>
}

export default Form