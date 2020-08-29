import React, { Fragment } from 'react'
import { StatusBar, Vibration } from 'react-native'
import { useBridge } from 'lepont'
import { WebView } from 'react-native-webview'

const webBundlePrefix =
  Platform.OS === 'android' ? 'file:///android_asset/' : ''

const defer = (n: number) => new Promise((resolve) => setTimeout(resolve, n))

const App = () => {
  const [ref, onMessage] = useBridge((registry) => {
    registry.register('hello', () => {
      return 'world'
    })
  }, (registry) => {
    registry.register('vibration', (payload) => {
      Vibration.vibrate(payload.duration || 1000)
    })
  }, (registry) => {
    registry.register('streaming', async (payload, bridge) => {
      for (const _ of Array(payload.n || 1)) {
        await defer(1000)
        bridge.sendMessage({
          type: 'streaming-response',
        })
      }
    })
  })

  return (
    <WebView
      javaScriptEnabled
      source={{ uri: `${webBundlePrefix}Web.bundle/loader.html` }}
      originWhitelist={['*']}
      ref={ref}
      onMessage={onMessage}
    />
  )
}

export default App
