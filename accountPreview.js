let accountPreview = document.getElementById("accountPreview");
let accountPreviewIFrame;

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
    accountPreviewIFrame == null ? accountPreviewIFrame = document.createElement("iframe") : null;
    accountPreviewIFrame.style.width = "100%";
    accountPreviewIFrame.style.border = "none";

    if(userToken) {
        accountPreviewIFrame.setAttribute("src", `http://localhost:3000/embed/account-preview/${userToken}`);
    }
    else {
        accountPreviewIFrame.setAttribute("src", "http://localhost:3000/embed/account-preview");
    }

    accountPreviewIFrame.setAttribute("scrolling", "no");
    accountPreviewIFrame.id = "accountPreviewFrame";
    accountPreview.appendChild(accountPreviewIFrame);
    iFrameResize({ 
        onMessage: (data) => {
            if(data.message === "logout") logout();
            else if(data.message === "sign-in") {
                signIn();
                //window.location.href = "/courses/?commentID=351";
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
            if (result) iframe.iFrameResizer.moveToAnchor(result);
        }
    }, "#accountPreviewFrame");
}

function signIn() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:3000/api/auth/sign-in", true);
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            accountPreviewIFrame.setAttribute("src", `http://localhost:3000/embed/account-preview/${JSON.parse(this.response).token}`)
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
            accountPreviewIFrame.src=`http://localhost:3000/embed/account-preview`;
        }
    };
} 