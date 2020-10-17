var baseUrl = "https://swapi.dev/api/";
var planetsUrl = "planets/"


d3.json(baseUrl + planetsUrl).then(function(data){
    results = data.results;
    var names = [];
    var orb_periods = [];
    for (let i = 0; i < results.length; i++) {
        var name = results[i].name;
        var orb_period = results[i].orbital_period;
        names.push(name);
        orb_periods.push(orb_period)
    };
    console.log(orb_periods);
    
});

