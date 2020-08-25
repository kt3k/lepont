import { useState, useEffect } from 'react'
import { Message, BridgePayload, BridgeRequestPayload } from './types'

type WebView = {
  injectJavaScript: (s: string) => void
}

export type Bridge = {
  sendMessage: <T>(m: Message<T>) => void
}

export type BridgeImpl<T> = (payload: T, bridge: Bridge) => unknown

export type BridgeOption = (registry: Registry) => unknown

type WebViewRef = (wv: WebView | null) => void
// TODO: type event object
type WebViewOnMessage = (event: any) => unknown

export function useBridge(
  ...options: BridgeOption[]
): [WebViewRef, WebViewOnMessage, { registry: Registry }] {
  const [registry] = useState<Registry>(() => new Registry())
  useEffect(() => {
    registry.clear()
    options.forEach(option => option(registry))
  }, [registry, ...options])
  return [registry.ref, registry.onMessage, { registry }]
}

export class Registry implements Bridge {
  webView: WebView | null = null

  registry: { [key: string]: BridgeImpl<any> } = {}

  register<T>(type: string, handler: BridgeImpl<T>) {
    this.registry[type] = handler
  }

  ref = (webView: WebView | null): void => {
    this.webView = webView
  }

  clear = (): void => {
    this.registry = {}
  }

  onMessage = async <T>(e: any): Promise<void> => {
    const data = JSON.parse(e.nativeEvent.data) as BridgeRequestPayload<T>
    const { id, message } = data
    const { type, payload } = message
    if (!type) {
      this.send({
        type: 'result',
        id,
        message: { type, payload: undefined },
        error: { message: `Message type cannot be empty: ${type} is given` }
      })
      return
    }
    const registrant = this.registry[type]

    if (!registrant) {
      this.send({
        type: 'result',
        id,
        message: { type, payload: undefined },
        error: { message: `No entry for message type: ${type}` }
      })
      return
    }

    try {
      const res = await registrant(payload, this)
      this.send({
        type: 'result',
        id,
        message: { type, payload: res }
      })
    } catch (e) {
      this.send({
        type: 'result',
        id,
        message: { type, payload: undefined },
        error: { message: e.message }
      })
    }
  }

  sendMessage<T>(message: Message<T>): void {
    this.send({
      type: 'event',
      message
    })
  }

  send<T, S>(p: BridgePayload<T, S>) {
    if (!this.webView) {
      console.error('webView for lepont registry is not ready!')
      return
    }
    this.webView.injectJavaScript(`LePont.recv(${JSON.stringify(p)})`)
  }
}
