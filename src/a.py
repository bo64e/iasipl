import os



for root, dirs, files in os.walk("."):
    for file in files:
        # with open(os.path.join(root, file), "r", encoding='utf-8') as f:
            if file.endswith('.html'):
                os.mkdir(os.path.join(root, file.replace('.html', '')))
                #put the file in the new directory but acutally
                os.rename(os.path.join(root, file), os.path.join(root, file.replace('.html', ''), file))