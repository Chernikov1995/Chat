const host = '127.0.0.1'
const port = 8000
const userName = `user${Math.floor((Math.random() * 10))}`
const button = document.querySelector('#send')
const messages = document.querySelector('#messages')
const input = document.querySelector('#input')

const getRandomId = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

async function postMethod (message) {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/post', {
      method: 'POST',
      body: JSON.stringify({
        ...message,
        id: `${getRandomId(1, 10000000)}`
      })
    })
    if (response.ok) {
      const messages = await response.json()
      console.log(messages)
    }
  } catch (e) {
    console.log(e)
  }
}

async function getMethod() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/get')
    if (response.ok) {
      return response.json()
    }
  } catch (e) {
    console.log(e)
  }
}

setInterval(async () => {
  const res = await getMethod()
  const messageArray = res.msg
  console.log(messageArray)
  const showedMessages = [...messages.children || []].map(node => node.id)
  const notShowedMessages = messageArray.filter(msg => !showedMessages.includes(msg.id))
  for (const msg of notShowedMessages) {
    const messageHtml = `<p> ${msg.user} : ${msg.text} </p>`
    const msgNode = document.createElement('div')
    msgNode.innerHTML = messageHtml
    msgNode.id = msg.id
    messages.append(msgNode)
  }

}, 100)

const buttonHandler = async (event) => {
  event.preventDefault()
  if (input.value === ''){
    alert('Incorrect Input')
  } else {
    const msg = {
      user: userName,
      text: input.value
    }
    await postMethod(msg)
    input.value = ''
  }

}

button.addEventListener('click',buttonHandler)

