export type Message = {
  type: string
  payload: unknown
}

export type MessageWithId = {
  id: string
  message: Message
}
