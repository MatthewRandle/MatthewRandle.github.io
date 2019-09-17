let commentSection = document.getElementById("commentSection");
let iframe;

getUserToken();

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
}

function createFrame(userToken) { 
    iframe == null ? iframe = document.createElement("iframe") : null;
    iframe.style.width = "100%";
    iframe.style.border = "none";

    if(userToken) {
        iframe.setAttribute("src", `http://localhost:3000/comment-section/${userToken}/#351`);
    }
    else {
        iframe.setAttribute("src", "http://localhost:3000/comment-section");
    }

    iframe.setAttribute("scrolling", "no");
    iframe.id = "commentSectionFrame";
    commentSection.appendChild(iframe);
    iFrameResize({ 
        onMessage: (data) => {
            if(data.message === "logout") logout();
            else if(data.message === "sign-in") {
                signIn();
                window.location.href = "/courses/?commentID=351";
            }
            else if(data.message === "sign-up") signUp();
        },
        onResized: ({ iframe }) => {
            //search for the commentID in the query
            var result = null, tmp = [];
            window.location.search
                .substr(1)
                .split("&")
                .forEach(function (item) {
                    tmp = item.split("=");
                    if (tmp[0] === "commentID") result = decodeURIComponent(tmp[1]);
                });
            iframe.iFrameResizer.moveToAnchor(result);
        }
    }, "#commentSectionFrame");
}

function signIn() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3000/api/auth/sign-in", true);
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            iframe.setAttribute("src", `http://localhost:3000/comment-section/${JSON.parse(this.response).token}`)
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

function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.withCredentials = true;
    xhttp.open("GET", "http://localhost:3000/api/auth/logout", true);
    xhttp.send();

    xhttp.onload = function () {
        if (xhttp.status === 200 && xhttp.readyState === 4) {
            iframe.src=`http://localhost:3000/comment-section`;
        }
    };
} 