"use client"
const APP_BASE = process.env.NEXT_PUBLIC_APP_BASE || '/'
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import { Suspense, useContext, useState, useEffect, useMemo, useReducer } from 'react'

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useParams, useRouter } from 'next/navigation'
import { usePathname } from "next/navigation"
import Portal from 'vanns-common-modules/dist/components/react/Portal'
import { usePathnameWithoutLang } from 'vanns-common-modules/dist/use/next'
import { tools as langTools } from "vanns-common-modules/dist/use/next/useLangGuard"
import { useWindowSize } from 'vanns-common-modules/dist/use/react'
import { useTranslate } from "vanns-common-modules/dist/use/react"

import { ICommonData, useCommonData } from "~/app/[lang]/providers"
import { genSpecString } from '~/lib/utils'
import { useStore } from '~/store'
import { i18n } from '~~/i18n.config'

import MenuScreen from "./MenuScreen"

const { pathnameWithLang } = langTools(i18n)
interface TypeProps {}
interface TypeState {}

interface TypeMenuItem {
  key: string
  label: string
  slug?: string
  href?: string
  onClick?: Function
  vision?: {
    imageNode: ImageNode
    video: string
    content?: {
      title?: string
      subtitle?: string
    }
  }
}

export interface TypeMenuListNode extends TypeMenuItem{
  children?: TypeMenuItem[]
}

interface TypeMenus {
  [key:string]: {
    list: TypeMenuListNode[]
    vision?: {
      imageNode: ImageNode
      video: string
    }
    onBackClick?: Function
  }
}
interface TypeMenuSeriesNode {
  series: {
    nodes?: {
        translation?: {
          slug: string
          name: string
          yachtsSeriesCustomFields: {
            seriesSimpleDescription: string
          }
        }
    }[]
  }
  image: {
    node: ImageNode | null
  }
  video: {
    node: {
      mediaItemUrl: string
    } | null
  }
  yachts: {
    yacht: {
      nodes?: {
        translation?: {
          slug: string
          title: string
        }
      }[]
    }
    image: {
      node: ImageNode | null
    }
    video: {
      node: {
        mediaItemUrl: string
      } | null
    }
  } | null
}

