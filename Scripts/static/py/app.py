from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo

app = Flask(__name__)

mongo = PyMongo(app, uri = "mongodb://localhost:27017/star_wars_app")

@app.route("/")
def home():

    db_data = mongo.db.collection.find_one()
    return render_template("index.html", star = db_data)
















if __name__ == "__main__":
    app.run(debug=True)

