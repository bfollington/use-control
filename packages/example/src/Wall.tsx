import { KEYS, useActionHeld, useActionPressed, useMouseMoveNormalised } from 'use-control'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useGamepadAxis, useGamepadButtonPressed } from './gamepad'

function keycode(code: number) {
  return { type: 'keycode', code }
}

function gamepadButton(index: number, code: number) {
  return { type: 'gamepad', index, code }
}

const XBOX_ONE = {
  D_LEFT: 14,
  D_RIGHT: 15,
  D_UP: 12,
  D_DOWN: 13,
  STICK_L_X: 0,
  STICK_L_Y: 1,
  STICK_R_X: 2,
  STICK_R_Y: 3,
}

const inputMap = {
  left: [KEYS.left_arrow, KEYS.a],
  right: [KEYS.right_arrow, KEYS.d],
  up: [KEYS.up_arrow, KEYS.w],
  down: [KEYS.down_arrow, KEYS.s],
  count: [KEYS.space],
}

const inputMap2 = {
  left: [keycode(KEYS.left_arrow), keycode(KEYS.a), gamepadButton(0, XBOX_ONE.D_LEFT)],
  right: [keycode(KEYS.right_arrow), keycode(KEYS.d), gamepadButton(0, XBOX_ONE.D_RIGHT)],
  up: [keycode(KEYS.up_arrow), keycode(KEYS.w), gamepadButton(0, XBOX_ONE.D_UP)],
  down: [keycode(KEYS.down_arrow), keycode(KEYS.s), gamepadButton(0, XBOX_ONE.D_DOWN)],
  count: [keycode(KEYS.space)],
}

function modify<T>(val: MutableRefObject<T> | undefined, sink: (v: T) => void) {
  if (val?.current) {
    sink(val.current)
  }
}

export default function Wall(props: any) {
  const mesh = useRef()

  useGamepadButtonPressed(0, XBOX_ONE.D_LEFT, () => {
    modify<any>(mesh, (m) => {
      m.scale.x -= 0.1
    })
  })

  useGamepadAxis(0, XBOX_ONE.STICK_R_X, (v) => {
    modify<any>(mesh, (m) => {
      m.rotation.x = v * Math.PI * 2
    })
  })

  useGamepadAxis(0, XBOX_ONE.STICK_R_Y, (v) => {
    modify<any>(mesh, (m) => {
      m.rotation.y = v * Math.PI * 2
    })
  })

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

  // useMouseMoveNormalised(([x, y]) => {
  //   modify<any>(mesh, (m) => {
  //     m.rotation.x = x * Math.PI * 2
  //     m.rotation.y = y * Math.PI * 2
  //   })
  // }, 1000 / 30)

  return (
    <group {...props}>
      <mesh ref={mesh}>
        <boxGeometry args={[4, 4]} />
        <meshPhongMaterial color={props.color || 'white'} />
      </mesh>
    </group>
  )
}
