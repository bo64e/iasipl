var score = 1000;


document.getElementById("sortDropdown").value = "relevance";
document.getElementById("search").value = "";
document.getElementsByClassName("search-results")[0].innerHTML = "";
script = []
info = []
scriptid = "";
startindex = -1;
offsets = [-1,-1]
guessedIDs = [];
LoadScript();
fuse = null;

async function GetID() {
    const response = await fetch('/get-id');

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const id = await response.text();
    console.log("Got ID: " + id);
    return id;
}

async function GetScript(id){
    const response = await fetch('/get-script?id=' + id);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const script = await response.text();
    return script;
}

async function GetInfo(){
    const response = await fetch('/get-info');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const info = await response.json();
    return info;
}

async function LoadScript() {
    const id = await GetID();
    scriptid = id;
    script = (await GetScript(id)).split('\n');
    startindex = Math.floor(Math.random() * script.length);
    offsets = [startindex,startindex]
    console.log(script[startindex]);
    option = MakeOption(true);
    option.innerHTML = script[startindex];
    document.getElementsByClassName("options")[0].appendChild(option);
    info = await GetInfo();
    fuse = new Fuse(info, {
        keys: ['title'],
        threshold: 0.4,
    });
}



async function AddUp(){
    if (offsets[0] > 0){
        offsets[0]--;
        score -= 50;
        option = MakeOption();
        option.innerHTML = script[offsets[0]];
        document.getElementsByClassName("options")[0].prepend(option);
        document.getElementsByClassName("options-container")[0].scrollTop = 0;
    }
    document.getElementsByClassName("score")[0].innerHTML = "Score: " + score;
}

function AddDown(){
    if (offsets[1] < script.length - 1){ 
        offsets[1]++;
        score -= 50;
        option = MakeOption();
        option.innerHTML = script[offsets[1]];
        document.getElementsByClassName("options")[0].appendChild(option);
        document.getElementsByClassName("options-container")[0].scrollTop = 100000;
    }
    document.getElementsByClassName("score")[0].innerHTML = "Score: " + score;
}

function MakeOption(first = false) {
    var newOption = document.createElement('div');
    newOption.classList.add('option-box');
    if (first) {
        newOption.id = 'first';
    }
    return newOption;
}

function MakeResult(item){
    var newResult = document.createElement('div');
    newResult.classList.add('search-result');
    var img = document.createElement('img');
    img.src = item['img'];
    img.alt = item['title'];
    newResult.appendChild(img);
    var info = document.createElement('div');
    info.classList.add('result-info');
    var title = document.createElement('div');
    title.textContent = item['title'];
    title.classList.add('result-title');
    info.appendChild(title);
    var subtitle = document.createElement('div');
    subtitle.classList.add('result-subtitle');
    subtitle.textContent = item['plot'];
    info.appendChild(subtitle);
    newResult.appendChild(info);
    newResult.onclick = function() {document.getElementById("search").value = item['title'];}

    if (guessedIDs.includes(item['id'])) {
        console.log("Already guessed: " + item['title']);
        newResult.style.backgroundColor = "#663333";
    }

    return newResult;
}

function ColourResults() {
    const results = document.getElementsByClassName("search-result");
    for (let i = 0; i < results.length; i++) {
        const title = results[i].getElementsByClassName("result-title")[0].textContent;
        for (let j = 0; j < info.length; j++) {
            if (info[j]['title'].toLowerCase() === title.toLowerCase()) {
                if (guessedIDs.includes(info[j]['id'])) {
                    results[i].style.backgroundColor = "#663333";
                }
            }
        }
    }
}


function Enter(){
    var attempt = document.getElementById("search").value;
    for (let i = 0; i < info.length; i++) {
        if (info[i]['title'].toLowerCase() === attempt.toLowerCase()) {
            if (info[i]['id'] === scriptid) {
                alert("You already have this script loaded!");
                Win();
                return;
            }
            else if (!guessedIDs.includes(info[i]['id'])) {
                lost = false;
                hearts = document.getElementsByClassName("heart")
                for (let j = 0; j < hearts.length; j++) {
                    if (hearts[j].src.endsWith("static/src/imgs/heart_full.svg") && !lost){
                        hearts[j].src = "static/src/imgs/heart_empty.svg";
                        lost = true;
                    }
                }
                guessedIDs.push(info[i]['id']);
                ColourResults();
            }
        }
    }
}

function Win(){

}

function BuildResults(query, sorted = false) {
    document.getElementsByClassName("search-results")[0].innerHTML = "";
    const results = fuse.search(query);

    if (sorted) {
        results.sort((a,b) => a.item['title'].localeCompare(b.item['title']));
    }

    for(let i = 0; (i < results.length && i < 20); i++) {
        document.getElementsByClassName("search-results")[0].appendChild(MakeResult(results[i].item));
    }
    document.getElementsByClassName("search-results")[0].scrollTop = 0;
}





document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    AddUp();
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault();
    AddDown();
  }
});

document.getElementById("search").addEventListener('input', () => {
    if (document.getElementById("sortDropdown").value === "relevance") {
        BuildResults(document.getElementById("search").value, false);
    }
    else if (document.getElementById("sortDropdown").value === "alphabetically") {
        BuildResults(document.getElementById("search").value, true);
    }
    
});

document.getElementById("sortDropdown").addEventListener('change', () => {
    if (document.getElementById("sortDropdown").value === "relevance") {
        BuildResults(document.getElementById("search").value, false);
    }
    else if (document.getElementById("sortDropdown").value === "alphabetically") {
        BuildResults(document.getElementById("search").value, true);
    }
    
});