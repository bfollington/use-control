

<a href=""><img src="https://raw.githubusercontent.com/bfollington/furo/master/banner.png" /></a>
<br />

<p align="center">
  <a href="https://github.com/bfollington/furo/actions?query=workflow%3A%22Build%22"><img alt="Build" src="https://github.com/bfollington/furo/workflows/Build/badge.svg"></a>
<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/bfollington/furo">
<img alt="GitHub" src="https://img.shields.io/github/license/bfollington/furo">

<br>
  <img alt="npm" src="https://img.shields.io/npm/v/@twopm/furo">
<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/@twopm/furo">

</p><br>

<p align="center"><strong>Furō</strong> is a simple but powerful messaging layer for <code>React</code> applications. It can be used to tame complex asynchronous workflows and preserve sanity.
  
<p align="center"><a href="https://furo.netlify.app/">👁 &nbsp;Live Demo</a><br> (source in <code>packages/example</code>)</p>

# Installation
```
npm i @twopm/furo
```

```
yarn add @twopm/furo
```

# Why furō?

There are already multiple event bus libraries for React:

- https://github.com/goto-bus-stop/react-bus
- https://github.com/arkency/event-bus
- https://github.com/fabienjuif/use-bus

However, none of these allow for strongly typed messages in TypeScript or multiple event streams. Furō also provides a [debug / history tracking](https://github.com/bfollington/furo#history-tracking) system loosely inspired by [re-frame-flow](https://github.com/ertugrulcetin/re-frame-flow).

# Simple Example

```tsx
  const Demo = () => {
    const { dispatch, useSubscribe } = useEvents()
    const [form, setForm] = useState({})
    const onSubmit = () => { dispatch({ type: 'form-submit-requested', payload: form}) }

    useSubscribe('form-submit-success', () => {
      alert('Success!')
    })

    useSubscribe('form-submit-failed', (ev) => {
      alert('Failed, see console')
      console.error('Form submission failed', ev.errors)
    })

    return (
      <div>
        {/* form goes here*/}
        <button type="submit" onClick={onSubmit}>Submit</button>
      </div>
    )
  }

  // ... elsewhere

  const Consumer = () => {
    const { useSubscribe } = useEvents()

    useSubscribe('form-submit-requested', async (ev, dispatch) => {
      const res = await fetch(
        'https://example.com/profile',
          {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ev.payload),
        }
      ).then(r => r.json())

      if (res.ok) {
        dispatch({ type: 'form-submit-success' })
      } else {
        dispatch({ type: 'form-submit-failed', errors: res.errors })
      }
    })

    return null
  }
```

See the [full example](https://github.com/bfollington/furo/tree/master/packages/example) for more detail. 

You can also [view the live demo](https://furo.netlify.app/).

# History Tracking

**Furō** features a built-in history tracker. This can be enabled and disabled via a boolean supplied to `createBus()`. 

You can visualise which events precipitated one another in a tree format, including the payload of each event. The [full example](https://github.com/bfollington/furo/tree/master/packages/example) has a reference usage of `<HistoryDebugger />`. 

```
click::9
{}

  → inc::10
    {"amount":1}
  
  → fetch-trending::11
    {"language":"clojure"}
  
      → retrieved-trending::12
        {"repos":["tonsky/FiraCode","metabase/metabase","LightTable/LightTable", ...]}

click::13
{}

  → inc::14
    {"amount":1}

  → fetch-trending::15
    {"language":"haskell"}

      → retrieved-trending::16
        {"repos":["koalaman/shellcheck","jgm/pandoc","hasura/graphql-engine", ...]}

```

# Setup

// TODO

For now, copy the [example](https://github.com/bfollington/furo/tree/master/packages/example).

## Running this repo

### Bootstrap

```
yarn
yarn bootstrap
```

### Running the examples

```
cd packages/furo
yarn build
cd ../example
yarn start
```
