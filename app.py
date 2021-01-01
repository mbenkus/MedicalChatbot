import json
import torch
import nltk
from nnet import NeuralNet
from nltk_utils import bag_of_words
from flask import Flask, render_template, url_for, request, jsonify

app = Flask(__name__)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
FILE = "data.pth"
model_data = torch.load(FILE)

input_size = model_data['input_size']
hidden_size = model_data['hidden_size']
output_size = model_data['output_size']
all_words = model_data['all_words']
tags = model_data['tags']
model_state = model_data['model_state']

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()


def get_symptom(sentence):
    sentence = nltk.word_tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X)

    output = model(X)
    _, predicted = torch.max(output, dim=1)
    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    prob = prob.item()

    return tag, prob


# print(get_symptom("My head hurts!!!"))


@app.route('/')
def index():
    data = []
    file = open("static/assets/files/ds_symptoms.txt", "r")
    symptoms = file.readlines()
    for s in symptoms:
        data.append(s.replace("'", "").replace("_", " ").replace(",\n", ""))
    data = json.dumps(data)

    return render_template('index.html', data=data)


@app.route('/symptom', methods=['GET', 'POST'])
def predict_symptom():
    print("Request json:", request.json)
    sentence = request.json['sentence']
    symptom, prob = get_symptom(sentence)
    print("Symptom:", symptom, ", prob: ", prob)
    # todo probability limit
    # todo end keyword
    response_sentence = "I have identified " + symptom + "."
    return jsonify(response_sentence.replace("_", " "))
