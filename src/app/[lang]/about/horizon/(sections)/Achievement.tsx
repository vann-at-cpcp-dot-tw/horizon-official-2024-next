const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense } from 'react'

import Image from "next/image"
import { twMerge } from 'tailwind-merge'
import T from 'vanns-common-modules/dist/components/react/T'

import LinkWithLang from '~/components/custom/LinkWithLang'
import { isEmpty } from '~/lib/utils'

interface TypeProps {
  items: string[]
  [key:string]: any
}
interface TypeState {}

function Achievement(props:TypeProps){
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('lg:mb-20 mb-16', className)}>
      <div className="container">
        <div className="mb-4 text-center text-gray-300"><T text="Achievement"/></div>
        <div className="row row-gap-4 justify-center">
          {
            props?.items?.map?.((node, index)=>{
              return <div className="col-auto h-[80px] py-2 lg:h-[100px]" key={index}>
                <Image src={node} width={100} height={100} alt=""
                style={{
                  height:'100%',
                  width: 'auto'
                }}/>
              </div>
            })
          }
        </div>
      </div>
    </div>
  </Suspense>
}

export default Achievement