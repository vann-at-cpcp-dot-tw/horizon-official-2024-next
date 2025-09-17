const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { fetchGQL } from "~/lib/apollo/server"
import { isEmpty } from '~/lib/utils'

import All from "./(sections)/All"

interface TypeProps {
  params: Promise<{
    [key:string]: string
  }>
}

interface TypeState {}

async function PageAllPublications({params}:TypeProps){

  const { lang } = await params

  return <div className="pb-16 lg:pb-32"
  style={{
    background: '#EEEBE6',
  }}>
    <All />
  </div>
}

export default PageAllPublications