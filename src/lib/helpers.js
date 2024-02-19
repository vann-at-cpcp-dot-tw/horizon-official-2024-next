import { i18n } from '@root/i18n.config'

export const isEmpty = function( value ){
  return  value === undefined || value === null || ( typeof value === 'object' && Object.keys( value ).length === 0 ) || ( typeof value === 'string' && value.trim().length === 0 )

  // // test results
  // //---------------
  // // []        true, empty array
  // // {}        true, empty object
  // // null      true
  // // undefined true
  // // ""        true, empty string
  // // ''        true, empty string
  // // 0         false, number
  // // true      false, boolean
  // // false     false, boolean
  // // Date      false
  // // function  false

  // if (value === undefined){
  //     return true
  // }
  // if (typeof (value) == 'function' || typeof (value) == 'number' || typeof (value) == 'boolean' || Object.prototype.toString.call(value) === '[object Date]'){
  //     return false
  // }
  // if (value == null || value.length === 0){
  //     return true
  // }
  // if (typeof (value) == "object") {
  //     // empty object
  //     var r = true
  //     for (var f in value){
  //         r = false
  //     }
  //     return r
  // }
  // return false
}

export const shareFb = function(url){
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url))

}

export const shareLine = function(url, title){
  window.open('http://line.naver.jp/R/msg/text/?' + title + '%0D%0A' + url)
}

export const shareTwitter = function(url, title){
  window.open(`https://twitter.com/intent/tweet?url=${url}`)
}


export const shareLinkedin = function(url){
  window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url)
}


export const numberWithCommas = function(x, digits = 0){
  var size = Math.pow(10, digits)
  x = Math.round(x * size) / size
  if( digits !== 0 ){
    if( String(x).split('.').length === 1 ){ // 整數
      x = Number.parseFloat(x).toFixed(2)
    }
  }
  return isNaN(parseInt(x))?'0' :x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const numberWithKMB = function(num, digits){

  var calcNum = num<0 ?num*-1 :num
  var si = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'K' },
    { value: 1E6, symbol: 'M' },
    { value: 1E9, symbol: 'B' },
  ]
  var rx = /$[0-9]+$/
  var i

  for (i = si.length-1; i>0; i--){
    if (calcNum >= si[i].value){
      break
    }
  }

  num = num / si[i].value

  return parseFloat(num).toFixed(digits) + si[i].symbol
}

// 帶小數的四捨五入，第一參數：整數或浮點數，第二參數：小數位數
export const  roundDecimal = function(val, precision=0){
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0))
}

// 取隨機數
export const rand = function(min, max){
  return Math.floor( Math.random() * (max - min + 1) ) + min
}

// 創建陣列(可調增幅)
export const arrayGenerate = function(start, end, step=1){
  return Array.from(Array.from(Array(Math.ceil((end+1-start)/step)).keys()), x=>start+ x*step)
}

// 打亂陣列
export const arrayShuffle = function(a){
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
// 產生一組不重複隨機數，需要打亂陣列和創建陣列
export const arrayRandom = function({min=0, max=2, length=2, step=1} = {min:0, max:2, length:2, step:1}){
  let arry = this.arrayGenerate(min, max, step)
  this.arrayShuffle(arry)
  return arry.slice(0, length)
}

// array chunk
export const arrayChunk = function(myArray, chunk_size){
  var index = 0
  var arrayLength = myArray.length
  var tempArray = []

  for (index = 0; index < arrayLength; index += chunk_size){
    let myChunk = myArray.slice(index, index+chunk_size)
    // Do something if you want with the group
    tempArray.push(myChunk)
  }
  return tempArray
}

// 取得小數點位數
export const getDecimalPlace = function(num){
  if( num!==undefined && !isNaN(num) ){
    var sep = String(23.32).match(/\D/)[0]
    var b = String(num).split(sep)
    return b[1]? b[1].length : 0
  }
}

// 滾動到特定 el
export const scrollToSection = function({el, speed=800, offset=0, callback=function(){}}){
  if (el) {
    window.scrollTo({
      top: el.offsetTop - document.body.style.paddingTop.split('px')[0] + offset,
      behavior: 'smooth'
    })
  }
}

// 取得 el 在螢幕上的％數
export const getItemPositionInViewport = function({el, based='top'}){
  if (el) {
    switch (based) {
      case 'top':
        return Math.round(
          ((el.offsetTop - window.pageYOffset) * 100) / window.innerHeight
        )
        break

      case 'bottom':
        const elBottomPosition =
          el.offsetTop - el.offsetHeight - window.pageYOffset
        return Math.round(
          ((elBottomPosition - window.pageYOffset) * 100) /
            (window.innerHeight + el.offsetHeight)
        )
    }
  }
}

// 補 0
export const padLeft = function(n, width, z){
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n

  // how to use
  // pad(10, 4);      // 0010
  // pad(9, 4);       // 0009
  // pad(123, 4);     // 0123
  // pad(10, 4, '-'); // --10
}


export const charBytes = function(str){
  return str.replace(/[^\x00-\xff]/g,'xx').length
}

// export const isElInViewport = (el)=>{
//   // Special bonus for those using jQuery
//   if (typeof jQuery === 'function' && el instanceof jQuery){
//     el = el[0]
//   }

//   var rect = el.getBoundingClientRect()

//   return (
//     rect.top >= 0 &&
//       rect.left >= 0 &&
//       rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//       rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//   )
// }

export const strWidth = function(text='', fontCssProps = '1rem'){
  const dom = document.createElement('div')
  dom.textContent = text
  dom.style.position = 'absolute'
  dom.style.whiteSpace = 'nowrap'
  dom.style.visibility = 'hidden'
  dom.style.font = fontCssProps
  document.body.appendChild(dom)
  const width = dom.offsetWidth
  document.body.removeChild(dom)
  return width
}

export const toCamelCase = function(str='', breakKey='-', upperCamelCase=false){
  const re = new RegExp(`${breakKey}(\\w)`, 'g')

  str = str.replace(re, function($0, $1){
    return $1.toUpperCase()
  })

  if( upperCamelCase ){
    str = `${str[0].toUpperCase()}${str.slice(1)}`
  }

  return str
}


export const fetchGraphQL = async function (query, { variables } = {}) {

  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}graphql`

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  }

  // if ( process.env.WORDPRESS_AUTH_REFRESH_TOKEN ){
  //   headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`
  // }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      // cache: 'no-cache',
      headers,
      body: JSON.stringify({
        query: query?.loc?.source?.body || query, // 此處因可能傳進 GraphQL AST，或原始查詢字串，所以需加以判斷
        variables,
      }),
      next: {
        revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE || 60)
      },
    })

    const json = await res.json()

    if( json.errors ){
      console.log(json.errors)
      return {
        errors: json.errors
      }
    }

    return json.data

  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch API')
  }
}

export const convertYoutubeUrlToEmbed = function(input){
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


export const pathnameWithLang = function(pathname, lang){
  const isDefaultLang = lang === i18n.defaultLocale
  const path = isDefaultLang ?pathname :`/${lang}${pathname}`
  return path
}

export const convertFeetInchesToDecimal = function(feetInches){
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


export const generatePriceRange = function(prices, step, max) {
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