

<a href=""><img src="https://github.com/bfollington/use-control/raw/main/banner.png" /></a>
<br />

[![Version](https://img.shields.io/npm/v/use-control?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/use-control)
[![Twitter](https://img.shields.io/twitter/follow/vivavolt?label=%40vivavolt&style=flat&colorA=000000&colorB=000000&logo=twitter&logoColor=000000)](https://twitter.com/vivavolt)
[![Donate (ETH)](https://img.shields.io/badge/Donate-(ETH)-f5f5f5?style=flat&colorA=000000&colorB=000000)](https://blockchain.com/eth/address/0x981e493b795A7a28c43Bf8d7a8E125C419435Fa7)
[![Donate ($)](https://img.shields.io/badge/Donate-($)-f5f5f5?style=flat&colorA=000000&colorB=000000)](https://ko-fi.com/vivavolt)
![Language](https://img.shields.io/github/languages/top/bfollington/use-control?style=flat&colorA=000000&colorB=000000)
![License](https://img.shields.io/github/license/bfollington/use-control?style=flat&colorA=000000&colorB=000000)
![Bundle Size](https://img.shields.io/bundlephobia/min/use-control?style=flat&colorA=000000&colorB=000000)
[![Build](https://github.com/bfollington/use-control/workflows/Build/badge.svg)](https://github.com/bfollington/use-control/actions?query=workflow%3A%22Build%22)

<p><strong>use-control</strong> is an elegant, typesafe input management system for React supporting keyboard, mouse and gamepad (soon).</p>
  
<p><a href="https://use-control.vercel.app/">👁 &nbsp;Live Demo</a> (source in <a href="https://github.com/bfollington/use-control/tree/main/packages/example"><code>packages/example</code></a>)</p>

# Example

```tsx
const inputMap = {
  left: [KEYS.left_arrow, KEYS.a],
  right: [KEYS.right_arrow, KEYS.d]
}

const MyComponent = () => {
  const [count, setCount] = useState(0)

  useActionPressed(inputMap, "left", () => {
    setCount(count - 1)
  })

  useActionPressed(inputMap, "right", () => {
    setCount(count + 1)
  })

  useMouseMove(([x, y]) => {
    console.log("mouse pos", x, y)
  }, 50) // Throttle to 50ms intervals

  return <div>{count}</div>
}
```

# Installation
```
npm i use-control
```

```
yarn add use-control
```

# API Overview

- `useActionPressed(inputMap, actionName, callback)`
- `useActionReleased(inputMap, actionName, callback)`
- `useActionHeld(inputMap, actionName, throttleInterval, callback)`
- `useMouseMove(callback, throttleInterval)`
- `useMouseMoveNormalised(callback, throttleInterval)`
- `useMouseDelta(callback, throttleInterval)`

## Roadmap

- Gamepad API support for input action mapping
- `useMouseButtonPressed(callback)`
- `useMouseButtonReleased(callback)`
- `useAxis(callback, throttleInterval)` (Gamepad API + Mouse)

# Why use-control?

Personally, I'm just tired of writing `useEffect` with `document.addEventListener('keydown', ...)`. `use-control` is the API I've always dreamed of for dealing with input events, it's heavily inspired by my experience with input systems in game development.

# Usage 

`use-control` relies on the core concept of an `Input Mapping` of keycodes, mouse buttons and gamepad buttons into `Input Actions` (i.e. "left", "right", "jump", "select"), declared as a JS object:

```ts
const inputMap = {
  left: [KEYS.left_arrow, KEYS.a],
  right: [KEYS.right_arrow, KEYS.d],
  jump: [KEYS.space, KEYS.l_shift]
}
```

You _should_ consider declaring this statically and sharing the mapping across your app but it can be dynamically updated at runtime and different mappings can be used in different components as needed.

These mappings allow us to think at a higher level when consuming input, instead of asking "what events do I need to bind to?" or "what keycode am I listening for?" we can simply ask "what happens when the user presses the `jump` button?"

```ts
useActionPressed(inputMap, "jump", () => {
  player.addForce(0, -10)
})
```

## Running this repo

### Bootstrap

```
yarn
yarn bootstrap
```

### Running the examples

```
cd packages/use-control
yarn build
cd ../example
yarn start
```
