import { sendMessage, on } from 'lepont/browser'

function onReceive(msg) {
  addMessage(`received "${msg}"`)
}

function sendHello() {
  addHr()
  addMessage('sending "hello"')
  sendMessage({
    type: 'hello',
    payload: {},
  }).then(onReceive).catch((e) => alert(e))
}

function sendVibration() {
  addHr()
  addMessage('sending "vibration"')
  sendMessage({
    type: 'vibration',
    payload: {},
  }).catch((e) => alert(e))
}

function sendStreaming() {
  const n = +qs('.streaming-count').value
  if (!n) {
    alert('invalid number of streaming-count ' + n)
  }
  addHr()
  addMessage('sending "streaming"')
  sendMessage({
    type: 'streaming',
    payload: { n },
  }).catch((e) => alert(e))
}

function addHr() {
  document.body.appendChild(document.createElement('hr'))
}

function addMessage(msg) {
  const div = document.createElement('div')
  div.textContent = msg
  document.body.appendChild(div)
}

on('streaming-response', (p) => {
  onReceive(JSON.stringify(p))
})

const qs = (q) => document.querySelector(q)

function main() {
  qs('.hello-btn').addEventListener('click', sendHello)
  qs('.vibration-btn').addEventListener('click', sendVibration)
  qs('.streaming-btn').addEventListener('click', sendStreaming)
}

setTimeout(main, 500)
