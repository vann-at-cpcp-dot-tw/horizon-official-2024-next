const DEALER_REGION = process.env.NEXT_PUBLIC_DEALER_REGION || 'GLOBAL'

/**
 * 過濾 yacht 列表，根據當前地區排除被標記的 yacht
 * @param yachts - yacht 陣列，每個 yacht 需包含 yachtCustomFields.excludeDealers
 * @returns 過濾後的 yacht 陣列
 */
export function filterYachtsByRegion<T extends { yachtCustomFields?: { excludeDealers?: string[] | null } | null }>(
  yachts: T[]
): T[] {
  return yachts.filter(yacht => {
    const excludeDealers = yacht?.yachtCustomFields?.excludeDealers || []
    return !excludeDealers.includes(DEALER_REGION)
  })
}

/**
 * 檢查單一 yacht 是否被當前地區排除
 * @param excludeDealers - 排除地區陣列
 * @returns 是否被排除
 */
export function isYachtExcluded(excludeDealers?: string[] | null): boolean {
  return (excludeDealers || []).includes(DEALER_REGION)
}
