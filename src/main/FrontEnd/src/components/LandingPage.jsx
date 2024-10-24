import * as THREE from 'three'
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Plane, useAspect, useTexture } from '@react-three/drei'
import { EffectComposer, DepthOfField, Vignette } from '@react-three/postprocessing'
import Fireflies from './Fireflies'
import bgUrl from '../assets/LandingAssets/bg.jpg'
import starsUrl from '../assets/LandingAssets/stars.png'
import groundUrl from '../assets/LandingAssets/ground.png'
import bearUrl from '../assets/LandingAssets/DevilishCat.png'
import leaves1Url from '../assets/LandingAssets/leaves1.png'
import leaves2Url from '../assets/LandingAssets/leaves2.png'
import layerMaterial from './materials/layerMaterial.jsx'
import './LandingPage.css'
import { TypeAnimation } from 'react-type-animation'
import useStore from '../store/useStore'
import { useNavigate } from 'react-router-dom'

function Scene({ dof }) {
  const scaleN = useAspect(1600, 1000, 1.05)
  const scaleW = useAspect(2200, 1000, 1.05)
  const textures = useTexture([bgUrl, starsUrl, groundUrl, bearUrl, leaves1Url, leaves2Url])
  const group = useRef()
  const layersRef = useRef([])
  const [movement] = useState(() => new THREE.Vector3())
  const [temp] = useState(() => new THREE.Vector3())
  const layers = useMemo(() => [
    { texture: textures[0], z: 0, factor: 0.005, scale: scaleW },
    { texture: textures[1], z: 10, factor: 0.005, scale: scaleW },
    { texture: textures[2], z: 20, scale: scaleW },
    {
      texture: textures[3],
      z: 30,
      scaleFactor: 0.83,
      scale: [scaleN[0] * 0.6, scaleN[1] * 0.6, 1],
      position: [-13.5, 0, 30]
    },
    { texture: textures[4], factor: 0.03, scaleFactor: 1, z: 40, wiggle: 0.6, scale: scaleW },
    { texture: textures[5], factor: 0.04, scaleFactor: 1.3, z: 49, wiggle: 1, scale: scaleW },
  ], [textures, scaleN, scaleW])

  useFrame((state, delta) => {
    movement.lerp(temp.set(state.mouse.x, state.mouse.y * 0.2, 0), 0.2)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, state.mouse.x * 20, 0.2)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.mouse.y / 10, 0.2)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -state.mouse.x / 2, 0.2)
    layersRef.current[4].uniforms.time.value = layersRef.current[5].uniforms.time.value += delta
  }, 1)

  return (
    <group ref={group}>
      <Fireflies count={20} radius={80} colors={['orange']} />
      {layers.map(({ scale, texture, ref, factor = 0, scaleFactor = 1, wiggle = 0, z, position }, i) => (
        <Plane scale={scale} args={[1, 1, wiggle ? 10 : 1, wiggle ? 10 : 1]} position={position || [0, 0, z]} key={i} ref={ref}>
          <layerMaterial movement={movement} textr={texture} factor={factor} ref={(el) => (layersRef.current[i] = el)} wiggle={wiggle} scale={scaleFactor} />
        </Plane>
      ))}
    </group>
  )
}

function Effects() {
  const ref = useRef()
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <DepthOfField ref={ref} target={[0, 0, 30]} bokehScale={8} focalLength={0.1} width={1024} />
      <Vignette />
    </EffectComposer>
  )
}

export const LandingPage = () => {
  const navigate = useNavigate()
  const {
    isLeaving,
    setIsLeaving,
  } = useStore()

  const handleStartClick = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      navigate('/demo')
    }, 1000) // 페이드 아웃 효과를 위한 시간 조정
  }, [setIsLeaving, navigate])

  const handleLoginClick = useCallback(() => {
    navigate('/login')
  }, [navigate])

  return (
    <div className="landing-page">
      <div id="canvasWrapper" className={`${isLeaving ? 'fade-out' : ''}`}>
        <Canvas
          orthographic
          camera={{ zoom: 5, position: [0, 0, 200], far: 300, near: 50 }}
          gl={{ outputEncoding: THREE.sRGBEncoding, toneMapping: THREE.ACESFilmicToneMapping, antialias: false }}
        >
          <Scene />
          <Effects />
        </Canvas>
      </div>
      <div id="overlay">
        <div id="bg main"></div>
        <div id="stars main"></div>
        <div id="ground main"></div>
        <div id="bear main"></div>
        <div id="leaves1 main"></div>
        <div id="leaves2 main"></div>
      </div>
      <div className="absolute top-1/2 right-16 transform -translate-y-full bg-transparent p-4 rounded-lg flex flex-col justify-start items-center gap-4 w-auto h-28 z-10">
        <TypeAnimation
          sequence={[
            'LinguaGen', 1000,
            'Study English', 1000,
            'AI-Powered', 1000,
          ]}
          wrapper="h2"
          cursor={true}
          repeat={Infinity}
          className="text-white text-xl font-bold h-full"
          style={{ 
            fontSize: '48px',
            background: 'linear-gradient(30deg, #c850c0, #ffcc70)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        />
      </div>
      <div className="absolute bottom-32 right-28 transform -translate-y-1/2 bg-zinc-800 p-4 rounded-lg shadow-lg flex flex-col justify-start items-center gap-4 w-auto h-60 p-8 z-0">
        <button onClick={handleStartClick} className="custom-btn btn-12 flex justify-center items-center"><span>Start</span><span>시작하기</span></button>
        <button onClick={handleLoginClick} className="custom-btn btn-12 flex justify-center items-center"><span>Login</span><span>로그인 하러 가기</span></button>
        <p className='mt-8 text-gray-400 font-bold'>made by LinguaGen</p>
      </div>
    </div>
  )
}

export default LandingPage
