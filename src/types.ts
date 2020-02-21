export type Message = {
  type: string
  payload: any
}

export type BridgeRequestPayload = {
  id: string
  message: Message
}

export type BridgeResultPayload = {
  type: 'result',
  id: string
  message: Message
  error?: {
    message: string
  }
}

export type BridgeEventPayload = {
  type: 'event',
  message: Message,
}

export type BridgePayload = BridgeResultPayload | BridgeEventPayload
