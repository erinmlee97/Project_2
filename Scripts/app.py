# Dependencies 
from flask import Flask, render_template, redirect, jsonify, g
from flask_pymongo import PyMongo
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, MetaData
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import pandas as pd
import json
import sqlite3

##############################################
# Flask setup 
##############################################
app = Flask(__name__)


##############################################
# Database setup
##############################################

# Initializing sqlite database engine
engine = create_engine('sqlite:///star_wars_db.sqlite')

#Use pandas to convert csv's into dataframes
planets_csv = "./static/data/planets.csv"
species_csv = "./static/data/species.csv"
starships_csv = "./static/data/starships.csv"
vehicles_csv = "./static/data/vehicles.csv"
clean_planets_csv = "./static/data/clean_planets.csv"
clean_species_csv = "./static/data/clean_species.csv"
clean_vehicles_csv = "./static/data/clean_vehicles.csv"

planets_df = pd.read_csv(planets_csv)
species_df = pd.read_csv(species_csv)
starships_df = pd.read_csv(starships_csv)
vehicles_df = pd.read_csv(vehicles_csv)
clean_planets_df = pd.read_csv(clean_planets_csv)
clean_species_df = pd.read_csv(clean_species_csv)
clean_vehicles_df = pd.read_csv(clean_vehicles_csv)

# Use pandas to convert dataframes to sql tables and push to database
# planets_df.to_sql("planets", engine)
# species_df.to_sql("species", engine)
# starships_df.to_sql("starships", engine)
# vehicles_df.to_sql("vehicles", engine)
# clean_planets_df.to_sql("clean_planets", engine)
# clean_species_df.to_sql("clean_species", engine)
# clean_vehicles_df.to_sql("clean_vehicles", engine)



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

#planet table
@app.route('/data/planets')
def planet_data():
    
    planets = Table('planets', MetaData(engine), autoload=True, autoload_with=engine)
    
    session = Session(engine)
    
    results = session.query(planets).all()
    
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

#clean_planets table
@app.route('/data/clean_planets')
def clean_planets_data():
    clean_planets = Table('clean_planets', MetaData(engine), autoload=True, autoload_with=engine)
    
    session = Session(engine)
    
    results = session.query(clean_planets).all()
    
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

#species table
@app.route('/data/species')
def species_data():
    
    species = Table('species', MetaData(engine), autoload=True, autoload_with=engine)
    
    session = Session(engine)
    
    results = session.query(species).all()

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
    
    return jsonify(info)

#clean_species table
@app.route('/data/clean_species')
def clean_species_data():
    clean_species = Table('clean_species', MetaData(engine), autoload=True, autoload_with=engine)
    
    session = Session(engine)
    
    results = session.query(clean_species).all()

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
    
    return jsonify(info)

#clean_vehicles table
@app.route('/data/clean_vehicles')
def clean_vehicles_data():
    clean_vehicles = Table('clean_vehicles', MetaData(engine), autoload=True, autoload_with=engine)
    
    session = Session(engine)
    
    results = session.query(clean_vehicles).all()

    info = []
    for result in results:
        vehicles_info = {
            "index": result[0],
            "name": result[1],
            "model": result[2],
            "manufacturer": result[3],
            "cost_in_credits": result[4],
            "length": result[5],
            "max_atmosphering_speed": result[6],
            "crew": result[7],
            "passengers": result[8],
            "cargo_capacity": result[9],
            "consumables": result[10],
            "vehicle_class": result[11]
        }
        info.append(vehicles_info)
    
    return jsonify(info)


if __name__ == "__main__":
    
    app.run(debug=True)

