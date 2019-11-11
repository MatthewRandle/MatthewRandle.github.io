let commentSection = document.getElementById("commentSection");
let iframe;

createFrame();

function createFrame() { 
    iframe == null ? iframe = document.createElement("iframe") : null;
    iframe.style.width = "100%";
    iframe.style.border = "none";

    /* if(userToken) {
        iframe.setAttribute("src", `http://localhost:3000/embed/comment-section/${userToken}`);
    }
    else {
        iframe.setAttribute("src", "http://localhost:3000/embed/comment-section");
    } */

    iframe.setAttribute(
        "src", 
        `http://localhost:8080/comment-section/linkedID=${getCommentID() || "null"}`
    );

    iframe.setAttribute("scrolling", "no");
    iframe.id = "commentSectionFrame";
    commentSection.appendChild(iframe);
    iFrameResize({ 
        onMessage: (data) => {
            if(data.message.command === "logout") logout(); 
            else if(data.message.command === "sign-in") signIn();
            else if(data.message.command === "sign-up") signUp();
            else if(data.message.command === "link") {
                window.location.href = data.message.link;
            }
        }
    }, "#commentSectionFrame");

    let popup = window.open("http://localhost:8080", "", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350");
}

function getCommentID() {
    var result = null, tmp = [];
    window.location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === "commentID") result = decodeURIComponent(tmp[1]);
        });

    return result;
}

function signIn() {
    let popup = window.open("http://localhost:3000/embed/auth/sign-in", "", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350");

    /* var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3000/api/auth/sign-in", true);
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            iframe.setAttribute(
                "src", 
                `http://localhost:3000/embed/comment-section/userToken=${JSON.parse(this.response).token || "null"}&linkedID=${getCommentID() || "null"}`
            )
        }
    };

    const params = { email: "lesleysovvy@gmail.com", password: "Sovvy1921!!" };
    let query = "";
    for (key in params) {
        query += encodeURIComponent(key)+"="+encodeURIComponent(params[key])+"&";
    }

    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.withCredentials = true;
    xhr.send(query); */
}

function signUp() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3000/api/auth/sign-up", true);
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            //createFrame(JSON.parse(this.response).token);
            console.log(this.response)
        }
    };

    const params = { email: "test4@hotmail.co.uk", password: "Sovvy1921!!", username: "Test4" };
    let query = "";
    for (key in params) {
        query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
    }

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.withCredentials = true;
    xhr.send(query);
}

function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.withCredentials = true;
    xhttp.open("GET", "http://localhost:3000/api/auth/logout", true);
    xhttp.send();

    xhttp.onload = function () {
        if (xhttp.status === 200 && xhttp.readyState === 4) {
            iframe.src =`http://localhost:3000/embed/comment-section/linkedID=${getCommentID() || "null"}`;
        }
    };
} 