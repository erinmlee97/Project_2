function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
  var svgWidth = window.innerWidth*0.8;
  var svgHeight = svgWidth*0.65;
  
  // circle and text size are changed based on window resizing
  var circleR = svgWidth*0.02; 
  var textsize = parseInt(svgWidth*0.009);
  
  var margin = {
  top: 40,
  right: 40,
  bottom: 100,
  left: 100
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  // Create an SVG wrapper, append an SVG group that will hold chart and shift by margins
  var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
  
  // Append an SVG group
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  // Initial parameters
  var chosenXAxis = "population";
  
  var chosenYAxis ="rotation_period";
  
  // function used for updating x-scale var upon click on axis label
  function xScale(planetsData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(planetsData, d => d[chosenXAxis]) ,
      d3.max(planetsData, d => d[chosenXAxis])])
    .range([0, width]);
  
  return xLinearScale;
  }
  
  // function used for updating y-scale var upon click on axis label
  function yScale(planetsData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(planetsData, d => d[chosenYAxis]),
      d3.max(planetsData, d => d[chosenYAxis]) ])
    .range([height, 0]);
  
  return yLinearScale;
  }
  
  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  
  return xAxis;
  }
  
  // function used for updating yAxis var upon click on axis label
  function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  
  return yAxis;
  }
  
  // function used for updating circles group and text group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, newYScale,chosenXAxis,chosenYAxis) {
  
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  
  return circlesGroup;
  }
  
  function renderText(textGroup, newXScale, newYScale,chosenXAxis,chosenYAxis) {
  
  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
    
  
  return textGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup) {
  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([90, 90])
    .html(function(d) {
      if (chosenXAxis === "population"){
        return (`${d.name}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}%`); 
  
      }    
      else {
        return (`${d.name}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}%`); 
      }
      });
      
     
  circlesGroup.call(toolTip);
  
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d,this);
    })
    .on("mouseout", function(d, index) {
      toolTip.hide(d);
    });
  return circlesGroup;
  }
  
  // Retrieve data from the CSV file and execute everything below
  d3.csv("../static/data/clean_planets.csv").then(function(planetsData) {
  // parse data
  planetsData.forEach(function(data) {
  
    data.orbital_period = +data.orbital_period;
    data.diameter = +data.diameter;
  
    data.rotation_period = +data.rotation_period;
    data.population = +data.population;
  
  });
  console.log(planetsData);
  
   
  // xLinearScale function above csv import
  var xLinearScale = xScale(planetsData, chosenXAxis);
  
  // Create y scale function
  var yLinearScale = yScale(planetsData, chosenYAxis);
  
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
  
  // append initial circles and text
  var circlesGroup = chartGroup.selectAll("circle")
    .data(planetsData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", circleR)
    .attr("fill", "lightblue");
  
  var textGroup = chartGroup.selectAll("text")
    .exit() //because enter() before, clear cache
    .data(planetsData)
    .enter()
    .append("text")
    .text(d => d.name)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("font-size", textsize+"px")
    .attr("text-anchor", "middle")
    .attr("class","planetText");
  
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
  
  // Create group for x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var populationLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("class","axis-text-x")
    .attr("value", "population") // value to grab for event listener
    .classed("active", true)
    .text("Population");
  
  var diameterLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("class","axis-text-x")
    .attr("value", "diameter") // value to grab for event listener
    .classed("inactive", true)
    .text("Diameter");
  
  // Create group for y-axis labels
  
  var ylabelsGroup = chartGroup.append("g");
  
  var rotationLabel = ylabelsGroup.append("text")
    .attr("transform", `translate(-60,${height / 2})rotate(-90)`)
    .attr("dy", "1em")
    .attr("class","axis-text-y")
    .classed("axis-text", true)
    .attr("value", "rotation_period") // value to grab for event listener
    .classed("active", true)
    .text("Rotation Period");
  
  var orbitalLabel = ylabelsGroup.append("text")
    .attr("transform", `translate(-80,${height / 2})rotate(-90)`)
    .attr("dy", "1em")
    .attr("class","axis-text-y")
    .attr("value", "orbital_period") // value to grab for event listener
    .classed("inactive", true)
    .text("Orbital Period");
  
  // x axis labels event listener
  labelsGroup.selectAll(".axis-text-x")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
  
        // replaces chosenXAxis with value
        chosenXAxis = value;
  
        console.log(chosenXAxis)
  
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(planetsData, chosenXAxis);
        // updates y scale for new data
        yLinearScale = yScale(planetsData, chosenYAxis);
  
  
        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
  
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);
  
        textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);
  
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);
  
        // changes classes to change bold text
        if (chosenXAxis === "population") {
          populationLabel
            .classed("active", true)
            .classed("inactive", false);
          diameterLabel
            .classed("active", false)
            .classed("inactive", true);
            
        }
        else {
          populationLabel
            .classed("active", false)
            .classed("inactive", true);
          diameterLabel
            .classed("active", true)
            .classed("inactive", false);
        }
    }
    })

  // y axis labels event listener
  ylabelsGroup.selectAll(".axis-text-y")
    .on("click", function() {
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
  
     // replaces chosenYAxis with value
      chosenYAxis = value;
  
      console.log(chosenYAxis)
  
     // functions here found above csv import
     // updates x scale for new data
     xLinearScale = xScale(planetsData, chosenXAxis);
     // updates y scale for new data
     yLinearScale = yScale(planetsData, chosenYAxis);
     // updates Y axis with transition
     yAxis = renderYAxes(yLinearScale, yAxis);
  
     // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);
  
     textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);
  
     // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);
  
       
     if (chosenYAxis === "rotation_period") {
      rotationLabel
        .classed("active", true)
        .classed("inactive", false);
      orbitalLabel
        .classed("active", false)
        .classed("inactive", true);
      }
      }else {
      rotationLabel
        .classed("active", false)
        .classed("inactive", true);
      orbitalLabel
        .classed("active", true)
        .classed("inactive", false);
       }
    });
})
}
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);

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

  var orbitalBar = '../static/images/orbital.png'
  var rotationBar = '../static/images/rotation.png'
  var popBar= '../static/images/population.png'
  var diaBar= '../static/images/diameter.png'

  var orbitalButton = d3.select("#orbital");
  var rotationButton = d3.select("#rotation");
  var popButton = d3.select("#population");
  var diaButton = d3.select("#diameter");

  orbitalButton.on("click", function() {
    d3.select(".bar").html(`<img src=${orbitalBar} alt='...'>`);
  });

  rotationButton.on("click", function() {
    d3.select(".bar").html(`<img src=${rotationBar} alt='...'>`);
  });

  popButton.on("click", function() {
    d3.select(".bar").html(`<img src=${popBar} alt='...'>`);
  });

  diaButton.on("click", function() {
    d3.select(".bar").html(`<img src=${diaBar} alt='...'>`);
  });


  

