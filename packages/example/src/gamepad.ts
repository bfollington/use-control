import { useEffect } from 'react'
import { Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

let buttonCache: { [idx: number]: GamepadButton[] } = {}
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

    for (let ctrlIdx = 0; ctrlIdx < gamepads.length; ctrlIdx++) {
      if (gamepads[ctrlIdx]) {
        for (let btnIdx = 0; btnIdx < gamepads[0].buttons.length; btnIdx++) {
          const btn = gamepads[ctrlIdx].buttons[btnIdx]
          const cachedBtn = buttonCache?.[ctrlIdx]?.[btnIdx] || {}

          if (btn.pressed) {
            held$.next({ controllerIndex: 0, buttonIndex: btnIdx })
          }

          if (!btn.pressed && cachedBtn.pressed) {
            releases$.next({ controllerIndex: ctrlIdx, buttonIndex: btnIdx })
          }

          if (btn.pressed && !cachedBtn.pressed) {
            presses$.next({ controllerIndex: ctrlIdx, buttonIndex: btnIdx })
          }
        }

        buttonCache[ctrlIdx] = gamepads[ctrlIdx].buttons.slice()

        for (let axisIdx = 0; axisIdx < gamepads[ctrlIdx].axes.length; axisIdx++) {
          const axis = gamepads[ctrlIdx].axes[axisIdx]
          axes$.next({ controllerIndex: ctrlIdx, axisIndex: axisIdx, value: axis })
        }
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
