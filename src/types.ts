export type Message = {
  type: string
  payload: unknown
}

export type MessageFromWebView = {
  id: string
  message: Message
}

export type MessageWithId = {
  id: string
  message: Message
}
