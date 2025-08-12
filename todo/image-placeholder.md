# Image Placeholder 優化方案

## 現況問題

### 核心問題
`genImageBlurHash` 函數在 SSR 時期會對每張圖片發起 HTTP 請求：

```javascript
// node_modules/vanns-common-modules/dist/lib/next/genImageBlurHash.js:10
const base64str = await fetch(`${APP_URL}/_next/image?url=${url}&w=${w}&q=${q}`)
```

### 影響範圍
- 17 個檔案使用 `ImageAutoPlaceholder` 或 `genImageBlurHash`
- 每次 SSR 都會觸發多個 HTTP 請求
- 即使有 CDN，placeholder 生成仍會造成延遲

### CDN 的限制
1. **CDN 快取了最終圖片** ✅
   - `/_next/image?url=...&w=1920` → 被快取

2. **但 placeholder 請求參數不同** ❌
   - `/_next/image?url=...&w=16&q=75` → 不同快取項目
   - 每個新圖片的 placeholder 都是首次請求

3. **SSR 階段的網路延遲** ❌
   - Placeholder 生成在伺服器端
   - 每次 SSR 都會 fetch，即使 CDN 有快取

## 優化方案

### 方案 1：使用 Next.js 快取（推薦 - 立即可做）

```javascript
// lib/cachedBlurHash.js
import { genImageBlurHash } from 'vanns-common-modules/dist/lib/next'
import { unstable_cache } from 'next/cache'

export const getCachedBlurHash = unstable_cache(
  async (url) => {
    if (!url) return ''
    return await genImageBlurHash(url)
  },
  ['blur-hash'],
  {
    revalidate: 31536000, // 1 年
    tags: ['blur-hash']
  }
)

// 使用範例（以 about/design-and-craft/page.tsx 為例）
// 原本：
placeholder: await genImageBlurHash(partnerNode?.image?.node?.mediaItemUrl)

// 改為：
placeholder: await getCachedBlurHash(partnerNode?.image?.node?.mediaItemUrl)
```

### 方案 2：批次處理 Placeholder

```javascript
// lib/batchBlurHash.js
export async function batchGenBlurHash(urls) {
  // 建立 API endpoint 一次處理多個圖片
  const response = await fetch('/api/blur-hash-batch', {
    method: 'POST',
    body: JSON.stringify({ urls }),
    next: { revalidate: 86400 }
  })
  return response.json()
}

// app/api/blur-hash-batch/route.js
export async function POST(request) {
  const { urls } = await request.json()
  const placeholders = await Promise.all(
    urls.map(url => genImageBlurHash(url))
  )
  return Response.json(placeholders)
}
```

### 方案 3：優化 genImageBlurHash（需修改 node_modules）

```javascript
// 改良版 genImageBlurHash
export async function genImageBlurHashOptimized(url, w = 16, q = 75) {
  if (!url) return ''
  
  // 使用 CDN URL
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || APP_URL
  
  // 加入快取和錯誤處理
  try {
    const response = await fetch(
      `${cdnUrl}/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=${q}`,
      {
        next: { revalidate: 86400 }, // ISR 快取
        signal: AbortSignal.timeout(3000) // 3 秒超時
      }
    )
    
    if (!response.ok) {
      console.warn(`Failed to generate blur hash for ${url}`)
      return ''
    }
    
    const buffer = await response.arrayBuffer()
    const base64str = Buffer.from(buffer).toString('base64')
    
    // SVG 生成邏輯...
    return `data:image/svg+xml;base64,${toBase64(blurSvg)}`
  } catch (error) {
    console.error('Blur hash generation failed:', error)
    return '' // 優雅降級
  }
}
```

### 方案 4：WordPress 端預生成（長期最佳解）

```php
// WordPress 端加入 placeholder 生成
add_filter('graphql_media_item_fields', function($fields) {
  $fields['placeholder'] = [
    'type' => 'String',
    'resolve' => function($media) {
      // 生成或快取 placeholder
      return generate_blur_placeholder($media->guid);
    }
  ];
  return $fields;
});
```

## 實施建議

### 第一階段（立即）
1. 實作方案 1 - 使用 `unstable_cache` 快取
2. 監控 CDN 快取命中率
3. 測量 SSR 效能改善

### 第二階段（一週內）
1. 評估批次處理的必要性
2. 考慮建立專門的 placeholder 服務

### 第三階段（長期）
1. 與後端團隊協調 WordPress 端生成
2. 完全移除客戶端 placeholder 生成

## 監控指標

```bash
# 檢查 placeholder 請求的 CDN 快取狀態
curl -I 'https://horizonyacht.com/_next/image?url=...&w=16&q=75'

# 預期結果：
# 第一次：cf-cache-status: MISS
# 第二次：cf-cache-status: HIT
```

## 受影響檔案清單

需要更新的檔案：
1. `/app/[lang]/(home)/page.tsx`
2. `/app/[lang]/about/design-and-craft/page.tsx`
3. `/app/[lang]/about/horizon/page.tsx`
4. `/app/[lang]/about/innovation/page.tsx`
5. `/app/[lang]/about/the-group/(sections)/CompaniesGrids.tsx`
6. `/app/[lang]/about/the-group/(sections)/CompaniesIntros.tsx`
7. `/app/[lang]/about/horizon/(sections)/Discover.tsx`
8. `/app/[lang]/about/horizon/milestone/page.tsx`
9. `/app/[lang]/models/(templates)/SeriesList.tsx`
10. `/app/[lang]/news/page.tsx`
11. `/app/[lang]/news/[categorySlug]/[postSlug]/page.tsx`
12. `/app/[lang]/news/(templates)/CoverStory.tsx`
13. `/app/[lang]/publications/layout.tsx`
14. `/app/[lang]/publications/(sections)/All.tsx`
15. `/app/[lang]/models/[seriesSlug]/[yachtSlug]/(sections)/Publication.tsx`
16. `/components/custom/ImageAutoPlaceholder.tsx`
17. `/app/[lang]/about/the-group/(sections)/KV.tsx`

## 預期效益

### 效能提升
- SSR 時間減少 30-50%（減少網路請求）
- 首次載入時間改善（快取命中）
- 伺服器 CPU 使用降低

### 資源節省
- 減少 Sharp 處理次數
- 降低網路頻寬使用
- 減少記憶體尖峰

## 注意事項

1. **保持動態 placeholder** - 客戶要求每張圖片的 placeholder 顏色要符合圖片內容
2. **優雅降級** - 如果 placeholder 生成失敗，不應影響頁面渲染
3. **監控快取** - 定期檢查快取命中率，確保優化有效

## 結論

雖然 CDN 已經大幅改善圖片載入問題，但 placeholder 生成仍有優化空間。建議採用**方案 1（快取）**作為立即解決方案，同時評估長期方案的可行性。