import React, { useState, useCallback, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import DungeonCanvas from './Game/DungeonCanvas'
import RuinsCanvas from './Game/RuinsCanvas'
import MountainCanvas from './Game/MountainCanvas'
import PageLoader from './PageLoader'

const canvases = [DungeonCanvas, RuinsCanvas, MountainCanvas]

const WelcomeMessage = () => {
  const {
    welcomeMessage1,
    welcomeMessage2,
    showWelcomeMessage1,
    showWelcomeMessage2,
    setWelcomeMessage1,
    setWelcomeMessage2,
    setShowWelcomeMessage1,
    setShowWelcomeMessage2,
  } = useStore()

  const [selectedCanvas, setSelectedCanvas] = useState(null)
  const [isLoaderReady, setIsLoaderReady] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
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

    const font = new FontFace('AntiquityPrint', 'url(src/assets/CanvasImage/font/Antiquity-print.ttf)')
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

  const selectRandomCanvas = useCallback(() => {
    const randomCanvas = canvases[Math.floor(Math.random() * canvases.length)]
    setSelectedCanvas(() => randomCanvas)
  }, [])

  const showWelcomeMessages = useCallback(() => {
    setWelcomeMessage1('링구아젠에 오신걸 환영합니다.')
    setTimeout(() => setShowWelcomeMessage1(true), 100)

    setTimeout(() => {
      setShowWelcomeMessage1(false)
      
      setTimeout(() => {
        setWelcomeMessage2('게임을 한번 해볼게요.')
        setTimeout(() => setShowWelcomeMessage2(true), 100)
        
        setTimeout(() => {
          setShowWelcomeMessage2(false)
          setTimeout(() => {
            selectRandomCanvas()
            setShowLoader(true)
          }, 1000)
        }, 3000)
      }, 1000)
    }, 3000)
  }, [setWelcomeMessage1, setShowWelcomeMessage1, setWelcomeMessage2, setShowWelcomeMessage2, setShowLoader, selectRandomCanvas])

  useEffect(() => {
    showWelcomeMessages()
  }, [showWelcomeMessages])

  const handleLoadComplete = useCallback(() => {
    setShowLoader(false)
    setShowCanvas(true)
  }, [])

  if (showLoader && isLoaderReady) {
    return (
      <PageLoader ref={pageLoaderRef} onLoadComplete={handleLoadComplete} />
    )
  }

  if (showCanvas && selectedCanvas) {
    const SelectedCanvas = selectedCanvas
    return <SelectedCanvas />
  }

  return (
    <>
      {welcomeMessage1 && (
        <div style={{ userSelect: 'none' }} className={`welcome-message-1 ${showWelcomeMessage1 ? 'fade-in' : 'fade-out'}`}>
          {welcomeMessage1}
        </div>
      )}
      {welcomeMessage2 && (
        <div style={{ userSelect: 'none' }} className={`welcome-message-2 ${showWelcomeMessage2 ? 'fade-in' : 'fade-out'}`}>
          {welcomeMessage2}
        </div>
      )}
    </>
  )
}

export default WelcomeMessage
