export type Message = {
  type: string
  payload: unknown
}

export type BridgePayload = {
  id: string
  message: Message
  error?: {
    message: string
  }
}
