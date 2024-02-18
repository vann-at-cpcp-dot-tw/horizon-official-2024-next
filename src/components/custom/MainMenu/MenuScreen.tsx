"use client"

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

import Image from "next/image"
import { Suspense, useContext, useMemo } from 'react'
import { CommonDataContext } from '@src/app/[lang]/providers'
import { motion, AnimatePresence } from "framer-motion"
import MenuVision from "./MenuVision"
import { TypeMenuListNode } from "./index"
import buttonStyles from '@src/components/ui/button.module.sass'
import { Button } from "@src/components/ui/button"
import { useParams } from "next/navigation"
import LinkWithLang from "@src/components/custom/LinkWithLang"
import usePathnameWithoutLang from "@src/hooks/usePathnameWithoutLang"

interface TypeProps {
  list: TypeMenuListNode[]
  currentScreen: {
    [key:string]: any
  },
  vision: {
    video: string
    image: string
    content?: {
      slug?: string
      title?: string
      subtitle?: string
    }
  }
  setIsMenuOpen: Function
  onCloseClick: Function
  onBackClick?: Function
}
interface TypeState {}

function MenuScreen(props:TypeProps, ref:React.ReactNode){

  const { lang } = useParams()
  const pathnameWithoutLang = usePathnameWithoutLang()

  return <Suspense fallback={null}>

    <div className="flex h-full flex-col justify-center p-5 lg:w-[25%] lg:min-w-[300px]">
      {
        props?.onBackClick
          ? <div className="btn -ml-3 -mt-3"
          onClick={()=>{
            props?.onBackClick?.()
          }}>
            <Image src={`${BASE_PATH}/assets/img/icon_menu_back.svg`} width={48} height={48} alt="" />
          </div>
          :<div className="btn -ml-3 -mt-3"
          onClick={()=>{
            props?.onCloseClick?.()
          }}>
            <Image src={`${BASE_PATH}/assets/img/icon_menu_x.svg`} width={48} height={48} alt="" />
          </div>
      }

      <div className="my-auto flex flex-col items-end pr-5">
        {
          props?.list?.map((node, index)=>{
            return <div key={index}>
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
                className={`btn-opacity block py-2.5 text-right ${node.key === props.currentScreen?.seriesSlug ?'text-golden-900' :'text-gray-700'}`}
                href={node?.href || '###'}
                lang={lang}
                onClick={()=>{
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
                      className={`btn-opacity block py-1 text-right ${childNode.key === props.currentScreen?.yachtSlug ?'text-golden-900' :'text-gray-700'}`}
                      href={childNode?.href || '###'}
                      lang={lang}
                      onClick={()=>{
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

    <div className="relative size-full shrink overflow-hidden bg-minor-900">
      <AnimatePresence mode="wait">
        {
          props.currentScreen.key === 'models'
            ?(!props.currentScreen?.seriesSlug && !props.currentScreen?.yachtSlug)
              ? <MenuVision
              video={props?.vision?.video || ''}
              image={props?.vision?.image || ''} />
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
                      image={seriesNode?.vision?.image || props?.vision?.video || ''}>
                        <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-end">
                          <div className="absolute left-0 top-0 z-0 size-full bg-major-900" style={{opacity:0.2}}></div>
                          <div className="relative z-10 pb-[70px] text-center text-white">
                            <div className="text-[20px] font-700">{seriesNode?.vision?.content?.title}</div>
                            <div className="serif mb-2 text-[40px]">{seriesNode?.vision?.content?.subtitle}</div>
                            <div className="flex justify-center">
                              <LinkWithLang className="border-b-[3px] border-b-white pb-1 text-[15px]" href={`/models/${seriesNode?.slug}`} lang={lang}>All Models</LinkWithLang>
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
                              image={childNode?.vision?.image || props?.vision?.video || ''}>
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
            image={props?.vision?.image || ''} />
        }
      </AnimatePresence>
    </div>
  </Suspense>
}

export default MenuScreen