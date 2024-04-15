import { useMemo } from "react"

export default function useBackgroundSrcSet(srcSet:string){

  // WPGraphQL 的 SrcSet 格式：'https://example.com/0.jpg 1024w, https://example.com/1.jpg 1920w'
  // 預期轉成：'image-set(url(https://example.com/0.jpg) 1024w, url(https://example.com/1.jpg) 1920w)'

  interface TypeSrcSetNode {
    url: string,
    size: string,
  }

  const backgroundImageSet = useMemo(()=>{
    const srcSetData = (srcSet?.split(',') || []).reduce((acc:TypeSrcSetNode[], node:string, index:number)=>{

      // fetch 到的字串格式為： 'https://example.com/0.jpg 1024w, https://example.com/1.jpg 1920w'，從第二個 src 開始，第一個字元都會有首空格，因此需要清除
      if(typeof node === 'string' && node[0] === ' '){
        node = node.substring(1)
      }

      return [
        ...acc,
        {
          url: node.split(' ')[0],
          size: node.split(' ')[1]
        }
      ]
    }, [])

    return `image-set(${
      srcSetData.map((node:TypeSrcSetNode)=>`url(${node?.url}) ${node?.size}`)
    })`

  }, [srcSet])

  return backgroundImageSet
}