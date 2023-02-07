let commentSection, iframe;
let previousThemeName = commenzeThemeName;

window.onload = () => {
    iframe = document.createElement("iframe");
    commentSection = document.getElementById("commenze_commentSection");
    commentSection.style.minHeight = "200px";
    commentSection.style.background = "url(https://commenze.com/branding/logo.svg) center center no-repeat";
    commentSection.style.backgroundSize = "10%";

    setTimeout(() => {
        createFrame();

        window.addEventListener("message", (event) => {
            if (event.data.command === "loaded") {
                commentSection.style.background = "transparent";
            }
            else if (event.data.command === "sign-in") signIn();
            else if (event.data.command === "sign-up") signUp();
            else if (event.data.command === "sign-in-anon") signInAnon();
            else if (event.data.command === "link") window.open(event.data.link, event.data.target || "_blank");
        });
    }, 1);

    listenForThemeNameChange();
}

function listenForThemeNameChange() {
    const listen = () => {
        if (previousThemeName !== commenzeThemeName) {
            previousThemeName = commenzeThemeName;
            refreshFrame();
        }
        
        return setTimeout(() => listen(), 500);
    };

    listen();
}

function refreshFrame() {
    iframe.setAttribute(
        "src",
        `http://localhost:3000/embed/comment-section/comment-section.html?referrer=${commenzeHostname}&url=${window.location.href}&themeName=${commenzeThemeName}&linkedID=${getCommentID() || "null"}`
    );
}

function createFrame() {
    iframe.style.width = "100%";
    iframe.style.height = "0px";
    iframe.style.border = "none";

    iframe.setAttribute(
        "src",
        `http://localhost:3000/embed/comment-section?referrer=${commenzeHostname}&url=${window.location.href}&themeName=${commenzeThemeName}&linkedID=${getCommentID() || "null"}`
    );

    iframe.setAttribute("scrolling", "no");
    iframe.id = "commentSectionFrame";
    commentSection.appendChild(iframe);
    iFrameResize({
        heightCalculationMethod: 'lowestElement'
    }, "#commentSectionFrame");
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
    let popup;
    if (screen.width < 769) popup = window.open("http://localhost:3000/embed/sign-in", "_blank");
    else popup = window.open("http://localhost:3000/embed/sign-in", "", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=477,height=650");

    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        if (event.origin !== "http://localhost:3000") return;
        if (event.data === "signed-in") {
            popup.close();
            iframe.contentWindow.postMessage("signed-in", "http://localhost:3000/embed/comment-section");
        }
    }
}

function signInAnon() {
    let popup;
    if (screen.width < 769) popup = window.open("http://localhost:3000/embed/sign-in-anonymous", "_blank");
    else popup = window.open("http://localhost:3000/embed/sign-in-anonymous", "", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=477,height=650");

    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        if (event.origin !== "http://localhost:3000") return;
        if (event.data === "signed-in-anon") {
            popup.close();
            iframe.contentWindow.postMessage("signed-in", "http://localhost:3000/embed/comment-section");
        }
    }
}

function commenzeSignIn(email, username, expiresIn) {
    if (iframe) {
        iframe.contentWindow.postMessage({
            message: "sso-sign-in",
            username,
            email,
            expiresIn
        }, "http://localhost:3000/embed/comment-section");
    }
}

function commenzeSignOut() {
    if (iframe) {
        iframe.contentWindow.postMessage("sso-sign-out", "http://localhost:3000/embed/comment-section");
    }
}

function signUp() {
    let popup = window.open("http://localhost:3000/embed/sign-up", "", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=477,height=725");

    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        if (event.origin !== "http://localhost:3000") return;
        if (event.data === "signed-up") {
            console.log("SIGNED UP")
            popup.close();
            iframe.contentWindow.postMessage("signed-up", "http://localhost:3000/embed/comment-section");
        }
    }
}