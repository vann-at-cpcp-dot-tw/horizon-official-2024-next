"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import { Suspense, useEffect, useMemo } from 'react'
import { useStore } from '@src/store'
import useDomNodeSize from "@src/hooks/useDomNodeSize"
import { useParams, usePathname } from "next/navigation"
import { twMerge } from 'tailwind-merge'
import MainMenu from "./MainMenu"
import LinkWithLang from "./LinkWithLang"
import { useWindowScroll } from 'react-use'
import usePathnameWithoutLang from "@src/hooks/usePathnameWithoutLang"

interface TypeProps {
  className?: string
}

interface TypeState {}

function Header(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const { size:headerSize, setNode:setHeaderNode } = useDomNodeSize()
  const { lang } = useParams()
  const { y:pageScrollY } = useWindowScroll()
  const pathnameWithoutLang = usePathnameWithoutLang()

  useEffect(()=>{
    if( headerSize?.height > 0 ){

      store.set({
        headerHeight: headerSize.height
      })

      // document.body.style.paddingTop = `${headerSize.height}px`
      ;(document.getElementById('app') as HTMLDivElement).style.paddingTop = `${headerSize.height}px`
    }
  }, [headerSize.height])

  const headerStyle = useMemo(()=>{

    let scrollEffect:{[key:string]:string} = { }

    let transparentEffect:{[key:string]:string} = {
      backgroundColor: 'var(--color-golden-100)'
    }

    let whiteEffect:{[key:string]:string} = {}

    if(
      ['/about/horizon', '/publications'].includes(pathnameWithoutLang)
      || pathnameWithoutLang.includes('/publications/')
    ){
      transparentEffect.backgroundColor = 'rgba(0, 0, 0, 0)'
    }

    if( pageScrollY > headerSize.height ){
      scrollEffect.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)'
      scrollEffect.backgroundColor = 'var(--color-golden-100)'
    }

    return {
      ...transparentEffect,
      ...whiteEffect,
      ...scrollEffect,
    }
  }, [pageScrollY, headerSize.height, pathnameWithoutLang, lang])


  return <Suspense fallback={null}>
    <div className={twMerge('fixed left-0 top-0 z-[100] w-full', props?.className)}
    ref={setHeaderNode}
    style={headerStyle}>
      <div className="container-fluid">
        <div className="row relative items-center justify-between"
        style={{
          transition: 'all .8s cubic-bezier(0.215, 0.610, 0.355, 1.000)',
          height: pageScrollY > headerSize.height ?'80px' :'102px'
        }}>
          <div className="col-auto -ml-3">
            <MainMenu />
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
            <LinkWithLang className="flex h-[48px] flex-nowrap items-center" href="/" lang={lang}>
              <Image className="mx-1.5" src={`${BASE_PATH}/assets/img/logo_mark.svg`} width={54} height={34} style={{width:'54px'}} alt="" />
              {
                pageScrollY < headerSize.height && <Image className="mx-1.5" src={`${BASE_PATH}/assets/img/logo_text.svg`} width={140} height={17} style={{width:'140px'}} priority={true} alt="" />
              }
            </LinkWithLang>
          </div>

          <div className="col-auto">
            <LinkWithLang className="btn-opacity text-[15px] text-minor-900" href={CONTENT_TYPE === 'hq' ?'/dealers' :'/contact'} lang={lang}>CONTACT</LinkWithLang>
          </div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default Header