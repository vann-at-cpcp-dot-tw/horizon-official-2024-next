"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'

import { Suspense, useContext, useMemo } from 'react'

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useParams } from "next/navigation"
import { usePathnameWithoutLang } from 'vanns-common-modules/dist/use/next'
import { useWindowSize } from 'vanns-common-modules/dist/use/react'

import Loading from '~/components/custom/icons/Loading'
import LinkWithLang from '~/components/custom/LinkWithLang'
import { Button } from '~/components/ui/button'
import buttonStyles from '~/components/ui/button.module.sass'

import { TypeMenuListNode } from "./index"
import MenuVision from "./MenuVision"
import IconMenuBack from "../icons/MenuBack"


interface TypeProps {
  list: TypeMenuListNode[]
  currentScreen: {
    [key:string]: any
  },
  vision: {
    video: string
    imageNode: ImageNode
    content?: {
      slug?: string
      title?: string
      subtitle?: string
    }
  }
  isMenuOpen: boolean
  isPageChanging: boolean
  setIsPageChanging: Function
  setIsMenuOpen: Function
  onCloseClick: Function
  onBackClick?: Function
  isImagePreloaded: (srcSet: string) => boolean
}
interface TypeState {}

function MenuScreen(props:TypeProps){

  const { lang } = useParams()
  const viewport = useWindowSize()
  const pathnameWithoutLang = usePathnameWithoutLang()

  return <Suspense fallback={null}>
    <div className="absolute left-0 top-0 flex size-full !flex-nowrap items-center bg-white">

      <div className="flex size-full flex-none flex-col justify-center p-5 lg:w-1/4 lg:min-w-[300px]">
        {
          props?.onBackClick
            ? <div className="btn -ml-5 -mt-5"
            onClick={()=>{
              props?.onBackClick?.()
            }}>
              <IconMenuBack className="w-12" />
            </div>
            :<div className="btn -ml-5 -mt-5"
            onClick={()=>{
              props?.onCloseClick?.()
            }}>
              <Image src={`${APP_BASE}assets/img/icon_menu_x.svg`} width={48} height={48} alt="" />
            </div>
        }

        <div className="my-auto flex flex-col items-end pr-5">
          {
            props?.isPageChanging
              ? <Loading style={{width:'40px'}} fill="var(--color-golden-900)"/>
              : props?.list?.map((node, index)=>{
                return <div key={index}
                className={node.key === props.currentScreen?.seriesSlug ?'py-3' :'py-1'}>
                  <motion.div
                  variants={{
                    enter: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 1,
                        delay: index*0.1,
                        ease: [0.215, 0.610, 0.355, 1.000]
                      }
                    },
                    exit: {
                      opacity: 0,
                      y: 50,
                      transition: {
                        duration: 0,
                        ease: [0.215, 0.610, 0.355, 1.000]
                      }
                    }
                  }}
                  initial="exit"
                  exit="exit"
                  animate={'enter'}>
                    <LinkWithLang
                    className={`btn-opacity block py-1 text-right ${node.key === props.currentScreen?.seriesSlug ?'text-[18px] font-900 text-major-500' :'text-gray-700'}`}
                    href={node?.href}
                    lang={lang}
                    onClick={()=>{
                      if( node.href ){
                        props?.setIsPageChanging(true)
                      }

                      if( node.href === pathnameWithoutLang ){
                        props.setIsMenuOpen(false)
                      }
                      node?.onClick?.()
                    }}>
                      { node.label }
                    </LinkWithLang>
                    {
                      node.key === props.currentScreen?.seriesSlug && node?.children?.map((childNode, childNodeIndex)=>{
                        return <motion.div
                    key={`c-${childNodeIndex}`}
                    variants={{
                      enter: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 1,
                          delay: childNodeIndex*0.1,
                          ease: [0.215, 0.610, 0.355, 1.000]
                        }
                      },
                      exit: {
                        opacity: 0,
                        y: 10,
                        transition: {
                          duration: 0,
                          ease: [0.215, 0.610, 0.355, 1.000]
                        }
                      }
                    }}
                    initial="exit"
                    exit="exit"
                    animate={'enter'}>
                          <LinkWithLang
                    className={`btn-opacity block py-1 text-right lg:text-[14px] ${childNode.key === props.currentScreen?.yachtSlug ?'font-900 text-major-500' :'text-gray-700'}`}
                    href={childNode?.href}
                    lang={lang}
                    onClick={()=>{
                      if( node.href ){
                        props?.setIsPageChanging(true)
                      }

                      if( node.href === pathnameWithoutLang ){
                        props.setIsMenuOpen(false)
                      }
                      childNode?.onClick?.()
                    }}>
                            { childNode?.label }
                          </LinkWithLang>
                        </motion.div>
                      })
                    }
                  </motion.div>
                </div>
              })
          }
        </div>
      </div>

      {
        viewport.width && viewport.width >= 992 && <div className="relative size-full shrink overflow-hidden bg-minor-900">
          <AnimatePresence mode="wait">
            {
              props.currentScreen.key === 'models'
                ?(!props.currentScreen?.seriesSlug && !props.currentScreen?.yachtSlug)
                  ? <MenuVision
                  video={props?.vision?.video || ''}
                  imageNode={props?.vision?.imageNode || ''}
                  isImagePreloaded={props.isImagePreloaded} />
                  :<>
                    {
                      props?.list?.map((seriesNode:TypeMenuListNode, index)=>{

                        if( props.currentScreen?.seriesSlug !== seriesNode.key ){
                          return null
                        }

                        return <div className="absolute left-0 top-0 size-full" key={index}>
                          {
                            (props.currentScreen?.seriesSlug && !props.currentScreen?.yachtSlug)
                            && props.currentScreen?.seriesSlug === seriesNode.key
                            && <MenuVision
                            video={seriesNode?.vision?.video || props?.vision?.video || ''}
                            imageNode={seriesNode?.vision?.imageNode || props?.vision?.imageNode || ''}
                            isImagePreloaded={props.isImagePreloaded}>
                              <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-end">
                                <div className="absolute left-0 top-0 z-0 size-full bg-major-900" style={{opacity:0.2}}></div>
                                <div className="relative z-10 pb-[70px] text-center text-white">
                                  <div className="text-[20px] font-700">{seriesNode?.vision?.content?.title}</div>
                                  <div className="serif mb-2 text-[40px]">{seriesNode?.vision?.content?.subtitle}</div>
                                  <div className="flex justify-center">
                                    <LinkWithLang className="btn-text btn-opacity text-[15px]" href={`/models/${seriesNode?.slug}`} lang={lang}>All Models</LinkWithLang>
                                  </div>
                                </div>
                              </div>
                            </MenuVision>
                          }

                          {
                            seriesNode?.children?.map((childNode:TypeMenuListNode, childIndex)=>{
                              return <AnimatePresence key={`c-${childIndex}`}>
                                {
                                  props.currentScreen?.yachtSlug === childNode.key && <MenuVision
                              video={childNode?.vision?.video || props?.vision?.video || ''}
                              imageNode={childNode?.vision?.imageNode || props?.vision?.imageNode || ''}
                              isImagePreloaded={props.isImagePreloaded}>
                                    <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-end">
                                      <div className="absolute left-0 top-0 z-0 size-full bg-major-900" style={{opacity:0.2}}></div>
                                      <div className="relative z-10 pb-[70px] text-center text-white">
                                        <div className="mb-3 text-[20px] font-700">{childNode?.vision?.content?.title}</div>
                                        <div className="mb-6 text-[14px]">{childNode?.vision?.content?.subtitle}</div>
                                        <div className="flex justify-center">
                                          <LinkWithLang className="text-[15px]" href={`/models/${seriesNode?.slug}/${childNode?.slug}`} lang={lang}>
                                            <Button variant="outline" className={buttonStyles['rounded-outline-white-white']}>Discover</Button>
                                          </LinkWithLang>
                                        </div>
                                      </div>
                                    </div>
                                  </MenuVision>
                                }
                              </AnimatePresence>
                            })
                          }
                        </div>
                      })
                    }
                  </>
                : <MenuVision
                  video={props?.vision?.video || ''}
                  imageNode={props?.vision?.imageNode || ''}
                  isImagePreloaded={props.isImagePreloaded} />
            }
          </AnimatePresence>
        </div>
      }
    </div>
  </Suspense>
}

export default MenuScreen