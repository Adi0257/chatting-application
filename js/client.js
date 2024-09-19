const socket  = io('http://localhost:8000');

// get DOM elements in respective js varibles
const form = document.getElementById('send-container');
const messageinput = document.getElementById('messageinp');
const messageContainer = document.querySelector(".container");

//audio that will play on sending or receiving messages 
var audio = new Audio('ting.mp3')


//function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

//ask new user for hi/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined',name);

// if a new user joins, receive his/her name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
})

//if server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message} `, 'left');
})

//if a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`,'right');
})

// if the form gets submitted, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageinput.value;
    append(`you: ${message}`,'right')
    socket.emit('send', message);
    messageinput.value = ''
}) 