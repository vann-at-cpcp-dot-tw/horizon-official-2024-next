export * from "vanns-common-modules/dist/lib/utils"

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertYoutubeUrlToEmbed = function(input:string){
  let youtubeID

  if( input.includes('/embed/') ){
    return input
  }

  if(input.includes('https://youtu.be/')){
    youtubeID = input.replace('https://youtu.be/', '').split('?si')[0]
  }else if(input.includes('https://www.youtube.com/watch?v=')){
    youtubeID = input.replace('https://www.youtube.com/watch?v=', '').split('&')[0]
  }

  if( youtubeID ){
    return `https://www.youtube.com/embed/${youtubeID}`
  }

}

export const convertFeetInchesToDecimal = function(feetInches:string){
  // 移除輸入字串中的空白
  feetInches = feetInches.replace(/\s/g, "")

  // 將輸入字串分割成英尺和英寸
  const parts = feetInches.split(/['"‘’“”]/)

  // 將英尺部分轉換為數字
  const feet = parseInt(parts[0])

  // 如果輸入字串包含英寸部分，則將英寸部分轉換為數字
  let inches = 0
  if (parts.length > 1) {
    inches = Math.abs(parseInt(parts[1]))
  }

  // 計算小數點
  const decimal = feet + inches / 12

  // 輸出結果
  return decimal.toFixed(4)
}

export const generatePriceRange = function(prices:(number)[], step:number, max:number) {
  // 建立一個空的陣列，用來儲存價格範圍
  let priceRanges = []
  // 計算最小和最大的價格
  let minPrice = Math.min(...prices)
  let maxPrice = Math.max(...prices)
  // 如果沒有傳入 max 參數，或者 max 參數大於最大價格，則將 max 參數設為最大價格
  if (!max || max > maxPrice) {
    max = maxPrice
  }
  // 用一個迴圈，從最小價格開始，每次增加步進值，直到超過 max 參數
  for (let i = minPrice; i <= max; i += step) {
    // 將每個價格範圍加入到陣列中，格式為 "i - i+step"
    priceRanges.push(`${i} - ${i + step}`)
  }
  // 如果 max 參數小於最大價格，則將最後一個價格範圍改為 "max 以上"
  if (max < maxPrice) {
    priceRanges[priceRanges.length - 1] = `${max} +`
  }
  // 回傳價格範圍的陣列
  return priceRanges
}

export const genSpecString = function(list:{label?:string, value:[(string|undefined|null)?, (string|undefined|null)?]}[], divider=' | '){
  return list?.reduce<string>((acc, node, index)=>{
    const isLastNode = index+1 >= list.length
    const currentSpecString = `${node.value?.[0] || ''}${node.value?.[1] ?` (${node.value?.[1]})`:''}${!isLastNode ? divider :''}`
    return `${acc}${currentSpecString}`
  }, '')
}

export function formatPostCategories(categories:{[key:string]:any} | undefined, postType:string = 'news'){
  const array = categories ?Array.isArray(categories?.nodes) ?categories.nodes :categories :[]
  return array?.map((catNode:{[key:string]:any})=>{
    return {
      name: catNode?.name,
      slug: catNode.slug,
      href: `/${postType}/${catNode.slug}`
    }
  }) || []
}

/**
 * 從 srcSet 字符串中提取最小寬度的 URL 和寬度
 * @param srcSet - srcSet 字符串，格式如 "url1 480w, url2 768w, url3 1024w"
 * @returns 最小寬度對應的 URL 和寬度對象，如果無法解析則返回 null
 */
export function getLowestWidthUrl(srcSet: string): { url: string, width: number } | null {
  if (!srcSet) return null

  // 解析 srcSet 字符串，提取 URL 和寬度
  const entries = srcSet.split(',').map(entry => {
    const parts = entry.trim().split(' ')
    if (parts.length !== 2) return null

    const url = parts[0]
    const widthStr = parts[1]

    // 確保寬度格式正確 (例如: "480w")
    if (!widthStr.endsWith('w')) return null

    const width = parseInt(widthStr.slice(0, -1))

    if (isNaN(width)) return null
    return { url, width }
  }).filter(Boolean) as { url: string, width: number }[]

  if (entries.length === 0) return null

  // 找出最小寬度的項目
  const lowest = entries.reduce((min, curr) =>
    curr.width < min.width ? curr : min
  )

  return { url: lowest.url, width: lowest.width }
}

/**
 * 根據圖片寬度和螢幕寬度計算適應性模糊值
 * @param imageWidth - 圖片原始寬度
 * @param seedBlur - 基準模糊值，如 "10px"
 * @param screenWidth - 螢幕寬度（可選），未提供時不進行縮放
 * @returns 適應螢幕尺寸的模糊值
 */
export function calcBlur(imageWidth: number, seedBlur: string, screenWidth?: number): string {
  // 解析種子模糊值
  const seedValue = parseFloat(seedBlur)
  if (isNaN(seedValue)) return seedBlur

  // 如果沒有提供螢幕寬度，使用圖片原始寬度（不縮放）
  const targetWidth = screenWidth ?? imageWidth

  // 計算圖片縮放因子
  const scaleFactor = targetWidth / imageWidth

  // 使用平方根保持體感一致性，避免過度放大或縮小
  const adaptedBlur = seedValue * Math.sqrt(scaleFactor)

  // 保留單位（預設為 px）
  const unit = seedBlur.replace(/[\d.]/g, '') || 'px'

  return `${adaptedBlur.toFixed(2)}${unit}`
}