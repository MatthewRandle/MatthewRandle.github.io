let commentSection = document.getElementById("commentSection");
let signInButton = document.createElement("button");
signInButton.innerHTML = "Sign in to comment";
let signUpButton = document.createElement("button");
signUpButton.innerHTML = "Sign up to comment";
commentSection.appendChild(signInButton);
commentSection.appendChild(signUpButton);
let iframe;

createFrame("testtoken");
/* getUserToken();

function getUserToken() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            createFrame(JSON.parse(this.response).token);
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("GET", "http://localhost:3000/api/auth/get-user-token", true);
    xhttp.send();
} */

function createFrame(userToken) {
    iframe == null ? iframe = document.createElement("iframe") : null;
    iframe.style.width = "100%";
    iframe.style.height = "100vh";

    if(userToken) {
        iframe.setAttribute("src", `http://localhost:3000/comment-section/${userToken}`);
    }
    else {
        iframe.setAttribute("src", "http://localhost:3000/comment-section");
    }

    commentSection.appendChild(iframe);
}

signInButton.addEventListener("click", () => {
    signIn();
});

function signIn() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3000/api/auth/sign-in", true);
    xhr.onload = function () {
    if (xhr.status === 200 && xhr.readyState === 4) {
            createFrame(JSON.parse(this.response).token);
        }
    };

    const params = { email: "lesleysovvy@gmail.com", password: "Sovvy1921!!" };
    let query = "";
    for (key in params) {
        query += encodeURIComponent(key)+"="+encodeURIComponent(params[key])+"&";
    }

    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.withCredentials = true;
    xhr.send(query);
}

signUpButton.addEventListener("click", () => {
    signUp();
});

function signUp() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3000/api/auth/sign-up", true);
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            //createFrame(JSON.parse(this.response).token);
            console.log(this.response)
        }
    };

    const params = { email: "randle.matthew@hotmail.co.uk", password: "Sovvy1921!!" };
    let query = "";
    for (key in params) {
        query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
    }

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.withCredentials = true;
    xhr.send(query);
}