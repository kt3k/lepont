import { sendMessage, on } from 'lepont/browser'

function sendFoo() {
  addMessage('Hello!')
  sendMessage({
    type: 'foo',
    payload: { "Hello, world!": "through LePont bridge" }
  }).catch(e => alert(e))
}

function addMessage(msg) {
  const div = document.createElement('div')
  div.textContent = msg
  document.body.appendChild(div)
}

on('bar', (p) => {
  addMessage(JSON.stringify(p))
})

const qs = (q) => document.querySelector(q)

function initEvents() {
  qs('.inf-btn').addEventListener('click', sendFoo)
}

function main() {
  initEvents()
}

setTimeout(main, 500)
