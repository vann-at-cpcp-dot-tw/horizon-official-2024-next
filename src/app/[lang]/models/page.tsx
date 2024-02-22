const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import { isEmpty } from '@src/lib/helpers'
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