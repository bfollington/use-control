import { useEffect, useState } from 'react'
import { Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

let buttonCache: GamepadButton[] = []
let poll: NodeJS.Timeout
let presses$ = new Subject<GamepadAction>()
let held$ = new Subject<GamepadAction>()
let releases$ = new Subject<GamepadAction>()
let axes$ = new Subject<GamepadAxisReading>()

type GamepadAction = {
  controllerIndex: number
  buttonIndex: number
}

type GamepadAxisReading = {
  controllerIndex: number
  axisIndex: number
  value: number
}

export function init(pollIntervalMs: number = 1000 / 60) {
  poll = setInterval(() => {
    const gamepads: Gamepad[] = navigator.getGamepads
      ? navigator.getGamepads()
      : (navigator as any).webkitGetGamepads
      ? (navigator as any).webkitGetGamepads()
      : []
    if (!gamepads) return

    if (gamepads[0]) {
      for (let btnIdx = 0; btnIdx < gamepads[0].buttons.length; btnIdx++) {
        const btn = gamepads[0].buttons[btnIdx]
        const cachedBtn = buttonCache[btnIdx] || {}

        if (btn.pressed) {
          held$.next({ controllerIndex: 0, buttonIndex: btnIdx })
        }

        if (!btn.pressed && cachedBtn.pressed) {
          releases$.next({ controllerIndex: 0, buttonIndex: btnIdx })
        }

        if (btn.pressed && !cachedBtn.pressed) {
          presses$.next({ controllerIndex: 0, buttonIndex: btnIdx })
        }
      }

      buttonCache = gamepads[0].buttons.slice()

      for (let axisIdx = 0; axisIdx < gamepads[0].axes.length; axisIdx++) {
        const axis = gamepads[0].axes[axisIdx]
        axes$.next({ controllerIndex: 0, axisIndex: axisIdx, value: axis })
      }
    }
  }, pollIntervalMs)
}

export function teardown() {
  clearInterval(poll)
}

export function useGamepadButtonPressed(
  controllerIndex: number,
  buttonIndex: number,
  sink: () => void
) {
  useEffect(() => {
    const sub = presses$
      .pipe(filter((p) => p.buttonIndex === buttonIndex && p.controllerIndex === controllerIndex))
      .subscribe(sink)

    return () => sub.unsubscribe()
  }, [controllerIndex, buttonIndex, sink])
}

export function useGamepadAxis(
  controllerIndex: number,
  axisIndex: number,
  sink: (v: number) => void
) {
  useEffect(() => {
    const sub = axes$
      .pipe(
        filter((p) => p.axisIndex === axisIndex && p.controllerIndex === controllerIndex),
        map((p) => p.value)
      )
      .subscribe(sink)

    return () => sub.unsubscribe()
  }, [controllerIndex, axisIndex, sink])
}

export function useGamepad(controllerIndex: number, buttonIndex: number, sink: () => void) {
  const [gamepadLookup, setGamepadLookup] = useState<{ [id: number]: string }>({})

  useEffect(() => {
    const onConnect = (e: GamepadEvent) => {
      console.log(
        'Gamepad connected at index %d: %s. %d buttons, %d axes.',
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length
      )

      setGamepadLookup({ ...gamepadLookup, [e.gamepad.index]: e.gamepad.id })
    }

    const onDisconnect = (e: GamepadEvent) => {
      console.log('Gamepad disconnected from index %d: %s', e.gamepad.index, e.gamepad.id)

      const next = { ...gamepadLookup }
      delete next[e.gamepad.index]
      setGamepadLookup(gamepadLookup)
    }

    window.addEventListener('gamepadconnected', onConnect)
    window.addEventListener('gamepaddisconnected', onDisconnect)

    const poll = setInterval(() => {
      const gamepads: Gamepad[] = navigator.getGamepads
        ? navigator.getGamepads()
        : (navigator as any).webkitGetGamepads
        ? (navigator as any).webkitGetGamepads()
        : []
      if (!gamepads) return

      if (gamepads[controllerIndex]) {
        const buttonsOfInterest = [buttonIndex]

        for (const btnIdx of buttonsOfInterest) {
          const btn = gamepads[controllerIndex].buttons[btnIdx]
          const cachedBtn = buttonCache[btnIdx] || {}

          if (btn.pressed) {
            console.log(btnIdx, 'is held')
          }

          if (!btn.pressed && cachedBtn.pressed) {
            console.log(btnIdx, 'is released')
          }

          if (btn.pressed && !cachedBtn.pressed) {
            sink()
          }
        }

        buttonCache = gamepads[controllerIndex].buttons.slice()
      }
    }, 1000 / 60)

    return () => {
      window.removeEventListener('gamepadconnected', onConnect)
      window.removeEventListener('gamepaddisconnected', onDisconnect)
      clearInterval(poll)
    }
  }, [gamepadLookup, setGamepadLookup, controllerIndex, buttonIndex, sink])
}
