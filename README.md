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
  Current Version: v0.11.4
</p>

> Sous **le pont** Mirabeau coule la Seine et nos amours -- Guillaume Apollinaire

*Le pont* means "the bridge" in French.

You can bridge the webview and react-native by using `lepont` i.e. you can invoke the functions of react-native from the inside of browser (webview) and pass information back to browser (webview) from react-native side.

Do you remember [PhoneGap (Cordova)](https://en.wikipedia.org/wiki/Apache_Cordova)? `lepont` is something like PhoneGap on top of react-native.

React Native already have large swathe of library ecosystem. You can leverage its power from browser by using `lepont`.

# Usage

First install it:

```sh
npm install --save lepont
# or
yarn add lepont
```

Let's vibrate your phone from browser (using React Native's Vibration module).

On react-native side:

```tsx
import { useBridge } from 'lepont'
import { Vibration } from 'react-native'
import { WebView } from 'react-native-webview'

const App = () => {
  const [ref, onMessage] = useBridge(
    (registry) => {
      // Registers the `vibrate` handler on react-native side
      registry.register('vibrate', () => Vibration.vibrate(1000))
    }
  )

  return (
    <WebView
      // Loads html.
      source={{ uri: 'Web.bundle/index.html' }}
      // Sets "ref" to send the messages to the browser
      ref={ref}
      // Sets "onMessage" to receive the messages from the browser
      onMessage={onMessage}
      javaScriptEnabled
    />
  )
}

export default App
```

Then send `vibrate` message from the browser:

```ts
import { sendMessage } from 'lepont/browser'

await sendMessage({ type: 'vibrate' })
```

This makes the phone vibrate for 1000 milliseconds! 👍

## Sends multiple events from react-native side

On react-native side

```tsx
import { useBridge } from 'lepont'
import { WebView } from 'react-native-webview'

const App = () => {
  const [ref, onMessage] = useBridge((registry) => {
    registry.register('streaming-message', (_, bridge) => {
      setInterval(() => {
        bridge.sendMessage({
          type: 'streaming-event',
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
sendMessage({ type: 'streaming-message' })

on('streaming-event', (payload) => {
  // This fires every second from react-native side! :)
  console.log(`payload=${payload}`)
})
```

# Package html in the App

You can package your html and all other assets (css, js) into your app, and we strongly recommend that strategy for reducing significantly the app load time.

See [this article](https://medium.com/@caphun/react-native-load-local-static-site-inside-webview-2b93eb1c4225) for how to bundle the static web assets in your react-native apps.

# Module (LePont bridge) ecosystem

LePont aims to have wide range of plugin ecosystem. A lepont plugin is called *a lepont bridge*.

Currently LePont supports a few of plugins, but tries to support as many as possible in future.

The example of plugin usage:

```tsx
import React from 'react'
import { WebView } from 'react-native-webview'
import { useBridge } from 'lepont'
import { AsyncStorageBridge } from '@lepont/async-storage/bridge'
import AsyncStorage from '@react-native-community/async-storage'

const App = () => {
  const [ref, onMessage] = useBridge(
    AsyncStorageBridge(AsyncStorage)
  )

  return (
    <WebView
      source={{ uri: 'Web.bundle/index.html' }}
      ref={ref}
      onMessage={onMessage}
      javaScriptEnabled
    />
  )
}
```

The browser side:

```ts
import { setItem, getItem } from '@lepont/async-storage'

await setItem('key', 'value')
await getItem('key') // => 'value'
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

See the following official plugins and their implementations for how to write a plugin. We also have [yeoman generator](https://github.com/kt3k/generator-lepont-bridge) for lepont plugin.

You can scaffold the plugin repository by hitting the following command:

```
npm i -g yo generator-lepont-bridge
yo lepont-bridge
```

# Official Plugins

- [@lepont/async-storage][]
  - Store data up to 6MB.
- [@lepont/share][]
  - Share text and files.
- [@lepont/permissions-android][]
  - Check and request permissions on Android devices.
- [@lepont/platform][]
  - Get the platform information.

# TODO Plugins (contributions welcome)
- `@lepont/cameraroll`
  - Wrapper of `@react-native-community/cameraroll`
- `@lepont/fs`
  - Wrapper of `react-native-fs`
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
[@lepont/permissions-android]: https://github.com/kt3k/lepont-permissions-android
[@lepont/platform]: https://github.com/kt3k/lepont-platform
[AsyncStorage]: https://github.com/react-native-community/async-storage
