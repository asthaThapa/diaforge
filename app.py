from flask import Flask, request, url_for, redirect, render_template


app = Flask(__name__)


@app.route('/')
def init():
    return render_template('sequenceDiagram.html')


@app.route('/stateDiagram')
def getDiagram():
     return render_template('stateDiagram.html')

if __name__ == '__main__':
    app.run(debug=True)