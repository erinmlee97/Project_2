// Get width and height for SVG area
var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenYAxis = "rotation_period";

// function used for updating x-scale var upon click on axis label
function yScale(planetData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(planetData, d => d[chosenYAxis]) * 0.8,
        d3.max(planetData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
    return yLinearScale;
  }
  
  // function used for updating xAxis var upon click on axis label
  function renderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    xAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenYAxis, circlesGroup) {
    var label;
  
    if (chosenYAxis === "rotation_period") {
      label = "Rotation Period:";
    }
    if (chosenYAxis === "orbital_period"){
        label = "Orbital Period: ";
    }
    if (chosenYAxis === "diameter"){
        label = "Diameter: ";
    }
    if (chosenYAxis === "surface_water"){
        label = "Surface Water: "
    }
    else {
      label = "Population: ";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.name}<br>${label} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

// Use d3 to pull in data
d3.csv('../static/data/planets.csv').then(function(planetData) {
    var names = planetData.map(data => data.name);
    var climate = planetData.map(data => data.climate);
    var gravity = planetData.map(data => data.gravity);
    var terrain = planetData.map(data => data.terrain);
    console.log("names", names);
    console.log("climate", climate);
    console.log("gravity", gravity);
    console.log("terrain", terrain);
  
    // Cast each hours value in planetData as a number using the unary + operator
    planetData.forEach(function(data) {
      data.rotation_period = +data.rotation_period;       
      data.orbital_period = +data.orbital_period;
      data.diameter = +data.diameter;
      data.surface_water = +data.surface_water;
      data.population = +data.population;
      console.log("rotation period", data.rotation_period);
      console.log("orbital period", data.orbital_period);
      console.log("diameter", data.diameter);
      console.log("surface water", data.surface_water);
      console.log("population", data.population)
    });

      // xLinearScale function above csv import
  var xLinearScale = xScale(hairData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(hairData, d => d.num_hits)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(hairData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.num_hits))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var hairLengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "hair_length") // value to grab for event listener
    .classed("active", true)
    .text("Hair Metal Ban Hair Length (inches)");

  var albumsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "num_albums") // value to grab for event listener
    .classed("inactive", true)
    .text("# of Albums Released");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Number of Billboard 500 Hits");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(hairData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "num_albums") {
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          hairLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    })

    // Use d3 to select the table body to append the data to the table
    d3.select("tbody")
        .selectAll("tr")
        .data(planetData)
        .enter()
        .append("tr")
        .html(function(d) {
            return `<td>${d.name}</td><td>${d.gravity}</td><td>${d.climate}</td><td>${d.terrain}</td>`;
        });
  }).catch(function(error) {        //catches errors
    console.log(error);
  });
