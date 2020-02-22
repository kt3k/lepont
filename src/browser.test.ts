import { sendMessage, on, off } from './browser'
import * as assert from 'assert'

const g = window as any

let cnt = 0

describe('sendMessage', () => {
  it('sends message to ReactNativeWebView and receives response through LePont.recv message', async () => {
    const id = cnt++
    let msg: string = ''
    g.ReactNativeWebView = {
      postMessage(m: string): void {
        msg = m
      }
    }

    const sending = sendMessage({ type: 'foo', payload: { abc: 123 } })

    g.LePont.recv({
      id,
      type: 'result',
      message: { type: 'foo', payload: { def: 456 } }
    })

    const res = await sending

    // @ts-ignore
    assert.deepStrictEqual(
      msg,
      JSON.stringify({ id, message: { type: 'foo', payload: { abc: 123 } } })
    )
    assert.deepStrictEqual(res, { def: 456 })
  })

  it('sends message to ReactNativeWebView and receives error when LePont.recv message is error', async () => {
    const id = cnt++
    let msg: string = ''
    g.ReactNativeWebView = {
      postMessage(m: string): void {
        msg = m
      }
    }

    const sending = sendMessage({ type: 'foo', payload: { abc: 123 } })

    g.LePont.recv({
      id,
      type: 'result',
      message: { type: 'foo', payload: null },
      error: { message: 'error' }
    })

    await assert.rejects(sending)
  })
})

describe('on', () => {
  it('subscribes to the given event from the react-native side', () => {
    let payload = null
    on('stream-event', (p) => {
      payload = p
    })

    g.LePont.recv({
      type: 'event',
      message: { type: 'stream-event', payload: { abc: 123 } }
    })

    assert.deepStrictEqual(payload, { abc: 123 })
  })

  describe('off', () => {
    it('unsubscribe from the event', () => {
      let payload = null
      const handler = (p: unknown) => { payload = p }
      on('stream-event', handler)
      off('stream-event', handler)

      g.LePont.recv({
        type: 'event',
        message: { type: 'stream-event', payload: { abc: 123 } }
      })

      assert.deepStrictEqual(payload, null)
    })
  })
})

describe('LePont.recv', () => {
  it('writes to error console when received the same id more than once', async () => {
    const id = cnt++
    let msg: string = ''
    g.ReactNativeWebView = {
      postMessage(m: string): void {
        msg = m
      }
    }

    let errMsg = ''
    console.error = (m: string) => {
      errMsg = m
    }

    const sending = sendMessage({ type: 'foo', payload: { abc: 123 } })

    g.LePont.recv({
      id,
      type: 'result',
      message: { type: 'foo', payload: null }
    })
    assert.strictEqual(errMsg, '')

    g.LePont.recv({
      id,
      type: 'result',
      message: { type: 'foo', payload: null }
    })
    assert.strictEqual(errMsg, `Resolver for id=${id} not found.`)
  })

  it('throws when received unknown message type', async () => {
    assert.throws(() => {
      g.LePont.recv({ type: 'foo' })
    })
  })
})
