

<a href=""><img src="https://github.com/bfollington/use-input/raw/main/banner.png" /></a>
<br />

<p align="center">
  <a href="https://github.com/bfollington/use-input/actions?query=workflow%3A%22Build%22"><img alt="Build" src="https://github.com/bfollington/use-input/workflows/Build/badge.svg"></a>
<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/bfollington/use-input">
<img alt="GitHub" src="https://img.shields.io/github/license/bfollington/use-input">

<br>
  <img alt="npm" src="https://img.shields.io/npm/v/@twopm/use-input">
<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/@twopm/use-input">

</p><br>

<p align="center"><strong>use-input</strong> is an elegant, typesafe input management system for React supporting keyboard, mouse and gamepad (soon).</p>
  
<p align="center"><a href="https://furo.netlify.app/">👁 &nbsp;Live Demo</a><br> (source in <code>packages/example</code>)</p>

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

Soon

- `useMouseButtonPressed(callback)`
- `useMouseButtonReleased(callback)`
- `useAxis(callback, throttleInterval)`

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
