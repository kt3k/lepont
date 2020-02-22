<p align="center">
  <img src="https://raw.githubusercontent.com/kt3k/lepont/master/design/lepont.png" width="150" />
</p>
<p align="center">
  A native <-> browser (webview) bridge library for react-native
</p>

<p align="center">
  Current Version: v0.5.3 (WIP)
</p>

> Sous le pont Mirabeau coule la Seine et nos amours
>
> - Guillaume Apollinaire



You can bridge the webview and react-native by using this libary. You can consider this module as PhoneGap (Cordova) on top of react-native.

See [this article](https://medium.com/@caphun/react-native-load-local-static-site-inside-webview-2b93eb1c4225) for how to bundle the static web assets in your react-native apps.

# Usage

First install it:

```sh
npm install --save lepont
# or
yarn add lepont
```

On react-native side

```tsx
import { useBridge, useRegistry } from 'lepont'
import { WebView } from 'react-native-webview'

const double = (n) => new Promise((resolve, _) => {
  setTimeout(() => resolve(n * 2), 300)
})

const App = () => {
  const registry = useRegistry()
  const useBridge(registry, 'my-api', (payload, _) => {
    return double(payload.foo)
  })

  return (
    <WebView
      source={{ uri: 'Web.bundle/index.html' }}
      javaScriptEnabled={true}
      ref={registry.ref}
      onMessage={registry.onMessage}
    />
  )
}

export default App
```

Browser side
```ts
import { sendMessage } from 'lepont/browser'

const res = await sendMessage({
  type: 'my-api',
  payload: { foo: 42 }
})
// => res is now 84 after 300ms. It's doubled on react-native side! :)
```

## Multiple events from react-native side

On react-native side

```tsx
import { useBridge, useRegistry } from 'lepont'
import { WebView } from 'react-native-webview'

const App = () => {
  const registry = useRegistry()
  const useBridge(registry, 'start-my-stream-event', (_, bridge) => {
    setInterval(() => {
      bridge.sendMessage({
        type: 'my-stream-event',
        payload: 'stream data!',
      })
    }, 1000)
  })

  return (
    <WebView
      source={{ uri: 'Web.bundle/index.html' }}
      javaScriptEnabled={true}
      ref={registry.ref}
      onMessage={registry.onMessage}
    />
  )
}

export default App
```

Browser side
```ts
import { sendMessage, on } from 'lepont/browser'

sendMessage({ type: 'start-my-stream-event' })

on('my-stream-event', (payload) => {
  // This fires every second from react-native side! :)
  console.log(`payload=${payload}`)
})
```

# API

## `lepont` module

`lepont` module is for react-native side.

### `useRegistry(): Registry`

React Hook. It returns a `lepont` handler registry. You can register handlers on this registry.

### `useBridge<T>(registry: Registry, type: string, handler: BridgeHandler<T>)`

Registers the handler to the registry by the given `type` name.

### `registry.ref`

You should pass this to `<WebView />`'s `ref` prop.

### `registry.onMessage`

You should pass this to `<WebView />`'s `onMessage` prop.

### `bridge.sendMessage(message: Message)`

Sends the message to browser side. To handle this message, you can register `on(type, handler)` call on browser side.

## `lepont/browser` module

`lepont/browser` module is for browser side.

### `sendMessage<T>(message: Message): Promise<T>`

Sends the message to react-native side.

### `on(type: string, handler: any => void)`

Registers the handler to the event of the given `type` name.

### `off(type: string, handler: any => void)`

Unregisters the handler from the event of the given `type` name.

# Write `lepont` plugin

You can write reusable `lepont` plugin by using the above APIs.

# LICENSE

MIT
