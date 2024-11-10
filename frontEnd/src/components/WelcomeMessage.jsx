import React, { useState, useCallback, useEffect, useRef } from 'react'
import TutorialCanvas from './Game/TutorialCanvas.jsx'
import PageLoader from './PageLoader.jsx'

const WelcomeMessage = () => {
  const [isLoaderReady, setIsLoaderReady] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const [showCanvas, setShowCanvas] = useState(false)
  const pageLoaderRef = useRef(null)

  const preloadResources = useCallback(async () => {
    const imageModules = import.meta.glob('../assets/CanvasImage/run_*.png')
    const loadedFrames = await Promise.all(
      Object.values(imageModules).map(importFunc => importFunc())
    )
    const sortedFrames = loadedFrames.map(module => module.default).sort()

    await Promise.all(
      sortedFrames.map(src => new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = src
      }))
    )

    const font = new FontFace('AntiquityPrint', 'url(/assets/CanvasImage/font/Antiquity-print.ttf)')
    await font.load().then((loadedFont) => {
      document.fonts.add(loadedFont)
    }).catch((error) => {
      console.error('폰트 로딩 실패:', error)
    })

    setIsLoaderReady(true)
  }, [])

  useEffect(() => {
    preloadResources()
  }, [preloadResources])

  const handleLoadComplete = useCallback(() => {
    setShowLoader(false)
    setShowCanvas(true)
  }, [])

  if (showLoader && isLoaderReady) {
    return (
      <PageLoader ref={pageLoaderRef} onLoadComplete={handleLoadComplete} />
    )
  }

  if (showCanvas) {
    return <TutorialCanvas />
  }

  return null
}

export default WelcomeMessage
