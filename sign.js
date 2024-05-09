// document.getElementById("btn-signin").onclick(()=>{
//     window.open("signin.html","_self")
// });
// document.getElementById("btn-signup").onclick(()=>{
//     window.open("signup.html","_self")
// });
btn_signin = document.getElementsByClassName("btn-signin") ;

btn_signin[0].onclick = function(){window.open("sign.html","_self")};

btn_signup = document.getElementsByClassName("btn-signup") ;
btn_signup[0].onclick = function(){window.open("signup.html","_self")};

function removeVal(id){
    val = document.getElementById(id) ;
    val.value = "" ;
}
function showOrHidePass(id){
    val = document.getElementById(id) ;
    if (val.type === "text" )
    {
        val.type = "password";
    }else {
        val.type = "text";
    }

    
}
function handleSendMess(){

    var mess= document.getElementById("inputMess");
    document.getElementById("");

}