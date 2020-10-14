var baseUrl = "https://swapi.dev/api/";
var planetsUrl= "planets/";
var starshipsUrl= "starships/";
var speciesUrl= "species/";
var vehicles= "vehicles/";

d3.json(baseUrl + planetsUrl).then(function(data){
    console.log(data)
});

