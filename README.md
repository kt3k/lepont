<p align="center">
  <img src="https://raw.githubusercontent.com/kt3k/lepont/master/design/lepont.png" width="150" />
  A native <-> browser (webview) bridge library for react-native
</p>

Current Version: v0.1.0 (WIP)

# Usage

On react-native side

```tsx
import { useBridge, useRegistry } from 'lepont'
import { WebView } from 'react-native-webview'

const App = () => {
  const registry = useRegistry()
  const useBridge(registry, 'my-api', async (payload, bridge) => {
    bridge.sendMessage({
      type: 'my-api-phase',
      payload: 'started',
    })

    const res = await myProcess()

    return res
  })

  return (
    <WebView
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

// Here res is the res from react-native side.
```

# LICENSE

MIT
