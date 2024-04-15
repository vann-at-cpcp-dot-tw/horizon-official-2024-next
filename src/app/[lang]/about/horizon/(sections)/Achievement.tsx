const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import LinkWithLang from '~/components/custom/LinkWithLang'
import { Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '~/lib/helpers'

interface TypeProps {
  items: string[]
  [key:string]: any
}
interface TypeState {}

function Achievement(props:TypeProps, ref:React.ReactNode){
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('lg:mb-20 mb-16', className)}>
      <div className="container">
        <div className="mb-4 text-center text-gray-300">Achievement</div>
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