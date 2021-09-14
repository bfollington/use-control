import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Sky, OrbitControls, Html } from "@react-three/drei"
import Wall from "./Wall"
import Ribbon from "./Ribbon"
import Effects from "./Effects"

export default function App() {
  return (
    <Canvas camera={{ position: [15, 15, 15] }}>
      <color attach="background" args={["black"]} />
      {/* <Sky azimuth={1} inclination={0.1} distance={1000} /> */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        {/* <Grass /> */}
        <pointLight position={[30, 0, 0]} color="blue" intensity={10} />
        {/* <Wall position={[-30, 10, -20]} color="blue" scale={[1, 2, 3]} /> */}
        <Wall position={[10, 0, 0]} scale={[1, 1, 1.5]} />
        <Wall position={[0, 0, 0]} scale={[1, 2.5, 1]} />
        <Wall position={[-10, 0, 0]} scale={[1, 2, 1]} />
        <Wall position={[-30, 30, 0]} scale={[1, 1, 2]} />
        <Wall position={[-30, -10, -10]} scale={[2, 1, 3]} />

        {/* <Ribbon id={1} color="#7b505c" />
        <Ribbon id={64} color="#9b9880" />
        <Ribbon id={128} color="#e4d6cf" /> */}
        {/* <Html>
          <p
            style={{
              margin: 0,
              align: "center",
              transform: "translate(-48%, -50%)",
              color: "white",
              letterSpacing: "54px",
              fontFamily: "Space Age",
              fontSize: "256px",
              pointerEvents: "none",
            }}>
            ☻
          </p>
        </Html> */}
        <Effects />
      </Suspense>
      <OrbitControls minPolarAngle={Math.PI / 10} maxPolarAngle={Math.PI / 1.5} />
    </Canvas>
  )
}
