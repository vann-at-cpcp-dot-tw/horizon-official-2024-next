export * from "vanns-common-modules/dist/lib/helpers"


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
