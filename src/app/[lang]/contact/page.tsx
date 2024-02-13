
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { headers } from 'next/headers'
import Form from "./(templates)/Form"

interface TypeProps {
  params: {
    lang: string
  }
}

interface TypeState {}

function PageContact({params}:TypeProps){
  const { lang } = params
  const headersList = headers()
  const referer = headersList.get('referer')

  return <Form
  lang={lang}
  referer={referer}
  />
}

export default PageContact