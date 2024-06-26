const socket = io();
let FRIENDS = [];
var token = localStorage.getItem('token'); // Retrieve the token from local storage
var formSendMess = document.getElementById('formSendMess');
const conversationElement = conversation = document.getElementById('conversation');
conversation.innerHTML = "";


function navigateToFriendChat(element) {
    const friendId = element.getAttribute('data-friend-id');

    localStorage.setItem('friendId', friendId);
    console.log(friendId);
    loadMessages(friendId);

    if (friendId && token) {
        //
        // Emit the join event with the selected friend's ID and token
        socket.emit('join', { friendId, token });

    }
}
async function loadMessages(friendId) {
    try {
    friends = JSON.parse(localStorage.getItem("friends"));
    // console.log(friendsMessages);
    friendsMessages = JSON.parse(localStorage.getItem("friendsMessages"));
    console.log(friendsMessages);
    // if (!existingMessages){
    //     existingMessages = friendsMessages.find(message => friendId === message.friendID).messages; 
    // }
    // console.log(friends) ;

    
    const friendInfo = friends.find(friend => friendId === friend.FriendID);
    let existingMessages = mainMessage = {};
  
    try {
        mainMessage = (await getMessages(friendId, "", TOKEN)).data;
    } catch (error) {
        
    }
    

    console.log(friendsMessages) ;

    if (JSON.stringify(mainMessage) === '{}' && friendsMessages !== null) {
        mainMessage = friendsMessages.find(message => friendId === message.friendID).messages;
        
    }


    localStorage.setItem("mainMessage", JSON.stringify(mainMessage));
    existingMessages =  JSON.parse(localStorage.getItem("mainMessage"));
    

  

    // }else{
    //     existingMessages = (await getMessages(friendId, "", token)).data;
    // }
    conversation.innerHTML = '';

    displayConsoleHeader(friendInfo);

    if (!Array.isArray(existingMessages) || existingMessages.length === 0) {
        conversation.style.justifyContent = "center";
        conversation.style.alignItems = "center";

        conversation.innerHTML = `
                    <div class="no-mess-stack" id="noMessStack">
                        <div>
                            <img src="../resources/Accessories/24/message.png">
                        </div>
                        <div><span>Chưa có tin nhắn…</span></div>
                    </div>`;
    } else {
        conversation.style.justifyContent = "";
        conversation.style.alignItems = "";

        existingMessages.forEach((message) => {
            //
            addMessageToConversation(message, friendInfo);
        });
    }
    handleDisplayUnsentInfo();

    conversationElement.scrollTop = conversationElement.scrollHeight;
} catch (error) {
    console.error('Error fetching messages:', error.message);
}
}




document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        // socket.emit('loadFriends', { token });
        

        socket.on('receiveMessage', (params) => {

            var {message,friendInfo} = params;
        
            
            addMessageToConversation(message,friendInfo);
            conversationElement.scrollTop = conversationElement.scrollHeight;
            
        });

        document.getElementById('sendButton').addEventListener('click', () => {
            const friendId = localStorage.getItem('friendId');
            if (!friendId){
                return ;
            }
            sendMessageToFriend(friendId, token);
        });
    }
});
function handleDisplayUnsentInfo(){
    const unsentInfoToDisplayJSON = localStorage.getItem("unsentInfoToDisplay");
    if (unsentInfoToDisplayJSON){
    unsentInfoToDisplay = JSON.parse(unsentInfoToDisplayJSON);


    friendId = localStorage.getItem("friendId");
     

    unsentInfoToDisplay.forEach(element => {
        if(element.friendID == friendId){

            addMessageToConversation(element,null);
        }
    });
    }
    
}


