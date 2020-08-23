<p align="center">
  <img src="https://raw.githubusercontent.com/kt3k/lepont/master/design/lepont.png" width="150" />
</p>
<p align="center">
  A native <-> browser (webview) bridge library for react-native
</p>

<p align="center">
  <img src="https://github.com/kt3k/lepont/workflows/ci/badge.svg?branch=master">
  <a href="https://codecov.io/gh/kt3k/lepont">
    <img src="https://codecov.io/gh/kt3k/lepont/branch/master/graph/badge.svg" />
  </a>
</p>

<p align="center">
  Current Version: v0.11.2
</p>

> Sous le pont Mirabeau coule la Seine et nos amours -- Guillaume Apollinaire

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
import { useBridge } from 'lepont'
import { WebView } from 'react-native-webview'

type Payload = {
  foo: number
}

// This is your bridge implementation
const myBridgeImpl = (payload: Payload) => new Promise((resolve) => {
  setTimeout(() => resolve(payload.foo * 2), 300)
})

const App = () => {
  // Registers your bridge by the name `my-bridge`
  const [ref, onMessage] = useBridge((registry) => {
    registry.register('my-bridge', myBridgeImpl)
  })

  return (
    <WebView
      // Loads the html which uses your bridge.
      source={{ uri: 'Web.bundle/index.html' }}
      // Needed for sending the message from browser
      ref={ref}
      // Needed for receiving the message from browser
      onMessage={onMessage}
      javaScriptEnabled
    />
  )
}

export default App
```

Browser side
```ts
import { sendMessage } from 'lepont/browser'

const res = await sendMessage({
  type: 'my-bridge',
  payload: { foo: 42 }
})
// => res is now 84 after 300ms. It's doubled on react-native side! :)
```

## Multiple events from react-native side

On react-native side

```tsx
import { useBridge } from 'lepont'
import { WebView } from 'react-native-webview'

const App = () => {
  const [ref, onMessage] = useBridge((registry) => {
    registry.register('my-streaming-bridge', (_, bridge) => {
      setInterval(() => {
        bridge.sendMessage({
          type: 'my-streaming-event',
          payload: 'stream data!',
        })
      }, 1000)
    })
  })

  return (
    <WebView
      source={{ uri: 'Web.bundle/index.html' }}
      ref={ref}
      onMessage={onMessage}
      javaScriptEnabled
    />
  )
}

export default App
```

Browser side
```ts
import { sendMessage, on } from 'lepont/browser'

// This triggers the event streaming
sendMessage({ type: 'my-streaming-bridge' })

on('my-streaming-event', (payload) => {
  // This fires every second from react-native side! :)
  console.log(`payload=${payload}`)
})
```

# API

## `lepont` module

`lepont` module is for react-native side.

### `useBridge(...bridgeOptions: BridgeOption[]): [WebViewRef, WebViewOnMessage, { registry: Registry }]`

Registers the bridge to the registry by the given `BridgeOption`s. This returns `ref` and `onMessage` of WebView. You need to set these to `WebView` component to communicate with it.

example:

```tsx
const [ref, onMessage] = useBridge(registry => {
  registry.register('my-bridge', MyBridgeImpl)
})

return <WebView ref={ref} onMessage={onMessage} />
```

### `type BridgeOption = (registry: Registry) => unknown`

You can pass BridgeOpion functional option to `useBridge` hook. In this function you can register your bridge type and implementation through `registry.register` method.

### `Registry.register<T>(type: string, impl: BridgeImpl<T>): void`

You can register your bridge type and implementation with this method.

### `type BridgeImpl = <T>(payload: T, brdige: Bridge) => unknown`

This is the type of bridge implemetation. The 1st param is the payload of your bridge call. The second param is the bridge object. The returned value is serialized and sent back to browser as the result of bridge call. If you like to send back data multiple times to browser you can use `bridge.sendMessage` method.

### `bridge.sendMessage(message: Message): void`

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

TBD

# Official Plugins

- [@lepont/async-storage][]
  - Store data up to 6MB.
- [@lepont/share][]
  - Share text and/or files from the browser.

# TODO Plugins (contributions welcome)
- `@lepont/cameraroll`
  - Wrapper of `@react-native-community/cameraroll`
- `@lepont/device-info`
  - Access device information from browser
  - based on [react-native-device-info](https://github.com/react-native-community/react-native-device-info)
- `@lepont/communications`
  - Communication utilities
  - based on [react-native-communications](https://github.com/anarchicknight/react-native-communications)

# License

MIT

[@lepont/async-storage]: https://github.com/kt3k/lepont-async-storage
[@lepont/share]: https://github.com/kt3k/lepont-share
[AsyncStorage]: https://github.com/react-native-community/async-storage
