import {
  gamepadAxis,
  gamepadButton,
  keycode,
  mouseAxis,
  mouseButton,
  useAxis,
  useButtonHeld,
  useButtonPressed,
  useButtonReleased,
} from './actions'
import GAMEPADS from './gamepads'
import { init, teardown, useGamepadAxis, useGamepadButtonPressed } from './gamepadStream'
import KEYS from './keys'
import { useKeyDown, useKeyHeld, useKeyUp } from './keyStream'
import { useMouseDelta, useMouseMove, useMouseMoveNormalised } from './mouseStream'

export {
  useMouseDelta as useMouseDelta,
  useMouseMove as useMouseMove,
  useMouseMoveNormalised as useMouseMoveNormalised,
  useButtonHeld as useButtonHeld,
  useButtonPressed as useButtonPressed,
  useButtonReleased as useButtonReleased,
  useAxis as useAxis,
  useKeyDown as useKetDown,
  useKeyUp as useKeyUp,
  useKeyHeld as useKeyHeld,
  init as gamepadInit,
  teardown as gamepadTeardown,
  useGamepadAxis as useGamepadAxis,
  useGamepadButtonPressed as useGamepadButtonPressed,
  keycode as keycode,
  gamepadAxis as gamepadAxis,
  gamepadButton as gamepadButton,
  mouseAxis as mouseAxis,
  mouseButton as mouseButton,
  KEYS as KEYS,
  GAMEPADS as GAMEPADS,
}
