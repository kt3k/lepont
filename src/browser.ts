import { Message, BridgePayload, BridgeResultPayload } from './types'
import { EventEmitter } from 'events'

let cnt = 0
/**
 * Returns an unique id.
 */
function uniqId(): number {
  return cnt++
}

class Bridge extends EventEmitter {
  resolverTable: {
    [key: string]: [(arg0: any) => void, (arg0: any) => void]
  } = {}

  recv<T, S>(p: BridgePayload<T, S>) {
    const type = p.type
    switch (p.type) {
      case 'result':
        this.onResult(p)
        break
      case 'event':
        this.onEvent(p.message)
        break
      default:
        throw new Error(`Unknown bridge payload type ${type}`)
    }
  }

  /**
   * Handles the message from the webview.
   */
  onEvent<T>({ type, payload }: Message<T>): void {
    this.emit(type, payload)
  }

  /**
   * Handles the result from the webview's BridgeHandler.
   */
  onResult<T>(resPayload: BridgeResultPayload<T>): void {
    const { id, message, error } = resPayload
    const resolver = this.resolverTable[id]
    if (!resolver) {
      console.error(`Resolver for id=${id} not found.`)
      return
    }
    delete this.resolverTable[id]
    const [resolve, reject] = resolver

    if (error) {
      reject(new Error(error.message))
    } else {
      const { type, payload } = message
      resolve(payload)
    }
  }
  /**
   * Sends a message to webview's bridge handler.
   */
  async sendMessage<T, S>(message: Message<S>): Promise<T> {
    const id = uniqId()
    ;(window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        id,
        message
      })
    )
    return new Promise<T>((resolve, reject) => {
      this.resolverTable[id] = [resolve, reject]
    })
  }
}

const bridge = new Bridge()

export function sendMessage<T, S>(m: Message<S>): Promise<T> {
  return bridge.sendMessage<T, S>(m)
}

export function on(type: string, cb: (arg0: any) => void) {
  return bridge.on(type, cb)
}

export function off(type: string, cb: (arg0: any) => void) {
  return bridge.off(type, cb)
}

Object.assign(window, { LePont: bridge })

export function checkEnvironment(w: any = window): void {
  if (typeof w.ReactNativeWebView === 'undefined') {
    throw new Error(
      'ReactNativeWebView is undefined. Did you set onMessage of WebView?'
    )
  }
}

setTimeout(checkEnvironment, 300)
