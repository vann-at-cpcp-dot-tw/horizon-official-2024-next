# GraphQL 瘋狂查詢問題分析與優化計劃

## 🔍 問題分析

### 1. **revalidate 時間過短**
- **位置**: `/src/lib/apollo/index.ts` 第4行
- **問題**: `NEXT_PUBLIC_REVALIDATE = 30` (30秒)
- **影響**: ISR 快取只保持30秒，導致頻繁重新驗證和 GraphQL 查詢

### 2. **客戶端重複查詢**
- **位置**: 多個組件使用 `useQuery` 進行客戶端查詢
- **問題組件**:
  - `ComingEvents.tsx` - 每次渲染都查詢
  - `RelatedPosts.tsx` - 同時執行兩個相同查詢 (nextPosts + prevPosts)
  - `ComingEventDetail.tsx` - 動態生成 GraphQL 查詢字串
  - `Hulls.tsx`, `List.tsx` 等 - 多個列表組件重複查詢

### 3. **fetchPolicy 設定不當**
- **位置**: 所有 `useQuery` 都使用 `fetchPolicy: 'cache-and-network'`
- **問題**: 強制每次都發送網路請求，即使有快取也會查詢

### 4. **動態 GraphQL 查詢生成**
- **位置**: `ComingEventDetail.tsx` 的 `createHullGQLString` 函數
- **問題**: 運行時動態生成查詢，無法有效快取

### 5. **多重 API 端點**
- **問題**: 同時查詢 `NEXT_PUBLIC_API_BASE` 和 `NEXT_PUBLIC_HQ_API_BASE`
- **影響**: 雙倍查詢量

## 🎯 優化策略

### Phase 1: 快速修復 (立即效果)
1. **調整 revalidate 時間**: 30秒 → 300秒(5分鐘) 或 600秒(10分鐘)
2. **優化 fetchPolicy**: `cache-and-network` → `cache-first`
3. **移除重複查詢**: RelatedPosts 組件的雙查詢問題

### Phase 2: 架構優化 (中期)
1. **服務端查詢遷移**: 將客戶端查詢移至 SSG/SSR
2. **查詢合併**: 合併相關查詢減少請求數
3. **快取策略優化**: 實施更積極的快取策略

### Phase 3: 長期優化
1. **GraphQL 查詢優化**: 移除動態查詢生成
2. **API 端點整合**: 統一 API 來源
3. **分頁機制**: 實施適當的分頁避免大查詢

## 📊 預期效果
- **立即**: 減少 70-80% GraphQL 查詢
- **中期**: 減少 85-90% 不必要查詢
- **長期**: 建立可擴展的查詢架構

## ⚡ 實施優先級
1. **Critical**: revalidate 時間調整
2. **High**: fetchPolicy 優化
3. **Medium**: 客戶端查詢遷移
4. **Low**: 架構重構

## 🚨 當前影響

### 系統資源消耗
- WordPress 容器 CPU 持續 100%
- 每秒數十個 GraphQL 請求
- Redis 大量快取輸出 (419MB)
- Apache 進程數量增加

### 根本原因
- 30秒的 revalidate 導致頻繁重建頁面
- 客戶端 `cache-and-network` 政策繞過快取
- 多個組件同時發起相似查詢

## 💡 立即行動項目

### 1. 修改 revalidate 時間
```typescript
// /src/lib/apollo/index.ts
export const NEXT_PUBLIC_REVALIDATE = 300; // 改為 5 分鐘
```

### 2. 優化 fetchPolicy
```typescript
// 所有 useQuery 調用
useQuery(QUERY, {
  fetchPolicy: 'cache-first', // 從 'cache-and-network' 改為 'cache-first'
  // ...
});
```

### 3. 合併重複查詢
```typescript
// RelatedPosts.tsx - 合併 nextPosts 和 prevPosts 查詢
const { data } = useQuery(COMBINED_RELATED_POSTS_QUERY, {
  variables: { 
    currentId: id,
    first: 3,
    last: 3
  },
  fetchPolicy: 'cache-first'
});
```

## 📈 監控指標

實施後應監控：
1. GraphQL 請求頻率 (應降至每分鐘 < 10 次)
2. WordPress CPU 使用率 (應降至 < 30%)
3. Redis 網路流量 (應大幅減少)
4. 頁面載入時間 (應維持或改善)

## ⚠️ 注意事項

1. **內容更新延遲**: revalidate 增加後，內容更新會有延遲
2. **快取策略**: cache-first 可能導致用戶看到舊內容
3. **測試需求**: 每個改動都需要在測試環境驗證

## 🔧 緊急修復腳本

```bash
# 1. 備份當前配置
cp src/lib/apollo/index.ts src/lib/apollo/index.ts.bak

# 2. 修改 revalidate
sed -i 's/NEXT_PUBLIC_REVALIDATE = 30/NEXT_PUBLIC_REVALIDATE = 300/g' src/lib/apollo/index.ts

# 3. 重新部署
npm run build
pm2 restart 0
```

## 📝 後續追蹤

- [ ] 實施 Phase 1 優化
- [ ] 監控 24 小時系統狀態
- [ ] 評估是否需要 Phase 2 優化
- [ ] 建立長期優化計劃
- [ ] 設定自動化監控告警