let commentSection, iframe;

window.onload = () => {
    iframe = document.createElement("iframe");
    commentSection = document.getElementById("commenze_commentSection");
    commentSection.style.minHeight = "200px";
    commentSection.style.background = "url(https://commenze.com/Logo.svg) center center no-repeat";
    commentSection.style.backgroundSize = "10%";

    setTimeout(() => {
        createFrame();

        window.addEventListener("message", (event) => {
            if (event.data.command === "loaded") {
                commentSection.style.background = "transparent";
            }
            else if (event.data.command === "sign-in") signIn();
            else if (event.data.command === "sign-up") signUp();
            else if (event.data.command === "link") window.open(event.data.link, event.data.target || "_blank");
        });
    }, 1);
}

function createFrame() {
    iframe.style.width = "100%";
    iframe.style.height = "0px";
    iframe.style.border = "none";

    iframe.setAttribute(
        "src",
        `https://commenze.com/embed/comment-section/comment-section.html?referrer=${commenzeHostname}&url=${window.location.href}&themeName=${commenzeThemeName}&linkedID=${getCommentID() || "null"}`
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
    if (screen.width < 769) popup = window.open("https://commenze.com/embed/sign-in", "_blank");
    else popup = window.open("https://commenze.com/embed/sign-in", "", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=477,height=650");

    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        if (event.origin !== "https://commenze.com") return;
        if (event.data === "signed-in") {
            popup.close();
            iframe.contentWindow.postMessage("signed-in", "https://commenze.com/embed/comment-section");
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
        }, "https://commenze.com/embed/comment-section");
    }
}

function commenzeSignOut() {
    if (iframe) {
        iframe.contentWindow.postMessage("sso-sign-out", "https://commenze.com/embed/comment-section");
    }
}

function signUp() {
    let popup = window.open("https://commenze.com/embed/sign-up", "", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=477,height=725");

    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        if (event.origin !== "https://commenze.com") return;
        if (event.data === "signed-up") {
            console.log("SIGNED UP")
            popup.close();
            iframe.contentWindow.postMessage("signed-up", "https://commenze.com/embed/comment-section");
        }
    }
}