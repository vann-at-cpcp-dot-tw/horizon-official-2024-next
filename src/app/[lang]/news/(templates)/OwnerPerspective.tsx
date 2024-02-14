const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import { Suspense } from 'react'
import Image from "next/image"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import { twMerge } from 'tailwind-merge'
import { isEmpty } from '@src/lib/helpers'

// import { useRouter } from 'next/navigation'
// import { useStore } from '@src/store'
// import { useWindowSize } from 'react-use'

interface TypeProps {
  image: string
  description: string
  [key:string]: any
}
interface TypeState {}

function OwnerPerspective(props:TypeProps, ref:React.ReactNode){
  // const store = useStore()
  // const router = useRouter()
  // const viewport = useWindowSize()
  const { className } = props
  return <Suspense fallback={null}>
    <div className={twMerge('', className)}>
      <div className="container-fluid pt-5">
        <div className="row row-gap-0">
          <div className="lg:col-6 col-12 flex flex-col items-center justify-center bg-white px-10 py-4">
            <div className="my-auto pt-6 text-center">
              <div className="mb-1 text-[17px] text-gray-300">OWNER PERSPECTIVE</div>
              <div className="serif text-[60px] text-major-900">ADVENTURE</div>
            </div>
            <div className="mx-auto w-full max-w-[600px] pb-6 text-center text-[13px] text-gray-300">
              { props?.description }
            </div>
          </div>
          <div className="lg:col-6 col-12 relative">
            <Image className="w-full" src={props.image} width={1920} height={1920} alt=""
            style={{
              width: '100%',
              minWidth: '100%',
              height: 'auto',
            }}/>
          </div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default OwnerPerspective