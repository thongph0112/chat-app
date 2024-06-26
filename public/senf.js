function navigateToFriendChat(element) {
    const friendId = element.getAttribute('data-friend-id');
    localStorage.setItem('friendId', friendId);
    window.location.reload(); // Reload the page to load the chat
}
document.addEventListener('DOMContentLoaded', () => {
    const friendId = localStorage.getItem('friendId');

    if (friendId) {
        loadConversation(friendId);
        document.getElementById('sendButton').addEventListener('click', () => sendMessage(friendId));
    }
});

function loadConversation(friendId) {
    // Fetch and display conversation with the friendId
    fetch(`/get-messages?friend_id=${friendId}`)
        .then(response => response.json())
        .then(messages => {
            const conversation = document.getElementById('conversation');
            conversation.innerHTML = '';
            messages.forEach(message => {
                addMessageToConversation(message.text, message.sender === friendId ? 'left-mess' : 'right-mess');
            });
        });
}

function sendMessage(friendId) {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message && friendId) {
        fetch('/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friend_id: friendId, message })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    addMessageToConversation(message, 'right-mess');
                    messageInput.value = '';
                } else {
                    console.error('Error sending message');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function addMessageToConversation(message, className) {
    const conversation = document.getElementById('conversation');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', className);
    messageContainer.innerHTML = `<div class="message-type">${message}</div><div class="time">${new Date().toLocaleTimeString()}</div>`;
    conversation.appendChild(messageContainer);
    conversation.scrollTop = conversation.scrollHeight;
}