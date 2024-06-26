const apiUrl = 'http://10.2.44.52:8888/api';
// const apiUrl = 'http://10.2.44.52:88/api';
var errorMessageDiv = document.getElementById('errorMessage');



// Utility function to handle API requests
async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
    const headers = {};

    if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            method: method,
            headers: headers,
            body: body instanceof FormData ? body : (body !== null ? JSON.stringify(body) : null),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Network response was not ok');
        }

        return result;
    } catch (error) {
        var errorMessage = error ;
        if (errorMessageDiv){
            if(error == "TypeError: Failed to fetch"){
                errorMessage = "Lỗi đường truyền" ;
            }
            if(error == "Error: Incorrect password" || error == "Error: Username not found"){
                errorMessage = "Sai tài khoản hoặc mật khẩu" ;
            }
            
            if(error == "Error: Username already exists"){
                errorMessage = "Tài khoản đã tồn tại" ;
            }
            errorMessageDiv.innerHTML = errorMessage;
        }


        

        if (method === 'POST') {
            let unsentInfo = [];
            const unsentInfoFromStorage = localStorage.getItem('unsentInfo');

            if (unsentInfoFromStorage) {
                unsentInfo = JSON.parse(unsentInfoFromStorage);
            }

            let formDataObj = {};
            if (body instanceof FormData) {
                body.forEach((value, key) => {
                        formDataObj[key] = value;
                });
            } else {
                formDataObj = body;
            }
            console.log(formDataObj);

            if (formDataObj.files || !formDataObj.Content || formDataObj.Content == ""){
                return ;
            }
            unsentInfo.push({
                endpoint: endpoint,
                method: method,
                body: formDataObj,
                token: token,
                error: error.message,
            });

            try {
                localStorage.setItem('unsentInfo', JSON.stringify(unsentInfo));
            } catch (e) {
                console.error('Error saving unsentInfo to localStorage:', e);
            }
        }
       
        throw error; // Re-throw the error to handle it in the calling function if needed
       
    }
}

// Register a new user
async function registerUser(fullName, username, password) {
    const endpoint = '/auth/register';
    const body = {
        FullName: fullName,
        Username: username,
        Password: password,
    };
    return await apiRequest(endpoint, 'POST', body);
}

// Login user
async function loginUser(username, password) {
    const endpoint = '/auth/login';
    const body = {
        Username: username,
        Password: password,
    };
    return await apiRequest(endpoint, 'POST', body);
}

// Update user information

async function updateUser(fullName, avatarFile, token) {
    
    const endpoint = '/user/update';
    const formData = new FormData();
    if (fullName){
        formData.append('FullName', fullName);
    }

    if (avatarFile) {
        formData.append('avatar', avatarFile);
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Network response was not ok');
    }
    return result;
}

// Get user information
async function getUserInfo(token) {
    const endpoint = '/user/info';
    return await apiRequest(endpoint, 'GET', null, token);
}

// Get friends list
async function getFriendsList(token) {
    const endpoint = '/message/list-friend';
    return await apiRequest(endpoint, 'GET', null, token);
}

// Send a message
function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

async function sendMessage(friendID, content, files, token) {
    if (!isValidObjectId(friendID)) {
        throw new Error('Invalid FriendID format. Must be a 24-character hex string.');
    }

    const endpoint = '/message/send-message';
    const formData = new FormData();
    formData.append('FriendID', friendID);
    formData.append('Content', content);

    if (files) {
        files.forEach(file => formData.append('files', file));
    }
    
    return await apiRequest(endpoint, 'POST', formData, token);
}

// Get messages
async function getMessages(friendID, lastTime, token) {
    let endpoint = `/message/get-message?FriendID=${friendID}`;
    if (lastTime) {
        endpoint += `&LastTime=${lastTime}`;
    }
    return await apiRequest(endpoint, 'GET', null, token);
}

// Export functions for use in other files

