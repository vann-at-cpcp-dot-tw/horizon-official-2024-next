import Image from "next/image"
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'

interface TypeProps {
  [key:string]: any
}
interface TypeState {}

async function ImageAutoPlaceholder(props:TypeProps){
  const { className } = props
  // const placeholder = await genImageBlurHash(props?.src)
  return <Image className={className}
    src={props?.src || ''}
    width={props?.width}
    height={props?.height}
    fill={props?.fill}
    sizes={props?.sizes}
    // placeholder="blur"
    // blurDataURL={placeholder}
    alt="" />
}

export default ImageAutoPlaceholder