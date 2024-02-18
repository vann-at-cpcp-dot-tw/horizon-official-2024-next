import { useState, useEffect } from "react"

const baseUrl = process.env.NODE_ENV === 'development'
  ? 'https://localhost:3000/'
  : process.env.NEXT_PUBLIC_DOMAIN || ''

export async function dynamicBlurDataUrl(url:string) {

  const base64str = await fetch(
    `${baseUrl}/_next/image?url=${url}&w=16&q=75`
  ).then(async (res) =>
    Buffer.from(await res.arrayBuffer()).toString('base64')
  )

  const blurSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'>
      <filter id='b' color-interpolation-filters='sRGB'>
        <feGaussianBlur stdDeviation='1' />
      </filter>

      <image preserveAspectRatio='none' filter='url(#b)' x='0' y='0' height='100%' width='100%'
      href='data:image/avif;base64,${base64str}' />
    </svg>
  `

  const toBase64 = (str:string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str)

  return `data:image/svg+xml;base64,${toBase64(blurSvg)}`
}

export default function useImageBlurHashes(imgUrlList:(string | undefined)[]){
  const [imageBlurHashes, setImageBlurHashes] = useState<string[]>([])

  useEffect(()=>{

    const genImageBlurHashes = async ()=>{
      if( !Array.isArray(imgUrlList) ){
        return
      }

      const resources = await Promise.all(
        imgUrlList.map(async (imgUrl) =>{
          if( typeof imgUrl !== 'string'){
            return ''
          }
          return await dynamicBlurDataUrl(imgUrl)
        })
      )

      setImageBlurHashes(resources)
    }

    genImageBlurHashes()

  }, [imgUrlList])

  return imageBlurHashes
}