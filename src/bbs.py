from bs4 import BeautifulSoup
import requests
import os, json

ROOT = os.getcwd()


for season in range(1,17):
    os.chdir(ROOT)
    rt = ([i for i in os.listdir() if os.path.isdir(i)][season-1])
    print(os.getcwd())
    url = f"https://www.imdb.com/title/tt0472954/episodes/?season={season}"


    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    ##get article tags
    soup = BeautifulSoup(requests.get(url, headers=headers).text, 'html.parser')

    articles = soup.findAll('article')
    a = []
    for art in range(len(articles)):
        article = articles[art]
        os.chdir(ROOT)
        os.chdir(rt)
        os.chdir([i for i in os.listdir() if os.path.isdir(i)][art])
        print(os.getcwd(), art+1)
        ##display in readable format
        #print(article.prettify())
        plots = (article.find_all('div', class_='ipc-html-content-inner-div'))
        imgs = (article.find_all('img', class_='ipc-image'))
        #download image from src
        #print(plots)
        plot = plots[0]
        img_src = imgs[0].get('src')
        print(json.dumps({"plot": plot.text, "img": img_src}, indent=4))
        a = {"plot": plot.text, "img": img_src}

        if img_src and plot:
            with open(os.path.basename(os.getcwd()) + '.json', 'w') as f:
                f.write(json.dumps(a, indent=4))



    season += 1