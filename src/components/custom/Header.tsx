"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useEffect, useMemo, useState } from 'react'

import { useParams, usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useWindowScroll } from 'react-use'
import { twMerge } from 'tailwind-merge'
import { usePathnameWithoutLang } from 'vanns-common-modules/dist/use/next'
import { useDomNodeSize } from 'vanns-common-modules/dist/use/react'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { useStore } from '~/store'
import { i18n } from "~~/i18n.config"

import LinkWithLang from "./LinkWithLang"
import MainMenu from "./MainMenu"

interface TypeProps {
  className?: string
}

interface TypeState {}

function Header(props:TypeProps){
  const store = useStore()
  const router = useRouter()
  const { __ } = useTranslate()
  const { size:headerSize, setNode:setHeaderNode } = useDomNodeSize()
  const { lang } = useParams()
  const { y:pageScrollY } = useWindowScroll()
  const pathnameWithoutLang = usePathnameWithoutLang()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(()=>{
    if( headerSize?.height > 0 ){

      store.set({
        headerHeight: headerSize.height
      })

      // document.body.style.paddingTop = `${headerSize.height}px`
      ;(document.getElementById('app') as HTMLDivElement).style.paddingTop = `${headerSize.height}px`
    }

  // store 如果加進去，會造成無限迴圈
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [pageScrollY, headerSize.height, pathnameWithoutLang])


  return <Suspense fallback={null}>
    <div className={twMerge('fixed left-0 top-0 z-[100] w-full', props?.className)}
    ref={setHeaderNode}
    style={headerStyle}>
      <div className="container-fluid">
        <div className="row relative max-h-[66px] items-center justify-between lg:max-h-[102px]"
        style={{
          transition: 'all .8s cubic-bezier(0.215, 0.610, 0.355, 1.000)',
          height: mounted && (pageScrollY > headerSize.height) ?'80px' : '102px',
        }}>
          <div className="col-auto -ml-3">
            <MainMenu />
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
            <LinkWithLang className="flex h-[48px] flex-nowrap items-center" href="/" lang={lang}>
              <img className="mx-1.5 w-[44px] lg:w-[54px]"
              src={`${APP_BASE}assets/img/logo_mark.svg`}
              style={{width:'54px', height:'34px'}} />
              {
                pageScrollY < headerSize.height && <img className="mx-1.5 hidden lg:block"
                src={`${APP_BASE}assets/img/logo_text.svg`}
                style={{width:'140px', height:'17px'}} />
              }
            </LinkWithLang>
          </div>

          <div className="col-auto -mr-1">
            <div className="row row-gap-4 flex-nowrap items-center">
              {
                i18n.locales.length > 1 && <div className="col-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger><i className="bi bi-globe2 btn text-[21px]"></i></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {
                        i18n.locales.map((node, index)=>{
                          return <DropdownMenuItem key={index}
                          className={lang === node.shortCode ?'pointer-events-none bg-major text-white' :'cursor-pointer'}
                          onClick={()=>{
                            localStorage.setItem('lang', node.shortCode)
                            router.push(`/${node.shortCode}${pathnameWithoutLang}`)
                            // window.location.href = `/${node.shortCode}${pathnameWithoutLang}`
                          }}>
                            { node.name }
                          </DropdownMenuItem>
                        })
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }
              <div className="col-auto">
                <LinkWithLang className="btn-opacity text-[15px] text-minor-900" href={CONTENT_TYPE === 'hq' ?'/dealers' :'/contact'} lang={lang}>{ __('CONTACT') }</LinkWithLang>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Suspense>
}

export default Header