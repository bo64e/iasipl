var score = 1000;

ended = false;
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
    if (ended) {
        for (let i = 0; i < info.length; i++) {
            if (info[i]['id'] === scriptid) {
                Win(info[i]);
                return;
            }
        }
        return;
    }
    var attempt = document.getElementById("search").value;
    for (let i = 0; i < info.length; i++) {
        if (info[i]['title'].toLowerCase() === attempt.toLowerCase()) {
            if (info[i]['id'] === scriptid) {
                Win(info[i]);
                return;
            }
            else if (!guessedIDs.includes(info[i]['id'])) {
                lost = false;
                hearts = document.getElementsByClassName("heart")
                for (let j = 0; j < hearts.length-1; j++) {
                    if (hearts[j].src.endsWith("static/src/imgs/heart_full.svg") && !lost){
                        hearts[j].src = "static/src/imgs/heart_empty.svg";
                        lost = true;
                    }
                }
                if (!lost) {
                    hearts[hearts.length-1].src = "static/src/imgs/heart_empty.svg";
                    Lose(info[i]);
                }
                guessedIDs.push(info[i]['id']);
                ColourResults();
            }
        }
    }
}

function Win(episode) {
    document.getElementById("resultModal").querySelector(".modal-header").classList.add("success");
    document.getElementById("modalStatus").textContent = "You Win!";
    document.getElementById("scoreDisplay").textContent = score;
    document.getElementById("livesLostDisplay").textContent = Array.from(document.getElementsByClassName("heart")).filter(h => h.src.endsWith("static/src/imgs/heart_full.svg")).length;
    document.getElementById("episodeTitle").textContent = episode['title'];
    document.getElementById("episodeDesc").textContent = episode['plot'];
    document.getElementById("episodeImg").src = episode['img'];
    document.getElementById("resultModal").classList.remove("hidden");
    document.getElementById("resultModal").scrollTop = 0;
    document.documentElement.scrollTop = 0;
    ended = true;
}

function Lose(episode) {
    document.getElementById("resultModal").querySelector(".modal-header").classList.add("failure");
    document.getElementById("modalStatus").textContent = "You Lose!";
    document.getElementById("scoreDisplay").textContent = score;
    document.getElementById("livesLostDisplay").textContent = Array.from(document.getElementsByClassName("heart")).filter(h => h.src.endsWith("static/src/imgs/heart_full.svg")).length;
    document.getElementById("episodeTitle").textContent = episode['title'];
    document.getElementById("episodeDesc").textContent = episode['plot'];
    document.getElementById("episodeImg").src = episode['img'];
    document.getElementById("resultModal").classList.remove("hidden");
    document.getElementById("resultModal").scrollTop = 0;
    document.documentElement.scrollTop = 0;
    ended = true;
}


function Copy(){
    text = "I "
    lives = Array.from(document.getElementsByClassName("heart")).filter(h => h.src.endsWith("static/src/imgs/heart_full.svg")).length;``
    if (lives > 0){
        text += "won this piece of shit game with a score of " + score + "/1000 and " + lives + "/4 lives left.";
    }
    else {
        text += "lost this piece of shit game with a score of " + score + ".";
    }
    navigator.clipboard.writeText(text);
    document.getElementById("shareBtn").textContent = "Copied!"
}

function Back(){
    document.getElementById("resultModal").classList.add("hidden");
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
  else if (event.key === 'Escape') {
    document.getElementById("resultModal").classList.add("hidden");
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