function MainMenu(props:TypeProps){
  const { __ } = useTranslate()
  const store = useStore()
  const router = useRouter()
  const viewport = useWindowSize()
  const pathname = usePathname()
  const params = useParams()
  const { lang } = params
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPageChanging, setIsPageChanging] = useState(false)
  const commonData = useCommonData()
  const { menuItemImages, series:menuSeries } = commonData?.globalSettings?.mainMenu
  const [menuScreen, setMenuScreen] = useReducer((state:{key:string, seriesSlug?:string, yachtSlug?:string}, updateState:{})=>({...state, ...updateState}), {
    key: 'main',
    seriesSlug: '',
    yachtSlug: '',
  })
  const pathnameWithoutLang = usePathnameWithoutLang()

  const menus = useMemo<TypeMenus>(()=>{
    return {
      main: {
        vision: {
          imageNode: menuItemImages.normal?.image?.node,
          video: menuItemImages.normal?.video?.node?.mediaItemUrl,
        },
        list: [
          {
            key: 'about',
            label: __('About') as string,
            onClick: ()=>{
              setMenuScreen({
                key: 'about'
              })
            }
          },
          ...(
            CONTENT_TYPE === 'dealer' ?
              [
                {
                  key: 'team',
                  label: __('Team') as string,
                  href: '/team'
                }
              ]
              :[]
          ),
          {
            key: 'models',
            label: __('Models') as string,
            onClick: ()=>{
              setMenuScreen({
                key: 'models'
              })
            }
          },
          {
            key: 'news',
            label: __('News') as string,
            href: '/news'
          },
          {
            key: 'events',
            label: __('Events') as string,
            href: '/news/events'
          },
          {
            key: 'publications',
            label: __('Publications') as string,
            href: '/publications'
          },
          ...(
            CONTENT_TYPE === 'hq'
              ?[
                {
                  key: 'dealers',
                  label: __('Dealers') as string,
                  href: '/dealers'
                },
              ]
              : []
          ),
          ...(
            CONTENT_TYPE === 'dealer'
              ?[
                {
                  key: 'brokerage',
                  label: DEALER_REGION === 'US' ?__('Inventory') as string :__('Brokerage') as string,
                  href: DEALER_REGION === 'US' ?'/inventory' :'/brokerage'
                },
                ...(
                  ['AU', 'EU'].includes(DEALER_REGION as string)
                    ? [
                      {
                        key: 'charter',
                        label: __('Charter') as string,
                        href: '/charter'
                      }
                    ]
                    :[]
                )
              ]
              :[]
          ),
        ]
      },
      about: {
        onBackClick: ()=>{
          setMenuScreen({
            key: 'main'
          })
        },
        vision: {
          imageNode: menuItemImages.about?.image?.node,
          video: menuItemImages.about?.video?.node?.mediaItemUrl,
        },
        list: [
          {
            key: 'about-horizon',
            label: __('About Horizon') as string,
            href: '/about/horizon'
          },
          {
            key: 'about-the-group',
            label: __('The Horizon Group') as string,
            href: '/about/the-group'
          },
          {
            key: 'about-innovation',
            label: __('Innovation') as string,
            href: '/about/innovation'
          },
          {
            key: 'about-design-and-craft',
            label: __('Design and Craftsmanship') as string,
            href: '/about/design-and-craft'
          },
        ]
      },
      models: {
        onBackClick: ()=>{
          setMenuScreen({
            key: 'main',
            seriesSlug: '',
            yachtSlug: '',
          })
        },
        vision: {
          imageNode: menuItemImages.models?.image?.node,
          video: menuItemImages.models?.video?.node?.mediaItemUrl,
        },
        list: menuSeries?.map((seriesNode:TypeMenuSeriesNode)=>{

          const seriesData = seriesNode?.series?.nodes?.[0]?.translation
          let children

          if(  Array.isArray(seriesNode?.yachts) ){
            children = seriesNode?.yachts.map((menuChildNode)=>{
              const yachtData = menuChildNode?.yacht?.nodes?.[0]?.translation
              const spec = yachtData?.yachtCustomFields?.specsTable?.[0]?.specTerms
              return {
                key: yachtData?.slug,
                label: yachtData?.title,
                slug: yachtData?.slug,
                vision: {
                  imageNode: menuChildNode?.image?.node,
                  video: menuChildNode?.video?.node?.mediaItemUrl,
                  content: {
                    title: yachtData?.title,
                    subtitle: genSpecString([
                      {
                        value: [
                          spec?.loa?.metric,
                          spec?.loa?.imperial
                        ]
                      },
                      {
                        value: [
                          spec?.engines?.metric
                        ]
                      },
                      {
                        value: [
                          spec?.cabins?.metric,
                        ]
                      }
                    ])
                  }
                },
                onClick: ()=>{
                  if( viewport.width && viewport.width >= 992 ){
                    setMenuScreen({
                      key: 'models',
                      seriesSlug: seriesData?.slug,
                      yachtSlug: yachtData?.slug,
                    })
                  }else{
                    if( pathnameWithoutLang === `/models/${seriesData?.slug}/${yachtData?.slug}` ){
                      setIsMenuOpen(false)
                    }

                    setIsPageChanging(true)
                    router.push(pathnameWithLang(`/models/${seriesData?.slug}/${yachtData.slug}`, lang as string))
                  }
                }
              }
            })
          }

          return {
            key: seriesData?.slug,
            label: `${seriesData?.name} ${__('Series')}`,
            slug: seriesData?.slug,
            vision: {
              imageNode: seriesNode.image?.node,
              video: seriesNode.video?.node?.mediaItemUrl,
              content: {
                title: `${seriesData?.name} ${__('Series')}`,
                subtitle: seriesData?.yachtsSeriesCustomFields?.seriesSimpleDescription,
              }
            },
            children,
            onClick: ()=>{
              setMenuScreen({
                key: 'models',
                seriesSlug: seriesData?.slug,
                yachtSlug: '',
              })
            }
          }
        })
      },
    }
  }, [
    menuSeries,
    viewport.width,
    __,
    router,
    menuItemImages,
    lang,
    pathnameWithoutLang,
  ])

  useEffect(()=>{
    if( isMenuOpen ){
      document.body.classList.add('menu-open')
      setIsPageChanging(false)
    }else{
      document.body.classList.remove('menu-open')
      setMenuScreen({
        key: 'main'
      })
    }
  }, [isMenuOpen])

  useEffect(()=>{
    setIsMenuOpen(false)
  }, [pathname])


  return <Suspense fallback={null}>
    <div className="btn-opacity flex cursor-pointer flex-nowrap items-center"
      onClick={()=>{
        setIsMenuOpen(true)
        setMenuScreen({
          key: 'main',
          seriesSlug: '',
          yachtSlug: '',
        })
      }}>
      <Image src={`${APP_BASE}assets/img/icon_menu.svg`} width={48} height={48} alt="" />
      <div className="hidden text-[15px] leading-none text-minor-900 lg:block">{ __('MENU') }</div>
    </div>

    {
      store.isPageLoaded && <Portal dom={document.body}>
        <AnimatePresence
        mode="wait">
          {
            isMenuOpen && menus[menuScreen?.key]?.list &&
            <motion.div className={`fixed left-0 top-0 z-[10000] size-full`}
            variants={{
              enter: {
                opacity: 1,
                transition: {
                  duration: 0.25,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }
              },
              exit: {
                opacity: 0,
                transition: {
                  duration: 0.25,
                  ease: [0.215, 0.610, 0.355, 1.000]
                }
              }
            }}
            initial="exit"
            exit="exit"
            animate={isMenuOpen ?'enter' :'exit'}>
              {
                Object.entries(menus).map((menuEntries, index)=>{

                  const [menuGroupKey, menuGroupNode] = menuEntries

                  return <AnimatePresence mode="wait" key={index}>
                    {
                      menuScreen.key === menuGroupKey && <MenuScreen
                        currentScreen={menuScreen}
                        list={menuGroupNode.list}
                        vision={
                          menuGroupNode?.vision || {
                            imageNode: menuItemImages.normal?.image?.node,
                            video: menuItemImages.normal?.video?.node?.mediaItemUrl || ''
                          }
                        }
                        isMenuOpen={isMenuOpen}
                        isPageChanging={isPageChanging}
                        setIsMenuOpen={setIsMenuOpen}
                        setIsPageChanging={setIsPageChanging}
                        onBackClick={menuGroupNode?.onBackClick}
                        onCloseClick={()=>{
                          setIsMenuOpen(false)
                        }} />
                    }
                  </AnimatePresence>
                })
              }
            </motion.div>
          }
        </AnimatePresence>
      </Portal>
    }
  </Suspense>
}

export default MainMenu