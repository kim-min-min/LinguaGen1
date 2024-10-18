import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Dice from './Dice';

function DiceCanvas({ letter, rotationSpeed, isLeaving }) {
  return (
    <Canvas camera={{ position: [0, 0, 1.5], fov: 50 }} style={{ background: 'transparent' }}>
      <color attach="background" args={['#f9f9f9']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Dice letter={letter} rotationSpeed={rotationSpeed} isLeaving={isLeaving} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}

export default DiceCanvas;
