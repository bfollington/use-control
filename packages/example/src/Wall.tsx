import { KEYS, useActionHeld, useActionPressed, useMouseMoveNormalised } from 'use-control'
import React, { MutableRefObject, useRef } from 'react'

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

export default function Wall(props: any) {
  const mesh = useRef()

  useActionPressed(inputMap, 'left', () => {
    modify<any>(mesh, (m) => {
      m.scale.x -= 0.1
    })
  })

  useActionPressed(inputMap, 'right', () => {
    modify<any>(mesh, (m) => {
      m.scale.x += 0.1
    })
  })

  useActionHeld(inputMap, 'up', 50, () => {
    modify<any>(mesh, (m) => {
      m.scale.y += 0.05
    })
  })

  useActionHeld(inputMap, 'down', 50, () => {
    modify<any>(mesh, (m) => {
      m.scale.y -= 0.05
    })
  })

  useMouseMoveNormalised(([x, y]) => {
    console.log('mouse', x, y)
    modify<any>(mesh, (m) => {
      m.rotation.x = x * Math.PI * 2
      m.rotation.y = y * Math.PI * 2
    })
  }, 1000 / 30)

  return (
    <group {...props}>
      <mesh ref={mesh}>
        <boxGeometry args={[4, 4]} />
        <meshPhongMaterial color={props.color || 'white'} />
      </mesh>
    </group>
  )
}
