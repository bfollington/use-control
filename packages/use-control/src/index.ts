import { useMouseDelta, useMouseMove, useMouseMoveNormalised } from './mouseStream'
import { useKeyDown, useKeyHeld, useKeyUp } from './keyStream'
import {
  useButtonHeld,
  useButtonPressed,
  useButtonReleased,
  keycode,
  gamepadAxis,
  gamepadButton,
  mouseAxis,
  mouseButton,
  useAxis,
} from './actions'
import { init, teardown, useGamepadAxis, useGamepadButtonPressed } from './gamepad'
import KEYS from './keys'

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
}
