import * as React from 'react'
import * as assert from 'assert'
import { renderHook } from '@testing-library/react-hooks'
import { useRegistry, Registry, useBridge } from './'

const genMessageEvent = (obj: unknown) => {
  return {
    nativeEvent: {
      data: JSON.stringify(obj)
    }
  }
}

describe('useRegistry', () => {
  it('returns a registry of native bridge handlers', () => {
    const {
      result: { current }
    } = renderHook(() => useRegistry())

    assert(current instanceof Registry)
  })

  describe('registry.onMessage', () => {
    it('invokes corresponding handler and sends back result to the browser', async () => {
      const {
        result: { current }
      } = renderHook(() => {
        const registry = useRegistry()
        useBridge<{ abc: number }>(registry, 'foo', async payload => {
          return { def: payload.abc * 2 }
        })
        return registry
      })

      let script = ''
      const mockWebView = {
        injectJavaScript(src: string): void {
          script = src
        }
      }

      current.ref(mockWebView)
      await current.onMessage(
        genMessageEvent({
          id: 0,
          message: {
            type: 'foo',
            payload: { abc: 123 }
          }
        })
      )

      assert.strictEqual(
        script,
        'LePont.recv({"type":"result","id":0,"message":{"type":"foo","payload":{"def":246}}})'
      )
    })

    it('sends back error to the browser if message type is empty', async () => {
      const {
        result: { current }
      } = renderHook(() => useRegistry())

      let script = ''
      const mockWebView = {
        injectJavaScript(src: string): void {
          script = src
        }
      }

      current.ref(mockWebView)
      await current.onMessage(
        genMessageEvent({
          id: 0,
          message: { type: '' }
        })
      )

      assert.strictEqual(
        script,
        'LePont.recv({"type":"result","id":0,"message":{"type":""},"error":{"message":"Message type cannot be empty:  is given"}})'
      )
    })

    it('sends back error to the browser if message type is not registered', async () => {
      const {
        result: { current }
      } = renderHook(() => useRegistry())

      let script = ''
      const mockWebView = {
        injectJavaScript(src: string): void {
          script = src
        }
      }

      current.ref(mockWebView)
      await current.onMessage(
        genMessageEvent({
          id: 0,
          message: { type: 'foo' }
        })
      )

      assert.strictEqual(
        script,
        'LePont.recv({"type":"result","id":0,"message":{"type":"foo"},"error":{"message":"No entry for message type: foo"}})'
      )
    })

    it('sends back error to the browser if the handler throws', async () => {
      const {
        result: { current }
      } = renderHook(() => {
        const registry = useRegistry()
        useBridge(registry, 'foo', () => {
          throw new Error('error!')
        })
        return registry
      })

      let script = ''
      const mockWebView = {
        injectJavaScript(src: string): void {
          script = src
        }
      }

      current.ref(mockWebView)
      await current.onMessage(
        genMessageEvent({
          id: 0,
          message: { type: 'foo' }
        })
      )

      assert.strictEqual(
        script,
        'LePont.recv({"type":"result","id":0,"message":{"type":"foo"},"error":{"message":"error!"}})'
      )
    })

    it('write to error console when webView is not ready', async () => {
      let message = ''
      console.error = (msg: string) => {
        message = msg
      }
      const {
        result: { current }
      } = renderHook(() => {
        const registry = useRegistry()
        useBridge(registry, 'foo', () => {})
        return registry
      })

      await current.onMessage(
        genMessageEvent({
          id: 0,
          message: { type: 'foo' }
        })
      )

      assert.strictEqual(message, 'webView for lepont registry is not ready!')
    })
  })

  describe('bridge.sendMessage', () => {
    it('sends event message to the browser', () => {
      const {
        result: { current }
      } = renderHook(() => useRegistry())

      let script = ''
      const mockWebView = {
        injectJavaScript(src: string): void {
          script = src
        }
      }
      current.ref(mockWebView)

      current.sendMessage({
        type: 'stream-data',
        payload: 'data'
      })

      assert.strictEqual(
        script,
        'LePont.recv({"type":"event","message":{"type":"stream-data","payload":"data"}})'
      )
    })
  })
})
