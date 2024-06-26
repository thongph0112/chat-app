const socket = io();

function navigateToFriendChat(element) {
    const friendId = element.getAttribute('data-friend-id');
    localStorage.setItem('friendId', friendId);
    window.location.reload(); // Reload the page to load the chat
}

document.addEventListener('DOMContentLoaded', () => {
    const friendId = localStorage.getItem('friendId');

    if (friendId) {
        socket.emit('join', friendId);

        socket.on('loadMessages', (messages) => {
            const conversation = document.getElementById('conversation');
            conversation.innerHTML = '';
            messages.forEach(message => {
                addMessageToConversation(message.text, 'right-mess', message.time);
            });
        });

        socket.on('receiveMessage', (message) => {
            addMessageToConversation(message.text, 'right-mess', message.time);
        });

        document.getElementById('sendButton').addEventListener('click', () => sendMessage(friendId));
    }
});

function sendMessage(friendId) {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message && friendId) {
        socket.emit('sendMessage', { friendId, message });
        messageInput.value = '';
    }
}

function addMessageToConversation(message, className, time) {
    const conversation = document.getElementById('conversation');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', className);
    messageContainer.innerHTML = `<div class="message-type">${message}</div><div class="time">${time}</div>`;
    conversation.appendChild(messageContainer);
    conversation.scrollTop = conversation.scrollHeight;
}