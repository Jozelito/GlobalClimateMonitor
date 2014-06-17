from flask import Flask,jsonify
app = Flask(__name__)
app.config.update(
    DEBUG=True
)

@app.route('/', methods = ['GET'])                                            
def alive():
    return jsonify( { "status" : "running"})
