import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function Dice({ letter, rotationSpeed }) {
  const mesh = useRef();
  
  const textPositions = useMemo(() => [
    { pos: [0, 0, 0.305], rot: [0, 0, 0] },
    { pos: [0, 0, -0.305], rot: [0, Math.PI, 0] },
    { pos: [0, 0.305, 0], rot: [-Math.PI / 2, 0, 0] },
    { pos: [0, -0.305, 0], rot: [Math.PI / 2, 0, 0] },
    { pos: [0.305, 0, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [-0.305, 0, 0], rot: [0, -Math.PI / 2, 0] }
  ], []);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += rotationSpeed.x;
      mesh.current.rotation.y += rotationSpeed.y;
      mesh.current.rotation.z += rotationSpeed.z;
    }
  });

  return (
    <group ref={mesh}>
      <RoundedBox args={[0.6, 0.6, 0.6]} radius={0.075} smoothness={4}>
        <meshStandardMaterial color="white" side={THREE.DoubleSide}/>
      </RoundedBox>
      {textPositions.map(({ pos, rot }, index) => (
        <Text
          key={index}
          position={pos}
          rotation={rot}
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
          renderOrder={1}
          depthTest={false}
        >
          {letter}
        </Text>
      ))}
    </group>
  );
}

export default Dice;
