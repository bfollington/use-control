import React from 'react'
import { fromEvent, identity } from 'rxjs'
import { distinctUntilChanged, map, pairwise, sampleTime, share } from 'rxjs/operators'

const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(share())
export const mouseDown$ = fromEvent<PointerEvent>(window, 'pointerdown').pipe(share())
export const mouseUp$ = fromEvent<PointerEvent>(window, 'pointerup').pipe(share())

export type MouseButton = 'none' | 'left' | 'right' | 'middle'
export const MOUSEBUTTONS: { [id: number]: MouseButton } = {
  0: 'none',
  1: 'left',
  2: 'right',
  4: 'middle',
  // 8: 4th button (typically the "Browser Back" button)
  // 16 : 5th button (typically the "Browser Forward" button)
}

export const MOUSEBUTTONS_SAFARI: { [id: number]: MouseButton } = {
  0: 'none',
  1: 'left',
  2: 'middle',
  3: 'right',
}

export function whichButtonPressed(ev: PointerEvent) {
  return !ev.buttons ? MOUSEBUTTONS_SAFARI[ev.which] : MOUSEBUTTONS[ev.buttons]
}

export const mousePos$ = mouseMove$.pipe(
  map((ev: MouseEvent) => [ev.clientX, ev.clientY]),
  distinctUntilChanged(),
  share()
)
export const mousePosDelta$ = mousePos$.pipe(
  pairwise(),
  map(([[ax, ay], [bx, by]]) => [bx - ax, by - ay]),
  share()
)
export const mousePosNormalised$ = mousePos$.pipe(
  map(([x, y]) => [
    x / document.documentElement.clientWidth,
    y / document.documentElement.clientHeight,
  ]),
  share()
)

// axis isolated streams
// X
export const mousePosX$ = mouseMove$.pipe(
  map((ev: MouseEvent) => ev.clientX),
  distinctUntilChanged(),
  share()
)
export const mousePosDeltaX$ = mousePosX$.pipe(
  pairwise(),
  map(([ax, bx]) => bx - ax),
  share()
)
export const mousePosNormalisedX$ = mousePosX$.pipe(
  map((x) => x / document.documentElement.clientWidth),
  share()
)

// Y
export const mousePosY$ = mouseMove$.pipe(
  map((ev: MouseEvent) => ev.clientY),
  distinctUntilChanged(),
  share()
)
export const mousePosDeltaY$ = mousePosY$.pipe(
  pairwise(),
  map(([ay, by]) => by - ay),
  share()
)
export const mousePosNormalisedY$ = mousePosY$.pipe(
  map((y) => y / document.documentElement.clientHeight),
  share()
)

export function useMouseMove(sink: (p: number[]) => void, throttleMs?: number) {
  React.useEffect(() => {
    const s = mousePos$.pipe(throttleMs ? sampleTime(throttleMs || 0) : identity).subscribe(sink)

    return () => s.unsubscribe()
  }, [sink, throttleMs])
}

export function useMouseMoveNormalised(sink: (p: number[]) => void, throttleMs?: number) {
  React.useEffect(() => {
    const s = mousePos$
      .pipe(
        throttleMs ? sampleTime(throttleMs || 0) : identity,
        map(([x, y]) => [
          x / document.documentElement.clientWidth,
          y / document.documentElement.clientHeight,
        ])
      )
      .subscribe(sink)

    return () => s.unsubscribe()
  }, [sink, throttleMs])
}

export function useMouseDelta(sink: (d: number[]) => void, throttleMs?: number) {
  React.useEffect(() => {
    const s = mousePosDelta$
      .pipe(throttleMs ? sampleTime(throttleMs || 0) : identity)
      .subscribe(sink)

    return () => s.unsubscribe()
  }, [sink, throttleMs])
}
