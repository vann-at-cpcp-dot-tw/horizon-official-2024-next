
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'
import { fetchGQL } from '~/lib/apollo'
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

  return <div className="pb-16 lg:pb-32"
  style={{
    background: '#EEEBE6',
  }}>
    <All />
  </div>
}

export default PageAllPublications