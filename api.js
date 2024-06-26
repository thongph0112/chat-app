const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const apiUrl = 'http://10.2.44.52:8888/api';

// Utility function to handle API requests
async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const requestConfig = {
        url: `${apiUrl}${endpoint}`,
        method: method,
        headers: headers,
    };

    if (body) {
        requestConfig.data = JSON.stringify(body);
    }

    try {
        const response = await axios(requestConfig);

        // Log the full response for debugging
        // console.log('Response status:', response.status);
        // console.log('Response headers:', response.headers);
        // console.log('Response data:', response.data);

        return response.data;
    } catch (error) {
        if (error.response) {
            // Log the full error response for debugging
            console.error('API response error:', error.response.status);
            console.error('API response headers:', error.response.headers);
            console.error('API response data:', error.response.data);
            throw new Error(error.response.data.message || 'Network response was not ok');
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response received from the server');
        } else {
            console.error('Error setting up request:', error.message);
            throw new Error('Error setting up request');
        }
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
    formData.append('FullName', fullName);
    if (avatarFile) {
        formData.append('Avatar', avatarFile);
    }

    try {
        const response = await axios.post(`${apiUrl}${endpoint}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders(),
            },
        });

        // console.log('Response data:', response.data);

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('API response error:', error.response.data);
            throw new Error(error.response.data.message || 'Network response was not ok');
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response received from the server');
        } else {
            console.error('Error setting up request:', error.message);
            throw new Error('Error setting up request');
        }
    }
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

// Validate ObjectId format
function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}


function isFileObject(file) {
    return file && typeof file === 'object' && 'path' in file;
}
function dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ab], { type: mimeString });
    return blob;
  }
// Send a message
async function sendMessage(friendID, content, files, token) {
    // console.log(files);
    // console.log(1232);

    
    if (!isValidObjectId(friendID)) {
        throw new Error('Invalid FriendID format. Must be a 24-character hex string.');
    }

    const endpoint = '/message/send-message';
    const formData = new FormData();
    formData.append('FriendID', friendID);
    formData.append('Content', content);
    // console.log(12312);
    
    const fileStream = fs.createReadStream(filePath);

// Append the file to the FormData instance
    formData.append('files', fileStream);
    // console.log(files);
    console.log(123234234);
    // files.forEach((image) => {
    //     // Create a Blob object from the base64-encoded image data
    //     let blob = dataURItoBlob(image.content);
    //     console.log(image);
    //     // Append the Blob object to the FormData with the specified name
    //     formData.append('files', blob);
    //   });

    // formData.append('Contegfhfghnt', content);
    // console.log(typeof(files));
    // console.log(files);
    // if (Array.isArray(files) && files.length > 0) {
    //     files.forEach(file => {
    //         if (isFileObject(file)) {
                // console.log(12312);
    //             const fileStream = fs.createReadStream(file.path);
    //             formData.append('files', fileStream, file.name);
    //             console.log(12312);
    //         } else {
    //             throw new Error('File object must have a valid path');
    //         }
    //     });
    // }
    // formData.forEach((value, key) => {
    //     console.log(key, value);
    // });

    // console.log('FormData contents:');
    console.log('FormData internal data:', formData._streams);
    // for (const pair of formData.entries()) {
    //     console.log(pair[0], pair[1]);
    // }

    try {
        const response = await axios.post(`${apiUrl}${endpoint}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders(),
            },
        });

        // console.log('Response data:', response.data);

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('API response error:', error.response.data);
            throw new Error(error.response.data.message || 'Network response was not ok');
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response received from the server');
        } else {
            console.error('Error setting up request:', error.message);
            throw new Error('Error setting up request');
        }
    }
}

// Get messages
async function getMessages(friendID, lastTime, token) {
    let endpoint = `/message/get-message?FriendID=${friendID}`;
    if (lastTime) {
        endpoint += `&LastTime=${lastTime}`;
    }
    // console.log('API endpoint:', endpoint);
    return await apiRequest(endpoint, 'GET', null, token);
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    getUserInfo,
    getFriendsList,
    sendMessage,
    getMessages,
};
