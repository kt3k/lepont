import React, {Fragment} from 'react';
import {
  StatusBar,
} from 'react-native';
import { useRegistry, useBridge } from 'lepont';
import { WebView } from 'react-native-webview';

const webBundlePrefix = Platform.OS === 'android' ? 'file:///android_asset/' : ''

const App = () => {
  const registry = useRegistry()
  useBridge(registry, 'foo', async (payload, bridge) => {
    setInterval(() => {
      bridge.sendMessage({ type: 'bar', payload })
    }, 1000)
    console.log('foo')
    return 43
  })
  return (
    <WebView
      javaScriptEnabled
      source={{ uri: `${webBundlePrefix}Web.bundle/loader.html` }}
      originWhitelist={['*']}
      ref={registry.ref}
      onMessage={registry.onMessage}
    />
  );
};

export default App;
