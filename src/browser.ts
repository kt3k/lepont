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
  resolverTable: { [key: string]: [(arg0: any) => void, (arg0: any) => void] } = {}

  recv(p: BridgePayload) {
    const type = p.type
    switch(p.type) {
      case 'result':
        this.onResult(p)
        break;
      case 'event':
        this.onEvent(p.message)
        break;
      default:
        throw new Error(`Unknown bridge payload type ${type}`)
    }
  }

  /**
   * Handles the message from the webview.
   */
  onEvent({ type, payload }: Message): void {
    this.emit(type, payload)
  }

  /**
   * Handles the result from the webview's BridgeHandler.
   */
  onResult(resPayload: BridgeResultPayload): void {
    const { id, message, error } = resPayload
    const resolver = this.resolverTable[id]
    if (!resolver) {
      console.error(`Resolver for id=${id} not found.`)
      return
    }
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
  async sendMessage<T>(message: Message): Promise<T> {
    const id = uniqId()
    ;(window as any).ReactNativeWebView.postMessage(JSON.stringify({
      id,
      message,
    }), "*")
    return new Promise<T>((resolve, reject) => {
      this.resolverTable[id] = [resolve, reject]
    })
  }
}

const bridge = new Bridge()

export function sendMessage<T>(m: Message): Promise<T> {
  return bridge.sendMessage<T>(m)
}

export function on(type: string, cb: (arg0: any) => void) {
  return bridge.on(type, cb)
}

export function off(type: string, cb: (arg0: any) => void) {
  return bridge.off(type, cb)
}

Object.assign(window, { LePont: bridge })
