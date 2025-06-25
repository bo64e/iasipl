var score = 1000;

script = []
startindex = -1;
offsets = [-1,-1]
LoadScript();

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

async function LoadScript() {
    const id = await GetID();
    script = (await GetScript(id)).split('\n');
    startindex = Math.floor(Math.random() * script.length);
    offsets = [startindex,startindex]
    console.log(script[startindex]);
    option = MakeOption(true);
    option.innerHTML = script[startindex];
    document.getElementsByClassName("options")[0].appendChild(option);
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
