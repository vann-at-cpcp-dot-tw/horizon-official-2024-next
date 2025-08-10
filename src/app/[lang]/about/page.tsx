import { redirect } from "next/navigation"

import { i18n } from "~~/i18n.config"

export default async function PageAbout({
  params
}:{
  params: Promise<{
    lang: string
  }>
}){
  const { lang } = await params
  if( lang === i18n.defaultLocale.shortCode ){
    redirect('/about/horizon')
  }else{
    redirect(`/${lang}/about/horizon`)
  }
}
