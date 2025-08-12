// 之所以要多掛一層 loader 這麼麻煩，是因為代理商的網域設定無法觸及，於是在總部的 cloudflare 加上自訂子網域並指向跟代理商同一個主機 ip，也就是說， NEXT_PUBLIC_APP_URL 和 NEXT_PUBLIC_IMAGE_CDN_URL 是不同的，但是都指向同一台主機，而後者有掛橘雲，前者不確定有沒有橘雲，但我們就可以將網頁內的所有圖片都指向這個 CDN 網域，確保圖片一定經過橘雲

export default function cloudflareImageLoader({ src, width, quality }) {
  // 從環境變數取得 CDN URL
  const cdnUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL
  const fileExt = src.toLowerCase().split('.').pop()

  // 不需要優化的格式直接返回
  const noOptimizeFormats = ['svg', 'gif']

  if (noOptimizeFormats.includes(fileExt)) {
    if (src.startsWith('/')) {
      return cdnUrl ? `${cdnUrl}${src}` : src
    }
    return src
  }

  // 開發環境或沒設定 CDN URL 時，使用預設
  if (
    !cdnUrl
    || process.env.NODE_ENV === 'development'
  ) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
  }

  // 生產環境使用 CDN
  return `${cdnUrl}/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
}
