
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { isEmpty } from '@src/lib/helpers'
import { fetchGQL } from "@src/lib/apollo"
import All from "./(sections)/All"

interface TypeProps {
  params: {
    data: {
      [key:string]: any
    }
  }
  & {
    [key:string]: string
  }
}

interface TypeState {}

async function PageAllPublications({params}:TypeProps){

  const { lang } = params

  return <div className="pb-[120px]"
  style={{
    background: '#EEEBE6',
  }}>
    <All />
  </div>
}

export default PageAllPublications