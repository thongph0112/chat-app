token = localStorage.getItem("token");
const currentUrl = window.location.href;
// 
var page = ["sign.html","signup.html"];
var flag  = 0;

for (i in page){
    
    if ( currentUrl.includes(page[i]) ){
        flag = 1;
        
        // 
        
        if (token) {
            location.href = "messenger.html" ; 
            // return;
        }
    }

    }
    if (flag == 0){
        
        if (!token) {
            location.href = "sign.html" ; 
    }
   
        
}
