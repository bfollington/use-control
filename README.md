

<a href=""><img src="https://github.com/bfollington/use-input/raw/main/banner.png" /></a>
<br />

[![Version](https://img.shields.io/npm/v/@twopm/use-input?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/@twopm/use-input)
[![Twitter](https://img.shields.io/twitter/follow/vivavolt?label=%40vivavolt&style=flat&colorA=000000&colorB=000000&logo=twitter&logoColor=000000)](https://twitter.com/vivavolt)
[![ETH](https://img.shields.io/badge/ETH-f5f5f5?style=flat&colorA=000000&colorB=000000)](https://blockchain.com/eth/address/0x981e493b795A7a28c43Bf8d7a8E125C419435Fa7)
![Language](https://img.shields.io/github/languages/top/bfollington/use-input?style=flat&colorA=000000&colorB=000000)
![License](https://img.shields.io/github/license/bfollington/use-input?style=flat&colorA=000000&colorB=000000)
![Bundle Size](https://img.shields.io/bundlephobia/min/@twopm/use-input?style=flat&colorA=000000&colorB=000000)
[![Build](https://github.com/bfollington/use-input/workflows/Build/badge.svg)](https://github.com/bfollington/use-input/actions?query=workflow%3A%22Build%22)

<p><strong>use-input</strong> is an elegant, typesafe input management system for React supporting keyboard, mouse and gamepad (soon).</p>
  
<p><a href="https://use-input.vercel.app/">👁 &nbsp;Live Demo</a> (source in <a href="https://github.com/bfollington/use-input/tree/main/packages/example"><code>packages/example</code></a>)</p>

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
npm i @twopm/use-input
```

```
yarn add @twopm/use-input
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

# Why use-input?

Personally, I'm just tired of writing `useEffect` with `document.addEventListener('keydown', ...)`. `use-input` is the API I've always dreamed of for dealing with input events, it's heavily inspired by my experience with input systems in game development.

# Usage 

`use-input` relies on the core concept of an `Input Mapping` of keycodes, mouse buttons and gamepad buttons into `Input Actions` (i.e. "left", "right", "jump", "select"), declared as a JS object:

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
cd packages/use-input
yarn build
cd ../example
yarn start
```
