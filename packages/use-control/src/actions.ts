import { useEffect } from 'react'
import { EMPTY, interval, merge } from 'rxjs'
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators'
import { axes$, presses$, releases$ } from './gamepadStream'
import { key$ } from './keyStream'
import {
  MouseButton,
  mouseDown$,
  mousePosNormalisedX$,
  mousePosNormalisedY$,
  mouseUp$,
  whichButtonPressed,
} from './mouseStream'

export function mouseButton(button: MouseButton) {
  return { type: 'mouse-button', button } as const
}

export function keycode(code: number) {
  return { type: 'keycode-button', code } as const
}

export function gamepadButton(controllerIndex: number, code: number) {
  return { type: 'gamepad-button', controllerIndex, code } as const
}

export function mouseAxis(axis: 'x' | 'y') {
  return { type: 'mouse-axis', axis } as const
}

export function gamepadAxis(controllerIndex: number, axis: number, threshold: number = 0.000001) {
  return { type: 'gamepad-axis', controllerIndex, axis, threshold } as const
}

type ButtonAction =
  | ReturnType<typeof mouseButton>
  | ReturnType<typeof keycode>
  | ReturnType<typeof gamepadButton>

type AxisAction = ReturnType<typeof mouseAxis> | ReturnType<typeof gamepadAxis>

type InputMap = { buttons: { [id: string]: ButtonAction[] }; axes: { [id: string]: AxisAction[] } }

type ButtonEventType = 'down' | 'up'

function buildStream<T extends InputMap>(
  eventType: ButtonEventType,
  inputMap: T,
  key: keyof T['buttons']
) {
  const keys = inputMap.buttons[key as string]
  return merge(
    ...keys.map((k) => {
      switch (k.type) {
        case 'gamepad-button':
          const s = eventType === 'down' ? presses$ : releases$
          return s.pipe(
            filter((p) => p.buttonIndex === k.code && p.controllerIndex === k.controllerIndex)
          )
        case 'keycode-button':
          const keyboardEventType = eventType === 'down' ? 'keydown' : 'keyup'
          return key$.pipe(
            filter(
              (ev) =>
                k.code === (ev as KeyboardEvent).keyCode &&
                (ev as KeyboardEvent).type === keyboardEventType &&
                !(ev as KeyboardEvent).repeat
            )
          )
        case 'mouse-button':
          const m = eventType === 'down' ? mouseDown$ : mouseUp$
          return m.pipe(filter((ev) => whichButtonPressed(ev as PointerEvent) === k.button))
      }
    })
  )
}

function useKeycodeEvents<T extends InputMap>(
  eventType: ButtonEventType,
  inputMap: T,
  key: keyof T['buttons'],
  sink: () => void
) {
  const button$ = buildStream(eventType, inputMap, key)

  useEffect(() => {
    const s = button$.subscribe(sink)
    return () => s.unsubscribe()
  }, [button$, eventType, sink])
}

export function useButtonPressed<T extends InputMap>(
  inputMap: T,
  key: keyof T['buttons'],
  sink: () => void
) {
  useKeycodeEvents('down', inputMap, key, sink)
}

export function useButtonReleased<T extends InputMap>(
  inputMap: T,
  key: keyof T['buttons'],
  sink: () => void
) {
  useKeycodeEvents('up', inputMap, key, sink)
}

export function useButtonHeld<T extends InputMap>(
  inputMap: T,
  key: keyof T['buttons'],
  intervalMs: number,
  sink: () => void
) {
  const keys = inputMap.buttons[key as string]

  const pressed$ = buildStream('down', inputMap, key).pipe(map((_) => 'down'))
  const released$ = buildStream('up', inputMap, key).pipe(map((_) => 'up'))

  useEffect(() => {
    const s = merge(pressed$, released$)
      .pipe(
        switchMap((ev) => {
          if (ev === 'down') {
            return interval(intervalMs)
          } else {
            return EMPTY
          }
        })
      )
      .subscribe(sink)

    return () => s.unsubscribe()
  }, [keys, intervalMs, sink])
}

export function useAxis<T extends InputMap>(
  inputMap: T,
  key: keyof T['axes'],
  sink: (v: number) => void
) {
  useEffect(() => {
    const axes = inputMap.axes[key as string]

    // map each axis to the relevant source stream
    // & merge them together
    const streams = merge(
      ...axes.map((a) => {
        switch (a.type) {
          case 'gamepad-axis':
            return axes$.pipe(
              filter(
                (p) =>
                  p.axisIndex === a.axis &&
                  p.controllerIndex === a.controllerIndex &&
                  Math.abs(p.value) > a.threshold
              ),
              map((p) => p.value)
            )
          case 'mouse-axis':
            switch (a.axis) {
              case 'x':
                return mousePosNormalisedX$
              case 'y':
                return mousePosNormalisedY$
            }
        }
      })
    )

    const sub = streams.pipe(distinctUntilChanged()).subscribe(sink)

    return () => sub.unsubscribe()
  }, [sink])
}
