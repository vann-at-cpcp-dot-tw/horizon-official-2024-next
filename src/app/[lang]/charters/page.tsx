
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { redirect } from "next/navigation"

interface TypeProps {
  params: {
    lang: string
  }
}
interface TypeState {}

async function PageCharter({params}:TypeProps){
  const { lang } = params

  if( CONTENT_TYPE === 'hq '){
    redirect('/')
  }

  return <main className="pb-24">
    <div className="container serif my-10 text-center text-[32px] text-minor-900">

    </div>

  </main>
}

export default PageCharter