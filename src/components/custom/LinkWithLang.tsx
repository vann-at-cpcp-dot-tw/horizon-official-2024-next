import { i18n } from '~~/i18n.config'
import LinkWithLang from 'vanns-common-modules/dist/components/next/LinkWithLang'

interface TypeProps {
  href?: string
  lang?: string | string[]
  children?: React.ReactNode
  [key:string]: any
}

export default function LinkWithLangWrapper({href, lang, children, ...props}:TypeProps, ref:React.ReactNode){
  if( !href ){
    return <span {...props}>{children}</span>
  }

  const isDefaultLang = lang === i18n.defaultLocale.shortCode
  const path = isDefaultLang ?href :`/${lang}${href}`

  return <LinkWithLang {...props} href={path} lang={lang} defaultLang={i18n.defaultLocale.shortCode}>{children}</LinkWithLang>
}
