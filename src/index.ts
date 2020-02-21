import { useState, useEffect } from 'react'
import { Message, MessageWithId } from './types'

type WebView = {
  injectJavaScript: (s: string) => void
}

type Bridge = {
  sendMessage: (m: Message) => void
}

type BridgeHandler<T> = (payload: T, bridge: Bridge) => unknown

export function useRegistry(): Registry | null {
  const [registry, _] = useState<Registry>(new Registry())
  return registry
}

export function useBridge<T>(
  registry: Registry,
  type: string,
  handler: BridgeHandler<T>
) {
  useEffect(() => {
    registry.register(type, handler)
  }, [registry])
}

class Registry implements Bridge {
  webView: WebView | null = null

  registry: { [key: string]: BridgeHandler<any> } = {}

  register(type: string, handler: BridgeHandler<any>) {
    this.registry[type] = handler
  }

  ref = (webView: WebView): void => {
    this.webView = webView
  }

  onMessage = async (fromWebView: MessageWithId): Promise<unknown> => {
    const { id, message } = fromWebView
    const { type, payload } = message
    if (!type) {
      console.error(`message type cannot be empty: ${type} is given`)
      return
    }
    const registrant = this.registry[type]

    if (!registrant) {
      console.error(`Error: No entry for message type: ${type}`)
      return
    }

    const res = await registrant(payload, this)
    const resPayload = JSON.stringify({ id, res })
    this.injectScript(`LePont.onResult(${resPayload})`)
  }

  sendMessage(m: Message): void {
    const msgPayload = JSON.stringify(m)
    this.injectScript(`LePont.onMessage(${msgPayload})`)
  }

  injectScript(src: string): void {
    if (!this.webView) {
      console.error('webView for lepont registry is not ready!')
      return
    }
    this.webView.injectJavaScript(src)
  }
}
