import * as React from 'react'
import * as assert from 'assert'
import { renderHook } from '@testing-library/react-hooks'
import { Registry, useBridge, Bridge } from './'

const genMessageEvent = (obj: unknown) => {
  return {
    nativeEvent: {
      data: JSON.stringify(obj)
    }
  }
}

describe('useBridge', () => {
  it('returns ref and onMessage method of registry object', () => {
    let registry: Registry

    const {
      result: {
        current: [ref, onMessage]
      }
    } = renderHook(() =>
      useBridge(registry_ => {
        registry = registry_
      })
    )

    assert(registry!.ref === ref)
    assert(registry!.onMessage === onMessage)
  })

  describe('registry.onMessage', () => {
    it('invokes corresponding handler and sends back result to the browser', async () => {
      const {
        result: {
          current: [ref, onMessage]
        }
      } = renderHook(() =>
        useBridge(registry => {
          registry.register<{ abc: number }>('foo', async payload => {
            return { def: payload.abc * 2 }
          })
        })
      )

      let script = ''
      const mockWebView = {
        injectJavaScript(src: string): void {
          script = src
        }
      }

      ref(mockWebView)
      await onMessage(
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
        result: {
          current: [ref, onMessage]
        }
      } = renderHook(() => useBridge())

      let script = ''
      const mockWebView = {
        injectJavaScript(src: string): void {
          script = src
        }
      }

      ref(mockWebView)
      await onMessage(
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
        result: {
          current: [ref, onMessage]
        }
      } = renderHook(() => useBridge())

      let script = ''
      const mockWebView = {
        injectJavaScript(src: string): void {
          script = src
        }
      }

      ref(mockWebView)
      await onMessage(
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
        result: {
          current: [ref, onMessage]
        }
      } = renderHook(() =>
        useBridge(registry => {
          registry.register('foo', () => {
            throw new Error('error!')
          })
        })
      )

      let script = ''
      const mockWebView = {
        injectJavaScript(src: string): void {
          script = src
        }
      }

      ref(mockWebView)
      await onMessage(
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
        result: {
          current: [ref, onMessage]
        }
      } = renderHook(() =>
        useBridge(registry => {
          registry.register('foo', () => {})
        })
      )

      await onMessage(
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
        result: {
          current: [ref, onMessage]
        }
      } = renderHook(() =>
        useBridge(registry =>
          registry.register('my-bridge', (_payload, bridge) => {
            bridge.sendMessage({
              type: 'stream-data',
              payload: 'data'
            })
          })
        )
      )

      let script = ''
      const mockWebView = {
        injectJavaScript(src: string): void {
          script = src
        }
      }
      ref(mockWebView)

      onMessage(
        genMessageEvent({
          id: 0,
          message: { type: 'my-bridge' }
        })
      )

      assert.strictEqual(
        script,
        'LePont.recv({"type":"event","message":{"type":"stream-data","payload":"data"}})'
      )
    })
  })
})
