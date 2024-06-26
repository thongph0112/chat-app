const btnLogin = document.getElementById("btn-signin");
const btnSignUp = document.getElementById("btn-signup");
if (btnLogin) {
    btnLogin.addEventListener("click", (event) => {
        window.open("sign.html", "_self")
    });


}
if (btnSignUp) {
    btnSignUp.addEventListener("click", (event) => {
        window.open("signup.html", "_self")
    });

}

function removeVal(id) {
    val = document.getElementById(id);
    val.value = "";
}

function showOrHidePass(id) {
    val = document.getElementById(id);
    if (val.type === "text") {
        val.type = "password";
    } else {
        val.type = "text";
    }


}
// function downloadFile(url, filename) {
//     const a = document.createElement('a');
//     a.href = url;
//     
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
// }
async function downloadFile(url, filename) {
    const image = await fetch(url)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement('a')
    link.href = imageURL
    link.download = filename
    document.body.appendChild(link)
    

    link.click()
    document.body.removeChild(link)
  }
function previewImage(event) {
    const fileInput = event.target;
    // 
    const file = fileInput.files[0];
    // 

    if (file) {
        const reader = new FileReader();
        

        reader.onload = function(e) {
            const fileImage = document.getElementById('fileImage');
            fileImage.src = e.target.result;

        };
        reader.readAsDataURL(file);
    }
}

function handleSendMess() {

    var mess = document.getElementById("inputMess");
    document.getElementById("");

}

function handleLogin() {




}

function handleSignUp() {

    
    // document.cookie = "username=John Doe; pass="+pass+"; path=/";
    return;
}

function checkCookie() {
    let user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

// Function to sort the array is_Chat by the CreatedAt property
function sortByCreatedAt(array) {
    return array.sort((a, b) => {
        return new Date(b.CreatedAt) - new Date(a.CreatedAt);
    });
}

// Example usage
function isImageFile(file) {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
    

    return file && acceptedImageTypes.includes(file.type);
}


function formatTimeAgo(timestamp) {
    const now = moment.tz("Asia/Ho_Chi_Minh").toDate();

            // Subtract 50,339 seconds from the current time
    const adjustedNow = moment(now).subtract(50339, 'seconds').toDate();
    const then = new Date(timestamp);
    
    // 

    const diffInSeconds = Math.floor((adjustedNow - then) / 1000);
    

    const secondsInMinute = 60;
    const secondsInHour = 60 * secondsInMinute;
    const secondsInDay = 24 * secondsInHour;
    const secondsInWeek = 7 * secondsInDay;

    if (diffInSeconds < secondsInMinute) {
        return `Vừa xong`;
    } else if (diffInSeconds < secondsInHour) {
        const minutes = Math.floor(diffInSeconds / secondsInMinute);
        return `${minutes} phút trước`;
    } else if (diffInSeconds < secondsInDay) {
        const hours = Math.floor(diffInSeconds / secondsInHour);
        return `${hours} giờ trước`;
    } else if (diffInSeconds < secondsInWeek) {
        const days = Math.floor(diffInSeconds / secondsInDay);
        return `${days} ngày trước`;
    } else {
        const weeks = Math.floor(diffInSeconds / secondsInWeek);
        return `${weeks} tuần trước`;
    }
}

// Example usage:
const timestamp = "2024-05-29T06:14:49.467Z";

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = function(e) {
            reject(e);
        };
        reader.readAsDataURL(file);
    });
}

function searchLocalFullName(friendId) {
    // Initialize localFullName array
    let localFullName = JSON.parse(localStorage.getItem("localFullName")) || [];
    
    // Find the element with the matching friendId
    const foundElement = localFullName.find(element => element.friendId === friendId);
    
    // Return the newFullName if found, otherwise return an empty string
    if (foundElement) {
        
        return foundElement.newFullName;
    } else {
        return "";
    }
}

function clearLocalStorage(exclude) {
    for (var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);

        if (exclude.indexOf(key) === -1) {
            console.log(key);
            localStorage.removeItem(key);
        }
    }
}

if (document.getElementById('userFullName')) {
    // Add event listener for 'click' event
    // alert(2344234234234); // Debugging alert

    
}
function formatMessageTime(createdAt) {
    const messageDate = new Date(createdAt);
    const now = new Date();

    const oneDayInMs = 24 * 60 * 60 * 1000; // One day in milliseconds
    const oneWeekInMs = 7 * oneDayInMs; // One week in milliseconds
    const timeDifference = now - messageDate;

    const options = { hour: '2-digit', minute: '2-digit', hour12: false };

    if (timeDifference < oneDayInMs && now.getDate() === messageDate.getDate()) {
        // Display time in 24-hour format
        return messageDate.toLocaleTimeString([], options);
    } else if (timeDifference < oneWeekInMs) {
        // Display day and time as 07:17 T5 (T for thứ - Vietnamese weekday)
        const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
        const dayOfWeek = daysOfWeek[messageDate.getDay()];
        return `${messageDate.toLocaleTimeString([], options)} ${dayOfWeek}`;
    } else {
        // Display date and time as 05:45 6 Tháng 6, 2024
        const day = messageDate.getDate();
        const month = messageDate.getMonth() + 1; // Month is 0-indexed
        const year = messageDate.getFullYear();
        return `${messageDate.toLocaleTimeString([], options)} ${day} Tháng ${month}, ${year}`;
    }
}
// document.addEventListener('click', (event) => {
//     console.log('Clicked element:', event.target);
// });
       