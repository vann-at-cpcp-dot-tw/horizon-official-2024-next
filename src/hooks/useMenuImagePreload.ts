"use client"

import { useEffect, useState, useMemo } from 'react'

import { getLowestWidthUrl } from '~/lib/utils'

interface UseMenuImagePreloadProps {
  menuData: any
  isMenuOpen: boolean
  eager?: boolean // 是否立即預載，不等待選單開啟
}

export function useMenuImagePreload({ menuData, isMenuOpen, eager = false }: UseMenuImagePreloadProps) {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set())
  const [allImagesPreloaded, setAllImagesPreloaded] = useState(false)

  // 收集所有需要預載的 blur 圖 URL
  const blurImageUrls = useMemo(() => {
    const urls: string[] = []

    // 收集主選單項目圖片
    if (menuData?.main?.vision?.imageNode?.srcSet) {
      const blurUrl = getLowestWidthUrl(menuData.main.vision.imageNode.srcSet)?.url
      if (blurUrl) urls.push(blurUrl)
    }

    if (menuData?.about?.vision?.imageNode?.srcSet) {
      const blurUrl = getLowestWidthUrl(menuData.about.vision.imageNode.srcSet)?.url
      if (blurUrl) urls.push(blurUrl)
    }

    if (menuData?.models?.vision?.imageNode?.srcSet) {
      const blurUrl = getLowestWidthUrl(menuData.models.vision.imageNode.srcSet)?.url
      if (blurUrl) urls.push(blurUrl)
    }

    // 收集 models 系列和遊艇圖片
    if (menuData?.models?.list) {
      menuData.models.list.forEach((seriesNode: any) => {
        // 系列圖片
        if (seriesNode?.vision?.imageNode?.srcSet) {
          const blurUrl = getLowestWidthUrl(seriesNode.vision.imageNode.srcSet)?.url
          if (blurUrl) urls.push(blurUrl)
        }

        // 遊艇圖片
        if (seriesNode?.children) {
          seriesNode.children.forEach((yachtNode: any) => {
            if (yachtNode?.vision?.imageNode?.srcSet) {
              const blurUrl = getLowestWidthUrl(yachtNode.vision.imageNode.srcSet)?.url
              if (blurUrl) urls.push(blurUrl)
            }
          })
        }
      })
    }

    // 去重
    return Array.from(new Set(urls))
  }, [menuData])

  // 預載圖片
  useEffect(() => {
    // eager 模式：立即預載；正常模式：等待選單開啟
    const shouldPreload = eager || isMenuOpen
    if (!shouldPreload || blurImageUrls.length === 0) return

    let loadedCount = 0
    const totalImages = blurImageUrls.length

    const preloadImage = (url: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          setPreloadedImages(prev => new Set(Array.from(prev).concat(url)))
          loadedCount++
          if (loadedCount === totalImages) {
            setAllImagesPreloaded(true)
          }
          resolve()
        }
        img.onerror = () => {
          loadedCount++
          if (loadedCount === totalImages) {
            setAllImagesPreloaded(true)
          }
          resolve()
        }
        img.src = url
      })
    }

    // 並行預載所有圖片
    Promise.all(blurImageUrls.map(preloadImage))

  }, [eager, isMenuOpen, blurImageUrls])

  // 重置狀態當選單關閉時（只在非 eager 模式下重置）
  useEffect(() => {
    if (!eager && !isMenuOpen) {
      setPreloadedImages(new Set())
      setAllImagesPreloaded(false)
    }
  }, [eager, isMenuOpen])

  return {
    preloadedImages,
    allImagesPreloaded,
    isImagePreloaded: (srcSet: string) => {
      if (!srcSet) return false
      const blurUrl = getLowestWidthUrl(srcSet)?.url
      return blurUrl ? preloadedImages.has(blurUrl) : false
    }
  }
}