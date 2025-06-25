import msvcrt
import os,random, keyboard, re
import time
import shutil
import traceback

terminal_size = shutil.get_terminal_size()
os.system("cls")
def brak(input_string):
    return re.sub(r'<[^>]*>', '', input_string)

def display(arr):
    script = arr[0]
    name = arr[1]
    print(arr[1])
    start = random.randint(0,len(script)-1)
    s = script[start]+"\n"#.ljust(terminal_size.columns," ")+"\n"
    f = 0
    b = 0
    
    while True:
        try:
            os.system("cls")
            # print(name)
            # print(len(script), script[-1])
            # print(start-b, start, start+f)
            print(brak(s),end="")
            time.sleep(0.15)
            while True:
                if keyboard.is_pressed("down"):
                    if start+f >= len(script)-1:
                        break
                    f += 1
                    s += script[start+f]+"\n"#.ljust(terminal_size.columns," ")+"\n"
                    break
                if keyboard.is_pressed("up"):
                    if start-b <= 0:
                        break
                    b += 1
                    s = script[start-b]+"\n"+s#.ljust(terminal_size.columns," ")+"\n"+s
                    break
        except KeyboardInterrupt:
            break
    print()
    print(name)
    while msvcrt.kbhit():
        msvcrt.getch()
    input()

a = []

for root, dirs, files in os.walk("."):
    for i in files:
        if not ".html" in i:
            continue
        with open(os.path.join(root,i),"r", encoding='utf-8') as f:
            red = "".join([i+"\n" for i in f.read().splitlines() if i.strip() != ""])
        path = os.path.normpath(os.path.join(root,i))
        print()
        #a.append([red.splitlines(), (root[2:]+" "+i.replace(".html",""))])
        a.append([red.splitlines(), "".join(os.path.normpath(os.path.join(root,i)).split(os.sep)[-4:-2])])
random.shuffle(a)

while True:
    try:
        display(random.choice(a))
    except:
        traceback.print_exc()
        input()
        break
