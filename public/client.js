const avatars = [
    "https://cdn-icons-png.flaticon.com/512/8132/8132932.png",
    "https://cdn-icons-png.flaticon.com/512/706/706830.png",
    "https://cdn-icons-png.flaticon.com/512/921/921124.png",
    "https://cdn-icons-png.flaticon.com/512/921/921071.png",
    "https://cdn-icons-png.flaticon.com/512/1785/1785896.png",
    "https://cdn-icons-png.flaticon.com/512/706/706816.png",
    "https://cdn-icons-png.flaticon.com/512/145/145843.png",
    "https://cdn-icons-png.flaticon.com/512/924/924874.png",
    "https://cdn-icons-png.flaticon.com/512/560/560216.png",
    "https://cdn-icons-png.flaticon.com/512/145/145867.png",
    "https://cdn-icons-png.flaticon.com/512/3048/3048122.png",
    "https://cdn-icons-png.flaticon.com/512/4322/4322992.png",
    "https://cdn-icons-png.flaticon.com/512/2423/2423830.png",
    "https://cdn-icons-png.flaticon.com/512/1154/1154448.png",
    "https://cdn-icons-png.flaticon.com/512/219/219970.png",
    "https://cdn-icons-png.flaticon.com/512/1154/1154473.png",
    "https://cdn-icons-png.flaticon.com/512/1326/1326377.png",
    "https://cdn-icons-png.flaticon.com/512/949/949666.png",
    "https://cdn-icons-png.flaticon.com/512/921/921009.png",
    "https://cdn-icons-png.flaticon.com/512/1090/1090806.png",
    "https://cdn-icons-png.flaticon.com/512/1674/1674291.png",
    "https://cdn-icons-png.flaticon.com/512/921/921107.png",
    "https://cdn-icons-png.flaticon.com/512/3749/3749784.png",
    "https://cdn-icons-png.flaticon.com/512/706/706831.png",
    "https://cdn-icons-png.flaticon.com/512/2118/2118630.png",
    "https://cdn-icons-png.flaticon.com/512/1090/1090740.png",
    "https://cdn-icons-png.flaticon.com/512/706/706843.png",
    "https://cdn-icons-png.flaticon.com/512/4333/4333640.png",
    "https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
]; 



let name='',to;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
const socket = io()

let url = window.location.href;
let chatWith ="";
for(let i=0;i<url.length;i++){
    if(url.charAt(i)=='@'){
        const username = url.substring(i+1,url.length);
        chatWith=username;
        console.log('chatting with '+username);
    }
}

document.getElementById('friendName').innerHTML=



fetch(`http://localhost:3000/getFriendInfo/${chatWith}`)
  .then((response) => response.json())
  .then((data) => {
    document.getElementById('friendName').innerHTML=data.name;
    document.getElementById('friendAvatar').src=avatars[data.avatar];
});

let myUsername ='';
fetch('/mydetails')
  .then((response) => response.json())
  .then(async(data) => {
      myUsername= await data.username;
      name = await data.name;
      // console.log(data)
    //   document.getElementById('navbarDropdown').innerHTML = data.name;
    //   document.getElementById('myAvatar').src = avatars[data.avatar];
});

// do {
//     name = prompt('Please enter your name: ')
// } while(!name)
// do {
//     to = prompt('I wanna talk to ?')
// } while(!to)

url = `http://localhost:3000/join/${name}`;
fetch(url)

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        if(e.target.value.length!=1){
            sendMessage(e.target.value)
        }
    }
})

function sendMessage(message) {
    const receiver='john'
    let msg = {
        from: myUsername,
        to: chatWith,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.from}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

function home(){
    window.location.href='/home';
}


