import json
from flask import Flask, render_template, url_for
app = Flask(__name__)

@app.route('/')
def index():
    data = []
    file = open("static/assets/files/ds_symptoms.txt", "r")
    symptoms = file.readlines()
    for s in symptoms:
        data.append(s.replace("'","").replace("_", " ").replace(",\n", ""))
    data = json.dumps(data)
    return render_template('index.html', data=data)