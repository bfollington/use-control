import * as React from "react"
import { useCallback, useEffect } from "react"

export const TICK = 16
type Mapping = {
  [action: string]: number[]
}
type MappingT = {
  [keyCode: number]: string[]
}
type InputCallbackMap<M extends Mapping> = {
  [Property in keyof Partial<M>]: {
    onPressed?: () => void
    onHeld?: () => void
    onReleased?: () => void
  }
}
function tryGet<U, V extends { [k: string]: U }>(data: V, key: keyof V, def: U) {
  if (data[key]) {
    return data[key]
  } else {
    ;(data as any)[key] = def
    return data[key]
  }
}
function transposeMapping(mapping: Mapping): MappingT {
  const t: any = {}
  for (let action in mapping) {
    const keyCodes = mapping[action]
    keyCodes.forEach((k) => tryGet(t, k, []).push(action))
  }
  return t
}
type InputState = {
  pressed: boolean
  released: boolean
  held: boolean
}

type InputMapKey<T> = keyof T

type InputMapState<T> = {
  [Property in InputMapKey<T>]: InputState
}

function createInputMap<M extends Mapping>(mapping: M) {
  const keys = Object.keys(mapping) as InputMapKey<M>[]
  const map = {} as InputMapState<M>

  for (const k of keys) {
    map[k] = { pressed: false, released: false, held: false }
  }

  return map as InputMapState<M>
}
type InputAction<M extends Mapping> =
  | { type: "pressed"; action: keyof M }
  | { type: "released"; action: keyof M }
  | { type: "released-timeout"; action: keyof M }
  | { type: "pressed-timeout"; action: keyof M }
function inputReducer<M extends Mapping>(state: InputMapState<M>, action: InputAction<M>) {
  switch (action.type) {
    case "pressed":
      return {
        ...state,
        [action.action]: { pressed: true, released: false, held: true },
      }
    case "released":
      return {
        ...state,
        [action.action]: { released: true, pressed: false, held: false },
      }
    case "released-timeout":
      return {
        ...state,
        [action.action]: { ...state[action.action], released: false },
      }
    case "pressed-timeout":
      return {
        ...state,
        [action.action]: { ...state[action.action], pressed: false },
      }
  }
}
export function useInput<M extends Mapping>(mapping: M, callbacks: InputCallbackMap<M> = {} as InputCallbackMap<M>) {
  const mappingT = React.useMemo(() => transposeMapping(mapping), [mapping])
  const held = React.useRef({} as { [Property in InputMapKey<M>]: NodeJS.Timer })

  const [state, dispatch] = React.useReducer(
    inputReducer,
    React.useMemo(() => createInputMap(mapping), [mapping]),
  )

  const onKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      if (mappingT[ev.keyCode] && !ev.repeat) {
        mappingT[ev.keyCode].forEach((a: InputMapKey<M>) => {
          dispatch({ type: "pressed", action: a as any })
          setTimeout(() => {
            dispatch({ type: "pressed-timeout", action: a as any })
          }, TICK)

          const onPressed = callbacks[a]?.onPressed
          if (onPressed) {
            onPressed()
          }

          if (held.current[a]) {
            clearInterval(held.current[a])
          }
          held.current[a] = setInterval(() => {
            const onHeld = callbacks[a]?.onHeld
            if (onHeld) {
              onHeld()
            }
          }, TICK)
        })
      }
    },
    [dispatch, mappingT, callbacks],
  )
  const onKeyUp = useCallback(
    (ev: KeyboardEvent) => {
      if (mappingT[ev.keyCode] && !ev.repeat) {
        mappingT[ev.keyCode].forEach((a) => {
          dispatch({ type: "released", action: a })
          setTimeout(() => {
            dispatch({ type: "released-timeout", action: a })
          }, TICK)
          if (held.current[a]) {
            clearInterval(held.current[a])
          }

          const onReleased = callbacks[a]?.onReleased
          if (onReleased) {
            onReleased()
          }
        })
      }
    },
    [dispatch, mappingT, callbacks],
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("keyup", onKeyUp)
    }
  }, [onKeyDown, onKeyUp])

  return state
}
