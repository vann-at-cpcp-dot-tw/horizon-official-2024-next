import { useMemo } from "react"
import { useParams, usePathname } from "next/navigation"

export default function usePathnameWithoutLang(){
  const { lang } = useParams()
  const pathname = usePathname()
  const pathnameWithoutLang = useMemo(()=>{
    return pathname.startsWith(`/${lang}/`) ?pathname.replace(`/${lang}`, '') :pathname
  }, [pathname, lang])

  return pathnameWithoutLang
}