async function sendMessageToFriend(friendId, token) {
    
    const message = document.getElementById('messageInput').value;
    const fileInput = document.getElementById('fileInput');
    var fileArray = Array.from(fileInput.files); // Convert FileList to Array
     // Retrieve the content from the input field
     var content = document.getElementById('messageInput').value;
     if (!content.trim() && !document.getElementById('fileInput').files.length) {
         // If content and files are empty, do not proceed
         return;
     }
    

     // Clear the input field after sending the message
     document.getElementById('messageInput').value = '';
     fileInput.value = '';
     
 

     // Simulate sending the message to the server
     var data = null;
     
     try {
        // var quote = await getQuote();
     const result = await sendMessage(friendId, message, fileArray, token);
     data = result.data;
     socket.emit('sendMessage', {data});
    
      } catch (error) {
        // console.error(error);
      }
      if (data == null){
        data = {
        "friendID": friendId,
        "isSend": 2,
        "files" :fileArray,
        "Content": message,
        "CreatedAt": moment.tz("Asia/Ho_Chi_Minh").toDate(),
        "MessageType": 1
       };
       if (1) {
        let unsentInfoToDisplay = [];
        const unsentInfoFromStorage = localStorage.getItem('unsentInfoToDisplay');
        if (unsentInfoFromStorage) {
            try {
                unsentInfoToDisplay = JSON.parse(unsentInfoFromStorage);
            } catch (e) {
                console.error('Error parsing unsentInfo from localStorage:', e);
            }
        }

        if(message){
            unsentInfoToDisplay.push(data);
        }

        try {
            localStorage.setItem('unsentInfoToDisplay', JSON.stringify(unsentInfoToDisplay));
        } catch (e) {
            console.error('Error saving unsentInfo to localStorage:', e);
        }
    }

    };
    //  
     const noMessStack = document.getElementById('noMessStack');
     if (noMessStack) {
         noMessStack.style.display = "none";
     }
     conversation.style.justifyContent = "";
     conversation.style.alignItems = "";
  
    // displayMessage(data);
   
    // console.log(data);

   
    addMessageToConversation(data,null);

     
   

    conversationElement.scrollTop = conversationElement.scrollHeight;
    var output = document.getElementById('imagePreview');
    output.innerHTML = '';
    messageInput.value = '';
    fileInput.value = '';


  
}

async function addMessageToConversation(message, friendInfo) {

    // console.error(message);



    

    const conversation = document.getElementById('conversation');


    const stackMessElement = document.createElement('div');
    stackMessElement.className = `stack-mess ${message.MessageType === 1 ? 'right-stack' : ''}`;

    // const formattedTime = new Date(message.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedTime = formatMessageTime(message.CreatedAt) ;
    formatTimeAgo(message.CreatedAt);
    let messageContent = "";

    let avatar = "../resources/Profile pic.svg"; // Default avatar
    if (friendInfo && friendInfo.Avatar){
        avatar = `${apiUrl}/images${friendInfo.Avatar}`;
        // console.log(avatar);
    }
    if (message.MessageType === 0) {
        messageContent += `
        <div class="avatar-container">
            <img src="${avatar}" alt="Profile Picture" class = "avatarDisplay">
        </div>`;
    }
    messageContent += `
        <div class="message-container">
            <div class="message-type ${message.MessageType === 1 ? 'right-mess' : ''}">
    `;

    let imgSrc = "" ;
    if (message.files){
        file = message.files[0];
    
        if (isImageFile(file)) {
            message.Images = file;
            const reader = new FileReader();
            try {
                imgSrc = await readFileAsDataURL(file);
              
            }
            catch (error) {
                console.error('Error reading file:', error);
            }
            
        } else {
            // message.Files = file;
        }
        // 
    }
    if (imgSrc){
        messageContent += `
        <a href = "gg.com">

        <div class="img-mess-type">
        <img src="${imgSrc }" alt="Image" class= "imgConversation avatarDisplay" >
        </div>
        </a>

        `;
    }
    
   

    if (message.Images && message.Images.length > 0) {
        
    
        message.Images.forEach(image => {
        

            messageContent += `
        
            <div class="img-mess-type" >
                <img src="${image.urlImage  ? apiUrl + image.urlImage : message.Images.src }" alt="Image" class= "imgConversation">
                
                <div class="download-menu ${message.MessageType === 0 ? 'download-menu-left' : ''}">
                    <a href="#" onclick="downloadFile('${apiUrl + image.urlImage}', '${image.FileName}')">
                        <i class="fas fa-download"></i> 
                    </a>
                </div>
            </div>
        

            `;
        });
    }
    if (message.Files && message.Files.length > 0) {
        message.Files.forEach(file => {
           
            messageContent += `
            <div class="img-mess-type ">
            
                <div class="image-caption">${file.FileName}</div>
                <div class="download-menu ${message.MessageType === 0 ? 'download-menu-left' : ''}">
                    <a href="${apiUrl + file.urlFile}" >
                        <i class="fas fa-download"></i>
                    </a>
                </div>
            </div>
            
            `;
        });
    }
    
    messStatusSrc = message.isSend === 0 ? '../resources/Accessories/mess_status/sent.png' : avatar;
    if(message.isSend == 2){
    messStatusSrc = '../resources/Accessories/mess_status/unsend.png';
    


    
    
   
    }
    avatarSeen = `<img class="mess-status avatarDisplay" src="${messStatusSrc}" alt="Avatar" >`;
    //
    if (message.Content != undefined && message.Content != "") {
        const formattedText = message.Content.trim().replace(/\r\n|\r|\n/g, '<br>');
        messageContent += `
        <div class="mess">
            <span>${formattedText}</span>
            
        </div>`;
    }
    messageContent += `
        </div>
        <div class="time ${message.MessageType === 1 ? 'right-time' : ''}">
        ${message.MessageType === 1 ? avatarSeen : ''}

        <span>${formattedTime}</span>
        </div>
        </div>
    `;

    // 

    stackMessElement.innerHTML = messageContent;
    conversation.appendChild(stackMessElement);

}
//  function displayConsoleHeader(friendInfo) {

