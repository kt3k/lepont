export type Message<T> = {
  type: string
  payload: T
}

export type BridgeRequestPayload<T> = {
  id: string
  message: Message<T>
}

export type BridgeResultPayload<T> = {
  type: 'result'
  id: string
  message: Message<T>
  error?: {
    message: string
  }
}

export type BridgeEventPayload<T> = {
  type: 'event'
  message: Message<T>
}

export type BridgePayload<T, S> = BridgeResultPayload<T> | BridgeEventPayload<S>
