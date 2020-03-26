class MockReactNativeWebView {
  postMessage(msg: string): void {}
}

export const ReactNativeWebView = new MockReactNativeWebView()
;(window as any).ReactNativeWebView
