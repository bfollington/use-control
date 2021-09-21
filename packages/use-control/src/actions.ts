import { useEffect } from 'react'
import { EMPTY, interval, merge } from 'rxjs'
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators'
import { axes$ } from './gamepad'
import { key$ } from './keyStream'
import { mousePosNormalisedX$, mousePosNormalisedY$ } from './mouseStream'

export function mouseButton(index: number) {
  return { type: 'mouse-button', index } as const
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

function useKeycodeEvents<T extends InputMap>(
  eventType: string,
  inputMap: T,
  key: keyof T['buttons'],
  sink: () => void
) {
  const keys = inputMap.buttons[key as string]

  useEffect(() => {
    const s = key$
      .pipe(
        filter(
          (ev) =>
            keys.some(
              (k) => k.type === 'keycode-button' && k.code === (ev as KeyboardEvent).keyCode
            ) &&
            (ev as KeyboardEvent).type === eventType &&
            !(ev as KeyboardEvent).repeat
        )
      )
      .subscribe(sink)
    return () => s.unsubscribe()
  }, [keys, eventType, sink])
}

export function useButtonPressed<T extends InputMap>(
  inputMap: T,
  key: keyof T['buttons'],
  sink: () => void
) {
  useKeycodeEvents('keydown', inputMap, key, sink)
}

export function useButtonReleased<T extends InputMap>(
  inputMap: T,
  key: keyof T['buttons'],
  sink: () => void
) {
  useKeycodeEvents('keyup', inputMap, key, sink)
}

export function useButtonHeld<T extends InputMap>(
  inputMap: T,
  key: keyof T['buttons'],
  intervalMs: number,
  sink: () => void
) {
  const keys = inputMap.buttons[key as string]

  useEffect(() => {
    const s = key$
      .pipe(
        filter((ev) =>
          keys.some((k) => k.type === 'keycode-button' && k.code === (ev as KeyboardEvent).keyCode)
        ),
        switchMap((ev) => {
          const kev = ev as KeyboardEvent
          if (kev.type === 'keydown') {
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
                  p.value > a.threshold
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
