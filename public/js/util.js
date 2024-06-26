


document.addEventListener('DOMContentLoaded', function () {
    // nivasdj();

    const searchInput = document.getElementById('searchInput');
    const friendListContainer = document.getElementById('friendList');
    const messageListContainer = document.getElementById('messageList');
    var errorMessage = document.getElementById('errorMessage');
    var formSendMess = document.getElementById('formSendMess');
    var noMessStack = document.getElementById('noMessStack');
    var rightContainer = document.getElementById('rightContainer');



    let FRIEND_ID = "";
    TOKEN = localStorage.getItem('token');
    if (localStorage.getItem('friendId')) {
        FRIEND_ID = localStorage.getItem('friendId');
    }

    let FRIEND_INFO = [];
    let USER_INFO = [];






    let FRIENDS = [];
    // async function getFriends() {
    //     const response = (await getFriendsList(TOKEN));
    //     // 
    //     result = response.data;
    //     localStorage.setItem("friends", JSON.stringify(result));



    //     return result;
    // }
    // async function main() {
    //     const response = (await getFriendsList(TOKEN)).data;
    //     result = response.data;
    //     return result;
    // }
    // getFriends();


     function displayUserInfo(USER_INFO) {
        console.log("OKádsdasdKK");
        var userInfoDiv = document.getElementById('user-info');
        userInfoDiv.innerHTML = "";

        // var headerInfo = document.getElementById('headerInfo');
        if (userInfoDiv) {
            // 
            avatar = (window.navigator.onLine && USER_INFO.Avatar) ? apiUrl + "/images/" + USER_INFO.Avatar : "../resources/Profile pic.svg";
            userInfoDiv.innerHTML = `
                <img src="${avatar}" alt="12312"  id="userAvatar">
                
                <span id="userFullName">${USER_INFO.FullName!=""? USER_INFO.FullName:"Chưa đặt tên"}</span>
               
            `;
            console.log(12312);
        }



    }
    async function displayLocalFullName(newFullName) {
        var localFullName = document.getElementById('localFullName');
        localFullName.innerHTML = "";

        if (localFullName) {
            localFullName.innerHTML = newFullName;
        }

        id = localStorage.getItem("friendId");
        $(`#${id} .name`).html(newFullName);




    }

    async function getSetDefault() {
        try {
            await handleUnsentInfo();
            const now = moment.tz("Asia/Ho_Chi_Minh").toDate();
            // Subtract 50,339 seconds from the current time
            const adjustedNow = moment(now).subtract(50339, 'seconds').toDate();
            // localStorage.setItem("lastTime", adjustedNow);
            console.log(token);

            friends = (await getFriendsList(token)).data;

            // console.log(friends);


            localStorage.setItem("friends", JSON.stringify(friends));
            // console.log(friends);
            USER_INFO = (await getUserInfo(TOKEN)).data;
            localStorage.setItem("userInfo", JSON.stringify(USER_INFO));
            await setLocalIsChat(friends);
            friendId = localStorage.getItem("friendId");
            mainMessage = (await getMessages(friendId, "", TOKEN)).data;
            localStorage.setItem("mainMessage", JSON.stringify(mainMessage));

        } catch (error) {

        }




    }


    async function handleUnsentInfo() {
        
    
        const unsentInfoJSON = localStorage.getItem("unsentInfo");
    
        // If there is data in localStorage
        if (unsentInfoJSON) {
            const unsentInfos = JSON.parse(unsentInfoJSON);
            
    
            try {
                // Collect all promises from the async operations
                console.log("1231232131232");
                const promises = unsentInfos.map(async (unsentInfo) => {
                    const formData = new FormData();
                    formData.append('FriendID', unsentInfo.body.FriendID);
                    formData.append('Content', unsentInfo.body.Content);
                    await sendMessage(unsentInfo.body.FriendID, unsentInfo.body.Content, null, unsentInfo.token);
                });
                console.log("1231232131232");
    
                // Wait for all promises to resolve
                await Promise.all(promises);
                
    
                // After all promises are resolved, remove items from localStorage
                localStorage.removeItem("unsentInfo");
                localStorage.removeItem("unsentInfoToDisplay");
            } catch (error) {
                console.error('Error sending messages:', error);
            }
        }
    }
    
    async function displayDefault() {


        await getSetDefault();
        friends = JSON.parse(localStorage.getItem("friends"));
        friendsMessages = JSON.parse(localStorage.getItem("friendsMessages"));
        isChat = JSON.parse(localStorage.getItem("isChat"));
        userInfo = JSON.parse(localStorage.getItem("userInfo"));
        friendId = localStorage.getItem("friendId");
        loadMessages(friendId);


        socket.emit('join', { friendId, token });
        displayMesseges(isChat);
        displayUserInfo(userInfo);



    }

    displayDefault();

    async function setLocalIsChat(friends) {
        console.log(friends) ;
        let isChat = [];
        const friendPromises = friends.map(async (friend) => {
            if (friend.Content !== '' && friend.Files !== null && friend.Images !== null) {
                messages = (await getMessages(friend.FriendID, "", TOKEN)).data;
                messLen = messages.length;

                if (messLen > 0) {

                    formattedTime = formatTimeAgo(messages[messLen - 1].CreatedAt);
                    friend.lastMessTime = formattedTime;
                    friend.lastMessType = messages[messLen - 1].MessageType;
                    friend.CreatedAt = messages[messLen - 1].CreatedAt;
                    // displayConsole(FRIEND_ID);
                    isChat.push(friend);


                }
                
            }
            
        });
        await Promise.all(friendPromises);
        isChat = sortByCreatedAt(isChat);

        // 

        friendId = localStorage.getItem('friendId');
        if (friendId == null) {
            localStorage.setItem('friendId', isChat[0].FriendID);
            // socket.emit('join', { friendId, token });
        }


        // displayMesseges(isChat);
        setLocalMessages(isChat);
        localStorage.setItem("isChat", JSON.stringify(isChat));


    }
    async function displayContentMessege(friends) {
        // displayMesseges(isChat);


    }


    function displayFriends(friends) {


        friendListContainer.innerHTML = '';
        // 
        friends.forEach(friend => {
            FullName  = friend.FullName || "";
                friendId = friend.FriendID;
    
                if (searchLocalFullName(friendId)) {
                    FullName = searchLocalFullName(friendId);
                }
                if (FullName.length > 20) {
                    FullName = FullName.substr(0, 30) + "...";
                }
            const friendElement = document.createElement('div');
            friendElement.className = 'mess-info';
            friendElement.id = friend.FriendID;
            friendElement.setAttribute("data-friend-id", friend.FriendID);

            friendElement.innerHTML = `
                <div class="avatar-container">
                        <img class = "avatarDisplay" src="${(window.navigator.onLine && friend.Avatar) ? `${apiUrl}/images/${friend.Avatar}` : `../resources/Profile pic.svg`}" alt="Profile Picture" class="${friend.isOnline ? 'active' : ''}">
                        ${friend.isOnline ? '<span class="active-status"></span>' : '<span class="inactive-status"></span>'}
                    </div>
                <span>
            <div class="mess-info-child">
                <p class="name header">${FullName}</p>
            </div>


        `;
            friendElement.addEventListener('click', function () {

                navigateToFriendChat(this);
            });

            friendListContainer.appendChild(friendElement);
            friendListContainer.style.display = "block";
            messageListContainer.style.display = "none";

        });
    }

    async function setLocalMessages(friends) {



        // Initialize an object to store all messages and lastTime
        const allMessages = [];

        // Use for...of loop to handle async operations properly
        for (const friend of friends) {
            try {
                const friendID = friend.FriendID;

                const response = await getMessages(friendID, "", TOKEN);
                const result = response.data;

                // Store result in the allMessages object
                allMessages.push({
                    friendID: friendID,
                    messages: result,
                });

            } catch (error) {
                console.error(`Error fetching messages for friend ${friend.FriendID}:`, error);
            }
        }


        // Save all messages to local storage
        localStorage.setItem("friendsMessages", JSON.stringify(allMessages));






    }

    function displayMesseges(friends) {

        if (friends === null) {
            // console.log("No friends to display messages for.");
            return;
        }


        messageListContainer.innerHTML = '';

        friends.forEach(friend => {
            const friendElement = document.createElement('div');
            friendElement.className = 'mess-info';
            friendElement.id = friend.FriendID;
            friendElement.setAttribute("data-friend-id", friend.FriendID);

            content = friend.Content || "";
              FullName  = friend.FullName || "";
            friendId = friend.FriendID;

            if (searchLocalFullName(friendId)) {
                FullName = searchLocalFullName(friendId);
            }
            if (FullName.length > 20) {
                FullName = FullName.substr(0, 30) + "...";

            }
            if (friend.Files.length == 0 && friend.Images.length == 0 && content == "") {
                return;
            }
            if (friend.Files.length > 0 || friend.Images.length > 0) {
                content = friend.lastMessType == 1 ? "Bạn" : friend.FullName;
                if (friend.Files.length > 0) {

                    content += " đã gửi 1 file";
                }
                if (friend.Images.length > 0) {
                    content += " đã gửi 1 ảnh";
                }
            }
            if (content.length > 20) {
                content = content.substr(0, 30) + "...";
                console.log(content.length);

            }
          
            // namfosag = searchLocalFullName("665d35a057d3155ce7061a34");
            // 
            // 

            friendElement.innerHTML = `
                    <div class="avatar-container">
                            <img class= "avatarDisplay"src="${(window.navigator.onLine && friend.Avatar) ? `${apiUrl}/images/${friend.Avatar}` : `../resources/Profile pic.svg`}" alt="Profile Picture" class="${friend.isOnline ? 'active' : ''}">
                            ${friend.isOnline ? '<span class="active-status"></span>' : '<span class="inactive-status"></span>'}
                        </div>
                    
                    <div class="mess-info-child">
                        <div class="name header">${FullName}</div>
                        <div class="brief">
                        <div>
                        ${content}
                        </div>
                        <div>
                        ${friend.lastMessTime}
                        </div>
                       

                        </div>


                    </div>
                `;
            friendElement.addEventListener('click', function () {

                // displayConsole(this.id);
                navigateToFriendChat(this);


            });

            messageListContainer.appendChild(friendElement);
            messageListContainer.style.display = "block";
            friendListContainer.style.display = "none";

        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value.toLowerCase();

            const filteredFriends = friends.filter(friend => {
                FullName  = friend.FullName || "";
                friendId = friend.FriendID;
    
                if (searchLocalFullName(friendId)) {
                    FullName = searchLocalFullName(friendId);
                }
                if (FullName.length > 20) {
                    FullName = FullName.substr(0, 30) + "...";
                }
                // Normalize FullName and searchTerm to handle Unicode properly
                const fullName = FullName ? FullName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
                const normalizedSearchTerm = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                return fullName.includes(normalizedSearchTerm);
            });

            displayFriends(filteredFriends);
            // friendList.classList.toggle('active');
        });
        searchInput.addEventListener('focus', function () {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredFriends = friends.filter(friend => {
                FullName  = friend.FullName || "";
                friendId = friend.FriendID;
    
                if (searchLocalFullName(friendId)) {
                    FullName = searchLocalFullName(friendId);
                }
                if (FullName.length > 20) {
                    FullName = FullName.substr(0, 30) + "...";
                }
                // Normalize FullName and searchTerm to handle Unicode properly
                const fullName = FullName ? FullName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
                const normalizedSearchTerm = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                return fullName.includes(normalizedSearchTerm);
            });

            displayFriends(filteredFriends);
        });

        // searchInput.addEventListener('focusout', function () {
        //     friendListContainer.style.display = "none";
        // });



        // Call the async function


    }
    if (friendListContainer) {
        friendListContainer.addEventListener('click', async function (event) {

            messageListContainer.style.display = "block";
            friendListContainer.style.display = "none";

        })
    }
    document.addEventListener('click', function (event) {

        let targetDiv = document.getElementById('searchInput');
        if (!targetDiv.contains(event.target)) {
            friendListContainer.style.display = 'none';
            messageListContainer.style.display = "block";

        }
        root = document.getElementById('option');
        targetDiv = document.getElementById('menu');
        root.addEventListener('click', function (event) {
            targetDiv.style.display = 'block';

        });


        if (!root.contains(event.target)) {
            targetDiv.style.display = 'none';

        }
    });



    async function signUp(FullName = "vanhleg", Username, Password) {
        try {


            responseData = registerUser(FullName, Username, Password);


            registerUser(FullName, Username, Password)
                .then(responseData => {
                    console.log(responseData) ;
                    if (responseData.status == 1) {
                        location.href = "sign.html";
                    } else {
                        errorMessage.innerHTML = responseData.message;
                    }
                })
                .catch(error => console.error('Error logging in user:', error));


            return responseData; // You can return the response data if needed
        } catch (error) {
            console.error('Error:', error);
            throw error; // You can rethrow the error or handle it as needed
        }
    };
    async function login(Username, Password) {
        try {


            response = await loginUser(Username, Password)
                .catch(error => console.error('Error logging in user:', error));
            ;
            if (response.status == 1) {
                location.href = "messenger.html";
                let token = response.data.token;
                console.log(token) ;
                localStorage.setItem("token", token);
            } else {
                errorMessage.innerHTML = response.message;
            }

            // return responseData; // You can return the response data if needed
        } catch (error) {
            console.error('Error:', error);
            // errorMessage.innerHTML = "Vui lòng kiểm tra lại đường truyền";

            throw error; // You can rethrow the error or handle it as needed
        }
    };

    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent the default form submission behavior
            var username = document.getElementById("username");
            var pass = document.getElementById("password");
            var repass = document.getElementById("repassword");
            var errorMessage = document.getElementById("errorMessage"); // Ensure you have an element with this ID to display errors
        
            // Clear previous error message
            errorMessage.innerHTML = "";
        
            // Check if all fields are filled
            if (!username.value.trim() || !pass.value.trim() || !repass.value.trim()) {
                errorMessage.innerHTML = "Vui lòng nhập đầy đủ thông tin";
                return;
            }
        
            // Regex validation for username (example: only letters and numbers, 3-15 characters)
            var usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
            if (!usernameRegex.test(username.value.trim())) {
                errorMessage.innerHTML = "Tên người dùng không hợp lệ. Chỉ cho phép chữ cái và số, từ 3 đến 15 ký tự.";
                return;
            }
        
            // Regex validation for password (at least one uppercase, one lowercase, one digit, and 8 characters long)
            var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(pass.value.trim())) {
                errorMessage.innerHTML = "Mật khẩu không hợp lệ. Mật khẩu phải chứa ít nhất một chữ cái in hoa, một chữ cái thường, một chữ số và ít nhất 8 ký tự.";
                return;
            }
        
            // Check if passwords match
            if (pass.value.trim() !== repass.value.trim()) {
                errorMessage.innerHTML = "Mật khẩu không khớp";
                return;
            }
        
            // If all validations pass, call the signUp function and redirect
            await signUp("", username.value, pass.value);
            
        });
        
        
    }

    if (document.getElementById('loginForm')) {
        // 
        document.getElementById('loginForm').addEventListener('submit', async function (event) {

            event.preventDefault(); // Prevent the default form submission behavior
            var username = document.getElementById("username");
            var pass = document.getElementById("password");
            var message = document.getElementById('errorMessage');
            if (!username.value.trim() || !pass.value.trim()) {

                errorMessage.innerHTML = "Vui lòng nhập đầy đủ thông tin ";
                return;
            }
            login(username.value, pass.value);

        });
    }
    // Get the element with the id "option"
    var optionElement = document.getElementById('option');

    if (optionElement) {
        optionElement.addEventListener('click', function () {
            // Your action here when the option is clicked

            // For example, you can toggle a class
            // localStorage.removeItem("token");

            // location.href = "sign.html";

            const menu = document.getElementById('menu');
            menu.classList.toggle('active');



        });
    }

    var logout = document.getElementById('logout');

    if (logout) {
        logout.addEventListener('click', function () {
            // exclude = ["localFullName"] ;
            var localFullName = localStorage.getItem('localFullName');
            localStorage.clear();
            localStorage.setItem('localFullName',localFullName);
            // localStorage.clear();
            // clearLocalStorage(exclude) ;

            location.href = "sign.html";


        });
    }

    // Check if the element with ID 'userFullName' exists

    async function handleUserFullNameClick(element) {
      
                try {
                    // Prompt the user for new information using SweetAlert
                    const newFullName = await swal({
                        text: 'Thay đổi tên của bạn',
                        content: 'input',
                        button: {
                            text: 'Submit',
                            closeModal: true,
                        },
                    });
    
                    // If user cancels prompt or doesn't provide input, exit function
                    if (!newFullName) {
                        return;
                    }
    
                    // Retrieve token from localStorage
                    const token = localStorage.getItem('token');
    
                    // Update user information asynchronously
                    const result = await updateUser(newFullName, "", token);
    
                    // Fetch updated user information
                    const userInfo = (await getUserInfo(token)).data;
    
                    // Show success message using SweetAlert
                    swal('Thành công', 'Thông tin người dùng được cập nhật thành công!', 'success');
    
                    // Update UI with updated user information
                    displayUserInfo(userInfo);
                } catch (error) {
                    console.error('Error updating user:', error);
    
                    // Show error message using SweetAlert
                    swal('Error', 'Failed to update user information.', 'error');
                }
    }
        
    async function handleUserAvatarClick(element) {

            // Trigger file input click for avatar upload
            const avatarInput = document.getElementById('avatarInput');
            avatarInput.click();
    
            // Handle the file input change event
            avatarInput.addEventListener('change', async () => {
                const newAvatarFile = avatarInput.files[0];
    
                // Get the token from local storage
                const token = localStorage.getItem('token');
    
                try {
                    const result = await updateUser("", newAvatarFile, token);
    
                    userInfo = (await getUserInfo(token)).data;
    
    
                    // userInfo = JSON.parse(localStorage.getItem("userInfo"));
                    // Show success message using SweetAlert
                    swal('Thành công', 'Thông tin người dùng được cập nhật thành công!', 'success');
                    // 
                    // Call function to display updated user information
    
                    displayUserInfo(userInfo);
                } catch (error) {
                    console.error('Error updating user:', error);
    
                    // Show error message using SweetAlert
                    swal('Error', 'Failed to update user information.', 'error');
                }
            }, { once: true });
        
     }


    document.addEventListener('click', function(event) {
        // Check if the clicked element matches the selector
        if (event.target && event.target.matches('#userFullName')) {
            handleUserFullNameClick(event.target);
        }
        if (event.target && event.target.matches('#userAvatar')) {
            handleUserAvatarClick(event.target);
        }
        if (event.target && event.target.matches('.close-icon')) {
            
                fileId = event.target.getAttribute('image-id');
                // fileInput = document.getElementById(fileId);
                document.getElementById(fileId).remove();
                const fileInput = document.getElementById('fileInput');
                fileInput.files = null ;
                var output = document.getElementById('imagePreview');
                if (output.innerHTML == "") {
                    fileInput.value = '' ;
                }
                // console.log(Array.from(fileInput.files)) ;
                
                
                // document.getElementById('fileInput').value = '';
         
        }
    });
   
    document.getElementById('header-info-right').addEventListener('click', async () => {
        // Prompt the user for new information using SweetAlert
        const friendId = localStorage.getItem('friendId');
            if (!friendId){
                return ;
            }
        const newFullName = await swal({
            text: 'Thay đổi tên local bạn bè',
            content: 'input',
            button: {
                text: 'Submit',
                closeModal: true,
            },
        });

        if (!newFullName) {
            return;
        }

        try {
            localFullName = [];
            let flag = 0;
            localFullName = JSON.parse(localStorage.getItem("localFullName"));
            if (localFullName == null) {
                localFullName = [];
            }
            // 

            localFullName.forEach(element => {
                if (element.friendId == friendId) {
                    element.newFullName = newFullName;
                    flag = 1;
                }
            });
            if (flag == 0) {
                localFullName.push({ friendId, newFullName });
            }

            localStorage.setItem("localFullName", JSON.stringify(localFullName));



            // Show success message using SweetAlert
            swal('Thành công', 'Thay đổi thành công!', 'success');
            displayLocalFullName(newFullName);

        } catch (error) {
            console.error('Error updating user:', error);

            // Show error message using SweetAlert
            swal('Error', 'Failed to update user information.', 'error');
        }



    });


    const images = document.getElementsByClassName('avatarDisplay');

    // Convert HTMLCollection to array for easier manipulation (optional)
    const imageArray = Array.from(images);

    // Iterate over each image to handle error
    imageArray.forEach(img => {
        img.addEventListener('error', function () {
            this.src = "../resources/Profile pic.svg";// Set fallback image
            this.alt = 'Default Image'; // Set alternative text
        });
    });
    function waitForElement(selector) {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    const addedNodes = Array.from(mutation.addedNodes);
                    for (let node of addedNodes) {
                        if (node instanceof HTMLElement && node.matches(selector)) {
                            observer.disconnect();
                            resolve(node);
                            break;
                        }
                    }
                });
            });
    
            observer.observe(document.body, { childList: true, subtree: true });
    
            // Check if the element is already in the DOM
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
    }

});
document.addEventListener('DOMContentLoaded', function () {
    const images = document.getElementsByClassName('avatarDisplay');

    // Convert HTMLCollection to array for easier manipulation (optional)
    const imageArray = Array.from(images);

    // Iterate over each image to handle error
    imageArray.forEach(img => {
        // Add event listener for error event
        img.addEventListener('error', function () {
            // Check if the browser is offline
            if (!navigator.onLine) {
                // Set fallback image URL when offline
                this.src = "../resources/Profile pic.svg";
                this.alt = 'Default Image';
            } else {
                // Handle other error cases (if any)
                console.error('Failed to load image:', this.src);
            }
        });

        // Optionally, add a load event listener to handle successful image loads
        img.addEventListener('load', function () {
            console.log('Image loaded successfully:', this.src);
        });
    });
});

