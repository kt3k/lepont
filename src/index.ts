import { useState, useEffect } from 'react'
import { Message, MessageFromWebView } from './types'

type Registry = {
  ref: unknown
  onMessage: (m: MessageFromWebView) => void
}

type Bridge = {
  sendMessage: (m: Message) => void
}

type BridgeHandler<T> = (payload: T, bridge: Bridge) => unknown

export function useRegistry(): RegistryImpl {
  const [registry, setRegistry] = useState<Registry | null>(null)
  useEffect(() => {
    setRegistry(new Registry())
  }, [])
  return registry
}

export const useBridge<T>(registry: Registry, type: string, handler: BridgeHandler<T>) {
  if (registry) {
    registry.register(type, handler)
  }
}

class RegistryImpl implements Bridge & Registry {
  webView: WebView

  registry: { [key: string]: BridgeHandler<any> }

  constructor() {
    this.registry = {}
  }

  register(type: string, handler: BridgeHandler<any>) {
    this.registry[type] = handler
  }

  ref(webView: WebView) {
    this.webView = webView
  }

  async onMessage(fromWebView: MessageFromWebView): Promise<unknown> {
    const { id, message } = fromWebView
    const type = message.type
    if (!type) {
      console.error(`message type cannot be empty: ${type} is given`)
      return
    }
    const registrant = this.registry[type]

    if (!registrant) {
      console.error(`Error: No entry for message type: ${type}`)
      return
    }

    const res = await registrant.handler(msg.payload)
    const resPayload = JSON.stringify({ id, res })
    this.ref.injectJavaScript(`LePont.onResult(${resPayload})`)
  }

  sendMessage(m: Message) {
    const msgPayload = JSON.strigify(m)
    this.ref.injectJavaScript(`LePont.onMessage(${msgPayload})`)
  }
}
