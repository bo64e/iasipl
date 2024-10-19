var score = 1000;

function viewup() {
    score = score - 100;
    document.getElementById("score").innerText = "Score: "+score;
    var divElement = document.createElement("div");
    divElement.innerText = score;
    var container = document.getElementById("line-container");
    container.insertBefore(divElement, container.firstChild);
    //document.getElementById("line-container").scrollTop = 0;
}

function viewdown() {
    score = score - 100;
    document.getElementById("score").innerText = "Score: "+score;
    var divElement = document.createElement("div");
    divElement.innerText = score;
    document.getElementById("line-container").appendChild(divElement);
    //document.getElementById("line-container").scrollTop = document.getElementById("line-container").scrollHeight;
}