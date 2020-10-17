from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import pandas as pd
import json
from sqlalchemy import create_engine, 
app = Flask(__name__)

mongo = PyMongo(app, uri = "mongodb://localhost:27017/star_wars_app")

p_csv = "C:/Users/flurp/Desktop/Bootcamp/Project_2/Scripts/static/data/planets.csv"

####### mongo db ##########
# p_df = pd.read_csv(p_csv)
# p_df.to_json("p.json")
# jdf = open("p.json").read()
# p_data = json.loads(jdf)
# mongo.db.collection.update({}, p_data, upsert = True)

### sqlite ####

sqlite_engine = create_engine('sqlite:///star_wars_db.sqlite')



@app.route("/")
def home():

    db_data = mongo.db.collection.find_one()
    return render_template("index.html")





if __name__ == "__main__":
    app.run(debug=True)

