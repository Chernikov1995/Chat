const host = '127.0.0.1'
const port = 8000
const userName = `user${~~(Math.random() * 10)}`
const button = document.querySelector(".sendmessage")
const messages = document.querySelector(".outputmessages")
const input = document.querySelector(".inputmessage")

const set = new Set()

async function postMethod (message){

    try{
        const response = await fetch('http://127.0.0.1:8000/api/post',{
            method : 'POST',
            body: JSON.stringify({
                ...message
             })
            })
        if (response.ok) {
            const messages = await response.json()
            console.log(messages)
            }
       } catch(e){
            console.log(e)
            }
}

async function getMethod() {
    try{
        const response = await fetch('http://127.0.0.1:8000/api/get')
        if (response.ok){
            return response.json()
        }
    }catch(e){
        console.log(e)
    }
}

setInterval(async ()=>{
    const res = await getMethod()
    const messageArray = res.msg
    for (const msg of messageArray) {
        if (!set.has(msg.date)) {
            const messageHtml = `<p> ${msg.user} : ${msg.text} </p>`
            const msgNode = document.createElement('div')
            msgNode.innerHTML = messageHtml
            messages.append(msgNode)
            set.add(msg.date)
        }
    }

},100)


const buttonHandler = async (event) =>{
    event.preventDefault()
    if (input.value === ''){
     alert('Incorrect input')
    } else{
        const msg = {
            user : userName,
            text : input.value,
            date : Date.now()
        }
        await postMethod(msg)
        input.value = ""
    }

}

document.addEventListener('keydown',  (event)  => {
    if (event.key === 'Enter') {
        buttonHandler(event)
    }
})


button.addEventListener('click', buttonHandler)

