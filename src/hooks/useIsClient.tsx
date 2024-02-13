import { useWindowSize } from "react-use"
import { useEffect, useState } from "react"

export default function useIsClient(){
  const viewport = useWindowSize()
  const [isClient, setIsClient] = useState(false)

  useEffect(()=>{
    if( viewport.width < Infinity ){
      setIsClient(true)
    }
  }, [viewport.width])

  return isClient
}