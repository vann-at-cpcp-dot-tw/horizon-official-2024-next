
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { twMerge } from 'tailwind-merge'
import RatioArea from 'vanns-common-modules/dist/components/react/RatioArea'
import T from 'vanns-common-modules/dist/components/react/T'

import { isEmpty } from '~/lib/utils'
import { useStore } from '~/store'

interface TypeProps {
  heroImage: {
    src?: string
    srcSet?: string
  }
  [key:string]: any
}

interface TypeState {}

function KV(props:TypeProps){
  const { className } = props

  return <div className={twMerge('relative  w-full', className)}>
    <RatioArea ratio="42.85">
      <img className="absolute left-0 top-0 size-full"
      src={props.heroImage?.src}
      srcSet={props.heroImage?.srcSet}
      sizes="100vw" />
    </RatioArea>

    <div className="py-12 lg:py-20">
      <div className="container text-center">
        <div className="serif mb-1.5 text-[24px] text-minor-900 lg:mb-3 lg:text-[32px]">
          <T text="The Horizon Group"/>
        </div>
        <div className="serif mb-3 text-[16px] text-minor-900 lg:mb-6 lg:text-[20px]">
          <T text="Horizon Group is a specialized yacht conglomerate encompassing a composite material technology company,<br/>three shipyards, and a top-tier luxury yacht marina."/>
        </div>
        <div className="text-[14px] text-gray-300 lg:text-[17px]">
          <T text="100% Crafted in Kaohsiung, Taiwan"/>
        </div>
      </div>
    </div>
  </div>
}

export default KV