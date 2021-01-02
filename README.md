# Overview

Creating medical chatbot using python (Flask) and machine learning algorithms for purposes of project for course Intelligent Systems at Faculty of Organization and Informatics, University of Zagreb. 

# Requirements

Python 3.5 and newer.

# Install requirements

Before running the application you need to install the dependencies. We recommend to use the virtual environment
[virtualenv](https://pypi.org/project/virtualenv/) for this.

Linux:

```
python3 -m venv venv
venv/bin/activate
pip install flask torch nltk numpy sklearn
```
Windows:

```
py -3 -m venv venv
venv\Scripts\activate
pip install flask torch nltk numpy==1.19.3 sklearn
```

This will install all the required dependencies needed to run the application successfully.

## Tests

## Run

To run MedicalChatbot, `cd` into MedicalChatbot repo on your computer and run `python -m flask run`. This will run the Flask 
server in development mode on localhost, port 5000.

`* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)`
