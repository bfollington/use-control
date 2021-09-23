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
import { initGamepad, teardownGamepad } from './input/gamepad'

export {
  useButtonHeld as useButtonHeld,
  useButtonPressed as useButtonPressed,
  useButtonReleased as useButtonReleased,
  useAxis as useAxis,
  initGamepad as initGamepad,
  teardownGamepad as teardownGamepad,
  keycode as keycode,
  gamepadAxis as gamepadAxis,
  gamepadButton as gamepadButton,
  mouseAxis as mouseAxis,
  mouseButton as mouseButton,
}