//                 var headerInfoDiv = document.getElementById('header-info-right');
//                 // FRIEND_ID = friendInfo.FriendInfo;
//                 headerInfoDiv.innerHTML = "";
//                 isOnline = friendInfo.isOnline;
//                 if (headerInfoDiv) {
//                     avatar = friendInfo.Avatar ? apiUrl + "/images/" + friendInfo.Avatar : "../resources/Profile pic.svg";
//                     //);
//                     headerInfoDiv.innerHTML = `
//                     <div class = "avatar-container">
//                 <img src="${avatar}" class="${isOnline ? 'active' : ''}">
//                 ${isOnline ? '<span class="active-status"></span>' : '<span class="inactive-status"></span>'}
//                 </div>

//                 <div class="header-info">
//                 <span class="name">${friendInfo.FullName}</span><br><br>
//                 <span class="active-info">${isOnline ? "Đang hoạt động" : "Ko hoạt động"}</span>
//                 </div>
//             `;

//                 }



// }


async function displayConsoleHeader(friendInfo) {


    var headerInfoDiv = document.getElementById('header-info-right');
    FRIEND_INFO = friendInfo;
    // FRIEND_ID = FRIEND_INFO.FriendInfo;
    headerInfoDiv.innerHTML = "";
    isOnline = FRIEND_INFO.isOnline;
    if (headerInfoDiv) {
        FullName = FRIEND_INFO.FullName || "";
        friendId = localStorage.getItem("friendId");
        if (searchLocalFullName(friendId)) {
            FullName = searchLocalFullName(friendId);
        }
        // socket.emit('join', { friendId, token });

        avatar = (window.navigator.onLine && FRIEND_INFO.Avatar) ? apiUrl + "/images/" + FRIEND_INFO.Avatar : "../resources/Profile pic.svg";
        // 
        headerInfoDiv.innerHTML = `
                <div class = "avatar-container">
            <img src="${avatar}" class="${isOnline ? 'active' : ''} avatarDisplay">
            ${isOnline ? '<span class="active-status"></span>' : '<span class="inactive-status"></span>'}
            </div>

            <div class="header-info">
            <span class="name" id="localFullName">${FullName}</span><br><br>
            <span class="active-info">${isOnline ? "Đang hoạt động" : "Ko hoạt động"}</span>
            </div>
        `;

    }



}
