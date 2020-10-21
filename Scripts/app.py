# Dependencies 
from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import pandas as pd
import json
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy

# Flask setup 
app = Flask(__name__)


##############################################
# Database setup
##############################################

# Initializing sqlite database engine
sqlite_engine = create_engine('sqlite:///star_wars_db.sqlite')

#Use pandas to convert csv's into dataframes
planets_csv = "./static/data/planets.csv"
species_csv = "./static/data/species.csv"
starships_csv = "./static/data/starships.csv"
vehicles_csv = "./static/data/vehicles.csv"
clean_planets_csv = "./static/data/clean_planets.csv"

planets_df = pd.read_csv(planets_csv)
species_df = pd.read_csv(species_csv)
starships_df = pd.read_csv(starships_csv)
vehicles_df = pd.read_csv(vehicles_csv)
clean_planets_df = pd.read_csv(clean_planets_csv)

# Use pandas to convert dataframes to sql tables and push to database
#planets_df.to_sql("planets", sqlite_engine)
#species_df.to_sql("species", sqlite_engine)
#starships_df.to_sql("starships", sqlite_engine)
#vehicles_df.to_sql("vehicles", sqlite_engine)
#clean_planets_df.to_sql("clean_planets", sqlite_engine)


##############################################
# Connect flask app to database (SQLAlchemy)
##############################################
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///C:/Users/flurp/Desktop/Bootcamp/Project_2/star_wars_db.sqlite'
db = SQLAlchemy(app)

## create reflection
db.Model.metadata.reflect(db.engine)

## define planets class (table)
class planets(db.Model):
    __tablename__ = "planets"
    __table_args__ = {"extend_existing": True}
    LOC_CODE = db.Column(db.Text, primary_key=True)

## define species class (table)
class species(db.Model):
    __tablename__ = "species"
    __table_args__ = {"extend_existing": True}
    LOC_CODE = db.Column(db.Text, primary_key=True)

## define starships class (table)
class starships(db.Model):
    __tablename__ = "starships"
    __table_args__ = {"extend_existing": True}
    LOC_CODE = db.Column(db.Text, primary_key=True)

## define vehicles class (table)
class vehicles(db.Model):
    __tablename__ = "vehicles"
    __table_args__ = {"extend_existing": True}
    LOC_CODE = db.Column(db.Text, primary_key=True)

## define clean_planets class (table)
class clean_planets(db.Model):
    __tablename__ = "clean_planets"
    __table_args__ = {"extend_existing": True}
    LOC_CODE = db.Column(db.Text, primary_key=True)    


##############################################
# Creating routes
##############################################

@app.route("/")
def home():
    return render_template("index.html")

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


# Routes to query database for data

#from planet.csv
@app.route('/data/planets')
def planet_data():
    
    # selection to query from db
    sel = [
        planets.index,
        planets.name,
        planets.rotation_period,
        planets.orbital_period,
        planets.diameter,
        planets.climate,
        planets.gravity,
        planets.terrain,
        planets.surface_water,
        planets.population
    ]

    # results of query
    results = db.session.query(*sel)

    info = []

    for result in results:
        planet_info = {
            "index": result[0],
            "name": result[1],
            "rotation_period": result[2],
            "orbital_period": result[3],
            "diameter": result[4],
            "climate": result[5],
            "gravity": result[6],
            "terrain": result[7],
            "surface_water": result[8],
            "population": result[9]
        }
        info.append(planet_info)
    return jsonify(info)

@app.route('/data/species')
def species_data():
    # selection to query from db
    sel = [
        species().index,
        species().classification,
        species().name,
        species().designation,
        species().average_height,
        species().skin_colors,
        species().hair_colors,
        species().eye_colors,
        species().average_lifespan,
        species().language
    ]
    print(species())
    # results of query
    results = db.session.query(*sel)

    info = []

    for result in results:
        species_info = {
            "index": result[0],
            "name": result[1],
            "classification": result[2],
            "designation": result[3],
            "average_height": result[4],
            "skin_colors": result[5],
            "hair_colors": result[6],
            "eye_colors": result[7],
            "average_lifespan": result[8],
            "language": result[9]
        }
        info.append(species_info)
    print(info)
    return jsonify(info)

if __name__ == "__main__":
    app.run(debug=True)

