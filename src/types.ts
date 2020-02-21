export type Message = {
  type: string
  payload: unknown
}

export type MessageFromWebview = {
  id: string
  message: Message
}
