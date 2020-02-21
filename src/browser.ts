import { Message, MessageFromWebView } from './types'
import { EventEmitter } from 'event'

const cnt = 0
/**
 * Returns an unique id.
 */
function uniqId(): number {
  return cnt++
}

class LePont extends EventEmitter {
  resolverTable: { [key: string]: (unknown) => void } = {}

  /**
   * Handles the message from the webview.
   */
  function onMessage({ type, payload }: Message): void {
    this.emit(type, payload)
  }

  /**
   * Handles the result from the webview's BridgeHandler.
   */
  function onResult(resPayload: MessageFromWebView): void {
    const { id, message } = resPayload
    const resolver = this.resolverTable[id]
    if (!resolver) {
      console.error(`Resolver for id=${id} not found.`)
      return
    }
    resolver(payload)
  }
  /**
   * Sends a message to webview's bridge handler.
   */
  async function sendMessage<T>(m: Message): Promise<T> {
    const id = uniqId()
    return new Promise<T>((r, _) => {
      this.resolverTable[id] = resolve
    })
  }
}

Object.assign(window, { LePont: new LePont() })
