import { useState, useEffect } from 'react'
import { Message, BridgePayload, BridgeRequestPayload } from './types'

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

  onMessage = async (e: any): Promise<unknown> => {
    const data = JSON.parse(e.nativeEvent.data) as BridgeRequestPayload
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

    const res = await registrant(payload, this)
    this.send({
      type: 'result',
      id,
      message: { type, payload: res }
    })
  }

  sendMessage(message: Message): void {
    this.send({
      type: 'event',
      message
    })
  }

  send(p: BridgePayload) {
    if (!this.webView) {
      console.error('webView for lepont registry is not ready!')
      return
    }
    this.webView.injectJavaScript(`LePont.recv(${JSON.stringify(p)})`)
  }
}
