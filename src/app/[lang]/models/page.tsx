const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'
import { isEmpty } from '~/lib/utils'
import SeriesList from "./(templates)/SeriesList"

interface TypeProps {

}

interface TypeState {}

function PageModels({
  params
}:{
  params: {
    lang: string
  }
},
ref:React.ReactNode){
  const { lang } = params
  return <Suspense fallback={null}>
    <div className="py-8 lg:py-16">
      <div className="serif text-center text-[32px] leading-[1.2] text-minor-900 lg:text-[40px]">Our Series <span className="font-300 italic">Defined</span></div>
    </div>

    <SeriesList lang={lang} />
  </Suspense>
}

export default PageModels