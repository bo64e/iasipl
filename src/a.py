import os,json
season = 0
for ssn in os.listdir(".\\src\\sns"):
    season += 1
    episode = 0
    for ep in os.listdir(os.path.join(".\\src\\sns",ssn)):
        episode += 1
        with open(os.path.join(".\\src\\sns",ssn,ep,ep+".json"),"r",encoding='utf-8') as f:
            j = json.loads(f.read())
            j['id'] = f"{season:02}{episode:02}"
            jse = json.dumps(j,indent=2)
            print(jse)
        with open(os.path.join(".\\src\\sns",ssn,ep,ep+".json"),"w",encoding='utf-8') as fw:
            fw.write(jse)
