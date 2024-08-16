"use client"

const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import { useParams } from "next/navigation"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'


function NotFound(){
  const params = useParams()
  const { lang } = params

  return <main className="flex grow flex-col justify-center py-24">
    <div className="container">
      <div className="serif text-center text-[28px] text-major-900 lg:text-[32px]">404</div>
      <div className="serif py-6 text-center text-[24px] italic text-major-900 lg:py-8 lg:text-[32px]">Hi there,<br/>Thank you for visiting Horizon Yachts website!<br/>For a better viewing experience, Horizon website has been updated.
      </div>
      <div className="flex justify-center">
        <LinkWithLang className="btn-text" href="/" lang={lang}>Back to Home</LinkWithLang>
      </div>
    </div>
  </main>
}

export default NotFound