import json
import torch
import nltk
import pickle
import numpy as np
import pandas as pd

from nnet import NeuralNet
from nltk_utils import bag_of_words
from flask import Flask, render_template, url_for, request, jsonify

app = Flask(__name__)

device = torch.device('cpu')
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

symptoms = []

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
    if sentence.replace(".", "").replace("!","").lower() == "done":
        x_train = []

        with open('list_of_symptoms.pickle', 'rb') as data_file:
            symptoms_list = pickle.load(data_file)

        for each in symptoms_list: 
            if each in symptoms:
                x_train.append(1)
            else: 
                x_train.append(0)

        with open('fitted_model.pickle', 'rb') as modelFile:
            model = pickle.load(modelFile)

        x_train = np.asarray(x_train)            
        disease = model.predict(x_train.reshape(1,-1))[0]

        diseases_description = pd.read_csv("symptom_Description.csv")
        description = diseases_description.loc[diseases_description['Disease'] == disease, 'Description'].iloc[0]

        response_sentence = "It looks to me like you have " + disease + ". Description: " + description 
 
    else:
        symptom, prob = get_symptom(sentence)
        print("Symptom:", symptom, ", prob:", prob)
        if prob > .5:
            response_sentence = f"Hmm, I'm {(prob * 100):.2f}% sure this is " + symptom + "."
            symptoms.append(symptom)
        else:
            response_sentence = "I'm sorry, but I don't understand you."

    return jsonify(response_sentence.replace("_", " "))
