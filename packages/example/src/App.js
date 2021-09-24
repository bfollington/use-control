import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Wall from './Wall'
import { initGamepad } from 'use-control'

initGamepad()

export default function App() {
  return (
    <Canvas camera={{ position: [15, 15, 15] }}>
      <color attach="background" args={['black']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <pointLight position={[30, 0, 0]} color="blue" intensity={10} />
        <Wall position={[10, 0, 0]} scale={[1, 1, 1.5]} />
        <Wall position={[0, 0, 0]} scale={[1, 2.5, 1]} />
        <Wall position={[-10, 0, 0]} scale={[1, 2, 1]} />
        <Wall position={[-30, 30, 0]} scale={[1, 1, 2]} />
        <Wall position={[-30, -10, -10]} scale={[2, 1, 3]} />
      </Suspense>
      <OrbitControls minPolarAngle={Math.PI / 10} maxPolarAngle={Math.PI / 1.5} />
    </Canvas>
  )
}
