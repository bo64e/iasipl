import os,json
season = 0
for root, dirs, files in os.walk("C:\\Users\\jonop\\Downloads\\iasip\\static\\src\\sns"):
    for file in files:
        if file.endswith(".html"):
            with open(os.path.join(root,file),"r") as f:
                a = f.read().splitlines()
                if "" in [x.strip() for x in a]:
                    print(file)