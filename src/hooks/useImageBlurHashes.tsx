import { genImageBlurHash } from "@src/lib/genImageBlurHash"
import { useState, useEffect, useMemo } from "react"

export default function useImageBlurHashes(imgUrlList:(string | undefined)[], args?:{w?:number, q?:number}){
  const [imageBlurHashes, setImageBlurHashes] = useState<string[]>([])
  const {w=16, q=75} = args ?? {}

  useEffect(()=>{
    const genImageBlurHashes = async ()=>{
      if( !Array.isArray(imgUrlList) ){
        return
      }

      const resources = await Promise.all(
        imgUrlList.map(async (imgUrl) =>{
          if( typeof imgUrl !== 'string'){ return '' }
          return await genImageBlurHash(imgUrl, w, q)
        })
      )
      setImageBlurHashes(resources)
    }

    genImageBlurHashes()

  }, [imgUrlList, w, q])

  return imageBlurHashes
}