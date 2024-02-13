const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
import { isEmpty } from '@src/lib/helpers'
import Link from "next/link"
import { i18n } from '@root/i18n.config'

interface TypeProps {
  href: string
  lang: string | string[]
  children: React.ReactNode
  [key:string]: any
}
interface TypeState {}

function LinkWithLang({href, lang, ...props}:TypeProps, ref:React.ReactNode){
  if( !href ){
    return <span {...props}>{}</span>
  }

  const isDefaultLang = lang === i18n.defaultLocale
  const path = isDefaultLang ?href :`/${lang}${href}`
  return <Link href={path} {...props}>{}</Link>
}

export default LinkWithLang