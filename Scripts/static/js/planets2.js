function makeResponsive() {

    // If SVG Area is not Empty When Browser Loads, Remove & Replace with a Resized Version of Chart
    var svgArea = d3.select("body").select("svg");
  
    // Clear SVG is Not Empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
    
    // Setup Chart Parameters/Dimensions
    var svgWidth = 980;
    var svgHeight = 600;
  
    // Set SVG Margins
    var margin = {
      top: 20,
      right: 40,
      bottom: 90,
      left: 100
    };
  
    // Define Dimensions of the Chart Area
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
  
    // Create an SVG element
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
  
    // Append group element & set margins
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Initial Params
    var chosenXAxis = "orbital_period";
    var chosenYAxis = "rotation_period";
  
    // Updating x scale on click
    function xScale(planetData, chosenXAxis) {
      // Create x scale function
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(planetData, d => d[chosenXAxis]) * 0.8,
          d3.max(planetData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
      return xLinearScale;
    }
  
    // Updating y scale on click
    function yScale(planetData, chosenYAxis) {
      // Create y scale function
      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(planetData, d => d[chosenYAxis]) * 0.8,
          d3.max(planetData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);
      return yLinearScale;
    }
  
    // Updating xAxis on click
    function renderXAxes(newXScale, xAxis) {
      var bottomAxis = d3.axisBottom(newXScale);
      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
      return xAxis;
    }
  
    // Updating yAxis on click
    function renderYAxes(newYScale, yAxis) {
      var leftAxis = d3.axisLeft(newYScale);
      yAxis.transition()
        .duration(1000)
        .call(leftAxis);
      return yAxis;
    }
  
    // Updatie circles with transition
    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
      return circlesGroup;
    }
  
    // Update textGroup with transition
    function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
      textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]))
        .attr("text-anchor", "middle");
  
      return textGroup;
    }
  
    // Update circles with tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
  
      if (chosenXAxis === "orbital_period") {
        var xLabel = "Orbital Period";
      }
      else {
        var xLabel = "Diameter";
      }
      if (chosenYAxis === "rotation_period") {
        var yLabel = "Rotation Period";
      }
      else {
        var yLabel = "Population";
      }
  
      // Initialize tool tip
      var toolTip = d3.tip()
        .attr("class", "tooltip d3-tip")
        .offset([90, 90])
        .html(function(d) {
          return (`<strong>${d.name}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
        });
      // Create Circles Tooltip in the Chart
      circlesGroup.call(toolTip);
      // Create Event Listeners to Display and Hide the Circles Tooltip
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout Event
        .on("mouseout", function(data) {
          toolTip.hide(data);
        });
      // Create Text Tooltip in the Chart
      textGroup.call(toolTip);
      // Create Event Listeners to Display and Hide the Text Tooltip
      textGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout Event
        .on("mouseout", function(data) {
          toolTip.hide(data);
        });
      return circlesGroup;
    }
  
    // Import Data from the data.csv file
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
          data.population = +data.population;
          console.log("rotation period", data.rotation_period);
          console.log("orbital period", data.orbital_period);
          console.log("diameter", data.diameter);
          console.log("population", data.population)
        });
  
      // Create xLinearScale & yLinearScale function
      var xLinearScale = xScale(planetData, chosenXAxis);
      var yLinearScale = yScale(planetData, chosenYAxis);
  
      // Create inital axis function
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // Append x axis
      var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      // Append y axis
      var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
  
      // Create & append initial circles
      var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(planetData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("class", "stateCircle")
        .attr("r", function(d) { return d == null ? 0 : 3; })
        .attr("opacity", ".75");
  
      // Append text
      var textGroup = chartGroup.selectAll(".stateText")
        .data(planetData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]*.98))
        .text(d => (d.abbr))
        .attr("class", "stateText")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");
  
      // Create group for 3 xAxis labels
      var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
      // Append x axis
      var orbitalLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "orbital_period") 
        .classed("active", true)
        .text("Orbital Period");
  
      var diameterLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "diameter") 
        .classed("inactive", true)
        .text("Diameter");
  
      // Create Group for 3 y axis labels
      var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-25, ${height / 2})`);
      // Append y axis
      var rotationLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", 0)
        .attr("value", "rotation_period")
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Rotation Period");
  
      var populationLabel = yLabelsGroup.append("text") 
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", 0)
        .attr("value", "population")
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Population");
  
      // updateToolTip function
      var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
  
      // x axis labels event listener
      xLabelsGroup.selectAll("text")
        .on("click", function() {
          // Get value of selection
          var value = d3.select(this).attr("value");
          if (value !== chosenXAxis) {
            // Replaces chosenXAxis with value
            chosenXAxis = value;
            // Updates xScale for New Data
            xLinearScale = xScale(planetData, chosenXAxis);
            // Updates xAxis with Transition
            xAxis = renderXAxes(xLinearScale, xAxis);
            // Updates Circles with New Values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // Updates Text with New Values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
            // Updates Tooltips with New Information
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
            // Changes Classes to Change Bold Text
            if (chosenXAxis === "orbital_period") {
              orbitalLabel
                .classed("active", true)
                .classed("inactive", false);
              diameterLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
              orbitalLabel
                .classed("active", false)
                .classed("inactive", true);
              diameterLabel
                .classed("active", false)
                .classed("inactive", true);
            }
          }
        });
      
        // y axis labels event listener
      yLabelsGroup.selectAll("text")
        .on("click", function() {
          // Get Value of Selection
          var value = d3.select(this).attr("value");
          if (value !== chosenYAxis) {
            // Replaces chosenYAxis with Value
            chosenYAxis = value;
            // Updates yScale for New Data
            yLinearScale = yScale(planetData, chosenYAxis);
            // Updates yAxis with Transition
            yAxis = renderYAxes(yLinearScale, yAxis);
            // Updates Circles with New Values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // Updates Text with New Values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
            // Updates Tooltips with New Information
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
            // Changes Classes to Change Bold Text
            if (chosenYAxis === "rotation_period") {
              rotationLabel
                .classed("active", true)
                .classed("inactive", false);
              populationLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
              rotationLabel
                .classed("active", false)
                .classed("inactive", true);
              populationLabel
                .classed("active", false)
                .classed("inactive", true);
            }
          }
        });
    });
  }
  // Call makeResponsive function when browser is loaded
  makeResponsive();
  
  // When browser is resized makeResponsive function is called
  d3.select(window).on("resize", makeResponsive);