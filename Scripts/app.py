from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import pandas as pd
import json
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///C:/Users/flurp/Desktop/Bootcamp/Project_2/star_wars_db.sqlite'
db = SQLAlchemy(app)
db.Model.metadata.reflect(db.engine)

class planets(db.Model):
    __tablename__ = "planets"
    __table_args__ = {"extend_existing": True}
    LOC_CODE = db.Column(db.Text, primary_key=True)

### sqlite ####

# sqlite_engine = create_engine('sqlite:///star_wars_db.sqlite')

# p_df.to_sql("planets", sqlite_engine)


###### mongo db ##########

mongo = PyMongo(app, uri = "mongodb://localhost:27017/star_wars_app")
p_csv = "C:/Users/flurp/Desktop/Bootcamp/Project_2/Scripts/static/data/planets.csv"
p_df = pd.read_csv(p_csv)
p_df.to_json("p.json")
jdf = open("p.json").read()
p_data = json.loads(jdf)
mongo.db.collection.update({}, p_data, upsert = True)


@app.route("/")
def home():

    star = mongo.db.collection.find_one()
    return render_template("index.html", star = star)


@app.route("/planets")
def planets():
    return render_template("planets.html")

@app.route("/species")
def species():
    return render_template("species.html")

@app.route("/starships")
def starships():
    return render_template("starships.html")

@app.route("/vehicles")
def vehicles():
    return render_template("vehicles.html")

@app.route('/planet_data')
def planet_data():
    star = mongo.db.collection.find_one()
    
    return jsonify(star["name"])


if __name__ == "__main__":
    app.run(debug=True)

