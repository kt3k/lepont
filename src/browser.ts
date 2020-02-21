import { Message, MessageWithId } from './types'
import { EventEmitter } from 'events'

let cnt = 0
/**
 * Returns an unique id.
 */
function uniqId(): number {
  return cnt++
}

class Bridge extends EventEmitter {
  resolverTable: { [key: string]: (arg0: any) => void } = {}

  /**
   * Handles the message from the webview.
   */
  onMessage({ type, payload }: Message): void {
    this.emit(type, payload)
  }

  /**
   * Handles the result from the webview's BridgeHandler.
   */
  onResult(resPayload: MessageWithId): void {
    const { id, message } = resPayload
    const resolver = this.resolverTable[id]
    if (!resolver) {
      console.error(`Resolver for id=${id} not found.`)
      return
    }
    resolver(message)
  }
  /**
   * Sends a message to webview's bridge handler.
   */
  async sendMessage<T>(m: Message): Promise<T> {
    const id = uniqId()
    return new Promise<T>((r, _) => {
      this.resolverTable[id] = r
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

Object.assign(window, { LePont: new Bridge() })
