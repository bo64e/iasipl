var score = 1000;

document.getElementById("search").value = "";
document.getElementsByClassName("search-results")[0].innerHTML = "";
script = []
info = []
startindex = -1;
offsets = [-1,-1]
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
    })
}



async function AddUp(){
    if (offsets[0] > 0){
        offsets[0]--;
        score -= 100;
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
        score -= 100;
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


    return newResult;
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
    document.getElementsByClassName("search-results")[0].innerHTML = "";
    const query = document.getElementById("search").value;
    const results = fuse.search(query);

    for(let i = 0; (i < results.length && i < 20); i++) {
        document.getElementsByClassName("search-results")[0].appendChild(MakeResult(results[i].item));
    }
    });
