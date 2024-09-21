const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"

import LinkWithLang from '~/components/custom/LinkWithLang'
import NotFound from "~/components/custom/NotFound"
import { isEmpty } from '~/lib/utils'
interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

function PageNotFound({params}:TypeProps){

  return <NotFound />
}

export default PageNotFound