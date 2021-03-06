import React, { MutableRefObject, useRef } from 'react'
import {
  gamepadAxis,
  gamepadButton,
  keycode,
  mouseAxis,
  useAxis,
  useButtonHeld,
  useButtonPressed,
  mouseButton,
} from 'use-control'

import GAMEPADS from 'use-control/lib/definitions/gamepads'
import KEYS from 'use-control/lib/definitions/keys'

const inputMap = {
  buttons: {
    left: [
      keycode(KEYS.left_arrow),
      mouseButton('left'),
      keycode(KEYS.a),
      gamepadButton(0, GAMEPADS.XBOX_ONE.D_LEFT),
    ],
    right: [
      keycode(KEYS.right_arrow),
      keycode(KEYS.d),
      mouseButton('right'),
      gamepadButton(0, GAMEPADS.XBOX_ONE.D_RIGHT),
    ],
    up: [
      keycode(KEYS.up_arrow),
      mouseButton('middle'),
      keycode(KEYS.w),
      gamepadButton(0, GAMEPADS.XBOX_ONE.D_UP),
    ],
    down: [keycode(KEYS.down_arrow), keycode(KEYS.s), gamepadButton(0, GAMEPADS.XBOX_ONE.D_DOWN)],
    count: [keycode(KEYS.space)],
  },
  axes: {
    x: [mouseAxis('x'), gamepadAxis(0, GAMEPADS.XBOX_ONE.STICK_R_X)],
    y: [mouseAxis('y'), gamepadAxis(0, GAMEPADS.XBOX_ONE.STICK_R_Y)],
  },
}

function modify<T>(val: MutableRefObject<T> | undefined, sink: (v: T) => void) {
  if (val?.current) {
    sink(val.current)
  }
}

export default function Wall(props: any) {
  const mesh = useRef()

  useAxis(inputMap, 'x', (v) => {
    modify<any>(mesh, (m) => {
      m.rotation.x = v * Math.PI
    })
  })

  useAxis(inputMap, 'y', (v) => {
    modify<any>(mesh, (m) => {
      m.rotation.y = v * Math.PI
    })
  })

  useButtonPressed(inputMap, 'left', () => {
    modify<any>(mesh, (m) => {
      m.scale.x -= 0.1
    })
  })

  useButtonPressed(inputMap, 'right', () => {
    modify<any>(mesh, (m) => {
      m.scale.x += 0.1
    })
  })

  useButtonHeld(inputMap, 'up', 50, () => {
    modify<any>(mesh, (m) => {
      m.scale.y += 0.05
    })
  })

  useButtonHeld(inputMap, 'down', 50, () => {
    modify<any>(mesh, (m) => {
      m.scale.y -= 0.05
    })
  })

  return (
    <group {...props}>
      <mesh ref={mesh}>
        <boxGeometry args={[4, 4]} />
        <meshPhongMaterial color={props.color || 'white'} />
      </mesh>
    </group>
  )
}
