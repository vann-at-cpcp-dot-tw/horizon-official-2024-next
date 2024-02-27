"use client"
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE || 'hq'
const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION

import Image from "next/image"
import { Suspense, useContext, useState, useEffect, useMemo, useReducer } from 'react'
import { CommonDataContext } from '@src/app/[lang]/providers'
import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@src/store'
import useWindowSize from "@src/hooks/useWindowSize"
import { usePathname } from "next/navigation"
import { isEmpty, pathnameWithLang } from '@src/lib/helpers'
import { motion, AnimatePresence } from "framer-motion"
import MenuScreen from "./MenuScreen"
import Portal from "@src/components/custom/Portal"

interface TypeProps {}
interface TypeState {}

interface TypeMenuItem {
  key: string
  label: string
  slug?: string
  href?: string
  onClick?: Function
  vision?: {
    image: string
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
      image: string
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
    node: {
      srcSet: string
      mediaItemUrl?: string
    } | null
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
      node: {
        srcSet: string
        mediaItemUrl?: string
      } | null
    }
    video: {
      node: {
        mediaItemUrl: string
      } | null
    }
  } | null
}

function MainMenu(props:TypeProps, ref:React.ReactNode){
  const store = useStore()
  const router = useRouter()
  const viewport = useWindowSize()
  const pathname = usePathname()
  const params = useParams()
  const { lang } = params
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const commonData = useContext(CommonDataContext)
  const { menuItemImages, series:menuSeries } = commonData?.globalSettings?.mainMenu
  const [menuScreen, setMenuScreen] = useReducer((state:{key:string, seriesSlug?:string, yachtSlug?:string}, updateState:{})=>({...state, ...updateState}), {
    key: 'main',
    seriesSlug: '',
    yachtSlug: '',
  })

  const menus = useMemo<TypeMenus>(()=>{
    return {
      main: {
        vision: {
          image: menuItemImages.normal?.image?.node?.mediaItemUrl,
          video: menuItemImages.normal?.video?.node?.mediaItemUrl,
        },
        list: [
          {
            key: 'about',
            label: 'About',
            onClick: ()=>{
              setMenuScreen({
                key: 'about'
              })
            }
          },
          ...(
            CONTENT_TYPE === 'dealer'
              ?[
                {
                  key: 'team',
                  label: 'Team',
                  href: '/team'
                }
              ]
              :[]
          ),
          {
            key: 'models',
            label: 'Models',
            onClick: ()=>{
              setMenuScreen({
                key: 'models'
              })
            }
          },
          {
            key: 'news',
            label: 'News',
            href: '/news'
          },
          {
            key: 'events',
            label: 'Events',
            href: '/news/events'
          },
          {
            key: 'publications',
            label: 'Publications',
            href: '/publications'
          },
          ...(
            CONTENT_TYPE === 'hq'
              ?[
                {
                  key: 'dealers',
                  label: 'Dealers',
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
                  label: DEALER_REGION !== 'US' ?'Brokerage' :'Inventory',
                  href: '/brokerage'
                },
                {
                  key: 'charter',
                  label: 'Charter',
                  href: '/charter'
                }
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
          image: menuItemImages.about?.image?.node?.mediaItemUrl,
          video: menuItemImages.about?.video?.node?.mediaItemUrl,
        },
        list: [
          {
            key: 'about-horizon',
            label: 'About Horizon',
            href: '/about/horizon'
          },
          {
            key: 'about-the-group',
            label: 'The Horizon Group',
            href: '/about/the-group'
          },
          {
            key: 'about-innovation',
            label: 'Innovation',
            href: '/about/innovation'
          },
          {
            key: 'about-design-and-craft',
            label: 'Design and Craftsmanship',
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
          image: menuItemImages.models?.image?.node?.mediaItemUrl,
          video: menuItemImages.models?.video?.node?.mediaItemUrl,
        },
        list: menuSeries.map((seriesNode:TypeMenuSeriesNode)=>{

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
                  image: menuChildNode?.image?.node?.mediaItemUrl,
                  video: menuChildNode?.video?.node?.mediaItemUrl,
                  content: {
                    title: yachtData?.title,
                    subtitle: `${spec?.loa?.metric}(${spec?.loa?.imperial}) | ${spec?.engines?.metric} | ${spec?.cabins?.metric}`,
                  }
                },
                onClick: ()=>{
                  viewport.width && viewport.width >= 992
                    ? setMenuScreen({
                      key: 'models',
                      seriesSlug: seriesData?.slug,
                      yachtSlug: yachtData?.slug,
                    })
                    : router.push(pathnameWithLang(`/models/${seriesData?.slug}/${yachtData.slug}`, lang))
                }
              }
            })
          }

          return {
            key: seriesData?.slug,
            label: `${seriesData?.name} Series`,
            slug: seriesData?.slug,
            vision: {
              image: seriesNode.image?.node?.mediaItemUrl,
              video: seriesNode.video?.node?.mediaItemUrl,
              content: {
                title: `${seriesData?.name} Series`,
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
  }, [menuSeries, viewport.width])

  useEffect(()=>{
    if( isMenuOpen ){
      document.body.classList.add('menu-open')
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
      <Image src={`${BASE_PATH}/assets/img/icon_menu.svg`} width={48} height={48} alt="" />
      <div className="hidden text-[15px] leading-none text-minor-900 lg:block">MENU</div>
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
                        vision={menuGroupNode?.vision || {
                          image: menuItemImages.normal?.image?.node?.mediaItemUrl || '',
                          video: menuItemImages.normal?.video?.node?.mediaItemUrl || ''
                        }}
                        setIsMenuOpen={setIsMenuOpen}
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