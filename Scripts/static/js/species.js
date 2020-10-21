function makeResponsive() {
    // Use d3 to pull in data
    d3.csv('../static/data/clean_species.csv').then(function(speciesData) {
        var names = speciesData.map(data => data.name);
        var lifespan = speciesData.map(data => data.average_lifespan);
        var height = speciesData.map(data => data.average_height);
        var classification = speciesData.map(data => data.classification);
        var language = speciesData.map(data => data.language);
        console.log("names", names);
        console.log("lifespan", lifespan);
        console.log("height", height);
        console.log("classification", classification);
        console.log("language", language);
        
        // Use d3 to select the table body to append the data to the table
        d3.select("tbody")
            .selectAll("tr")
            .data(speciesData)
            .enter()
            .append("tr")
            .html(function(d) {
                return `<td>${d.name}</td><td>${d.classification}</td><td>${d.language}</td><td>${d.average_height}</td><td>${d.average_lifespan}</td>`;
            });
    }).catch(function(error) {        //catches errors
        console.log(error);
    });
