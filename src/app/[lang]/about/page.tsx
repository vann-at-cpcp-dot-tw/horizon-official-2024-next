import { redirect } from "next/navigation"
import { i18n } from "~~/i18n.config"

export default function PageAbout({
  params
}:{
  params: {
    lang: string
  }
}){
  const { lang } = params
  if( lang === i18n.defaultLocale.shortCode ){
    redirect('/about/horizon')
  }else{
    redirect(`${lang}/about/horizon`)
  }
}
