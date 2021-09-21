import { useEffect } from 'react'
import { EMPTY, fromEvent, interval, merge } from 'rxjs'
import { distinctUntilChanged, filter, groupBy, map, mergeAll, switchMap } from 'rxjs/operators'

export const keydown$ = fromEvent<KeyboardEvent>(document, 'keydown')
export const keyup$ = fromEvent<KeyboardEvent>(document, 'keyup')
export const key$ = merge(keydown$, keyup$).pipe(
  groupBy((e: KeyboardEvent) => e.keyCode),
  map((group: any) =>
    group.pipe(
      distinctUntilChanged(
        (a, b) => a === b,
        (e: KeyboardEvent) => e.type
      )
    )
  ),
  mergeAll()
)

function useKeyEvents(key: number, eventType: string, sink: () => void) {
  useEffect(() => {
    const s = key$
      .pipe(
        filter(
          (ev) =>
            (ev as KeyboardEvent).keyCode === key &&
            (ev as KeyboardEvent).type === eventType &&
            !(ev as KeyboardEvent).repeat
        )
      )
      .subscribe(sink)
    return () => s.unsubscribe()
  }, [key, eventType, sink])
}

export function useKeyDown(key: number, sink: () => void) {
  useKeyEvents(key, 'keydown', sink)
}

export function useKeyUp(key: number, sink: () => void) {
  useKeyEvents(key, 'keyup', sink)
}

export function useKeyHeld(key: number, intervalMs: number, sink: () => void) {
  useEffect(() => {
    const s = key$
      .pipe(
        filter((ev) => (ev as KeyboardEvent).keyCode === key),
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
  }, [key, intervalMs, sink])
}
