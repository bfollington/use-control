import { Html } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import React, { MutableRefObject, useEffect, useRef } from "react"
import { interval } from "rxjs"
import { map } from "rxjs/operators"
import * as THREE from "three"
import "./materials/ShinyMaterial"
import bg from "./resources/seamless8.png"
import { useAnimation } from "./useAnimation/three"
import { interpolator, sequence, useObservable } from "./useAnimation/useAnimation"
import KEYS from "./useInput/keys"
import { useActionHeld, useActionPressed, useActionReleased } from "./useInput/keyStream"
import { useMouseMoveNormalised } from "./useInput/mouseStream"

const inputMap = {
  left: [KEYS.left_arrow, KEYS.a],
  right: [KEYS.right_arrow, KEYS.d],
  up: [KEYS.up_arrow, KEYS.w],
  down: [KEYS.down_arrow, KEYS.s],
  count: [KEYS.space],
}

function modify<T>(val: MutableRefObject<T> | undefined, sink: (v: T) => void) {
  if (val?.current) {
    sink(val.current)
  }
}

const anim = sequence(interpolator(0, 1.2, "easeOutCubic"), interpolator(1.2, 1, "easeOutCubic"))

export default function Wall(props: any) {
  const material = useRef()
  const mesh = useRef()
  const [texture] = useLoader(THREE.TextureLoader, [bg])
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  const [animationInterval, setAnimationInterval] = React.useState(500)
  const [counter, setCounter] = React.useState(0)

  const angle = useObservable(0)
  useAnimation(angle, interpolator(0, 1, "easeOutQuad"), 250, (v) => {
    modify<any>(mesh, (m) => {
      m.rotation.x = v
      m.rotation.y = v
    })
  })

  const xscale = useObservable(1)
  useAnimation(xscale, anim, 500, (v) => {
    modify<any>(mesh, (m) => {
      m.scale.z = v
    })
  })

  const yscale = useObservable(1)
  useAnimation(yscale, anim, 500, (v) => {
    modify<any>(mesh, (m) => {
      m.scale.y = v
    })
  })

  useActionPressed(inputMap, "left", () => {
    setAnimationInterval(animationInterval - 50)
  })

  useActionPressed(inputMap, "right", () => {
    setAnimationInterval(animationInterval + 50)
  })

  useActionReleased(inputMap, "up", () => {
    yscale.swap((s) => s + 0.3)
  })

  useActionReleased(inputMap, "down", () => {
    yscale.swap((s) => s - 0.3)
  })

  useActionHeld(inputMap, "count", 50, () => {
    setCounter(counter + 1)
  })

  useMouseMoveNormalised(([x, y]) => {
    yscale.set(y * 4 + 0.5)
    xscale.set(x * 4 + 0.5)
  }, 50)

  useEffect(() => {
    const s = interval(animationInterval)
      .pipe(map((t) => Math.random() * Math.PI * 2))
      .subscribe(angle.set)
    return () => s.unsubscribe()
  }, [angle, animationInterval])

  return (
    <group {...props}>
      <mesh ref={mesh}>
        {/* <torusKnotGeometry args={[1, 1, 50]} /> */}
        {/* <icosahedronGeometry args={[3, 10]} /> */}
        <boxGeometry args={[4, 4]} />
        {/* <shinyMaterial ref={material} noiseTexture={texture} /> */}
        {/* <meshLambertMaterial color="red" /> */}
        <meshPhongMaterial color={props.color || "white"} />
        <Html>
          <label>{counter}</label>
        </Html>
      </mesh>
    </group>
  )
}
