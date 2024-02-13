const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import { isEmpty } from '@src/lib/helpers'
import SeriesList from "./(templates)/SeriesList"

interface TypeProps {

}
interface TypeState {}

function PageModels(props:TypeProps, ref:React.ReactNode){
  return <Suspense fallback={null}>
    <div className="py-[60px]">
      <div className="serif text-center text-[40px] text-minor-900">Our Series <span className="font-300 italic">Defined</span></div>
    </div>

    <SeriesList />
  </Suspense>
}

export default PageModels