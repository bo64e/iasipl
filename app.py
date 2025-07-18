from flask import Flask, Response, abort, request, send_file
import os, random, json, webbrowser

app = Flask(__name__)

@app.route('/get-id', methods=['GET'])
def get_id():
    try:
        ids = []
        for ssn in os.listdir(".\\static\\src\\sns"):
            for ep in os.listdir(os.path.join(".\\static\\src\\sns",ssn)):
                with open(os.path.join(".\\static\\src\\sns",ssn,ep,ep+".json"),"r",encoding='utf-8') as f:
                    j = json.loads(f.read())
                    ids.append(j['id'])
        if len(ids) <= 0:
            abort(500, description=str("No IDs found"))
        else:
            contents = random.choice(ids)
            return Response(contents, mimetype='text/plain')
    except FileNotFoundError:
        abort(404, description="File not found")
    except Exception as e:
        abort(500, description=str(e))


@app.route('/get-script', methods=['GET'])
def get_script():
    id = request.args.get('id')
    if not id:
         return "No ID", 400
    try:
        contents = ""
        for ssn in os.listdir(".\\static\\src\\sns"):
            for ep in os.listdir(os.path.join(".\\static\\src\\sns",ssn)):
                with open(os.path.join(".\\static\\src\\sns",ssn,ep,ep+".json"),"r",encoding='utf-8') as f:
                    j = json.loads(f.read())
                    if contents == "" and j['id'] == id:
                        with open(os.path.join(".\\static\\src\\sns",ssn,ep,ep,ep+".html"),"r",encoding='utf-8') as fr:
                            contents = fr.read()
                    elif contents != "" and j['id'] == id:
                        abort(500, description="Multiple IDs found")
        if contents == "":
            abort(500, description="No ID found")
        return Response(contents, mimetype='text/plain')
    except FileNotFoundError:
        abort(404, description="File not found")
    except Exception as e:
        abort(500, description=str(e))

@app.route('/get-info', methods=['GET'])
def get_info():
    try:
        jso = []
        for ssn in os.listdir(".\\static\\src\\sns"):
            for ep in os.listdir(os.path.join(".\\static\\src\\sns",ssn)):
                with open(os.path.join(".\\static\\src\\sns",ssn,ep,ep+".json"),"r",encoding='utf-8') as f:
                    j = json.load(f)
                    j['title'] = ssn+ep
                    jso.append(j)
        else:
            return Response(json.dumps(jso), mimetype='text/plain')
    except FileNotFoundError:
        abort(404, description="File not found")
    except Exception as e:
        abort(500, description=str(e))


@app.route('/')
def index():
    return send_file('index.html')

if __name__ == '__main__':
    webbrowser.open("http://127.0.0.1:5000")
    app.run(debug=True)
    
