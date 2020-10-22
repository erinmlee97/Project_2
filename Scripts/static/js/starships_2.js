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
  var chosenXAxis = "passengers";
  
  var chosenYAxis ="hyperdrive_rating";
  
  // function used for updating x-scale var upon click on axis label
  function xScale(starshipsData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(starshipsData, d => d[chosenXAxis]) ,
      d3.max(starshipsData, d => d[chosenXAxis])])
    .range([0, width]);
  
  return xLinearScale;
  
  }
  
  // function used for updating y-scale var upon click on axis label
  function yScale(starshipsData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(starshipsData, d => d[chosenYAxis]),
      d3.max(starshipsData, d => d[chosenYAxis]) ])
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
  
  // function used for updating circles and text group
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
      if (chosenXAxis === "passengers"){
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
  d3.json("/data/starship_2").then(function(starshipsData) {
  // parse data
  starshipsData.forEach(function(data) {
  
    data.passengers = +data.passengers;
    data.hyperdrive_rating = +data.hyperdrive_rating;
  
    data.MGLT = +data.MGLT;
    data.max_atmosphering_speed = +data.max_atmosphering_speed;
  
  });
  console.log(starshipsData);
  
   
  // xLinearScale function above csv import
  var xLinearScale = xScale(starshipsData, chosenXAxis);
  
  // Create y scale function
  var yLinearScale = yScale(starshipsData, chosenYAxis);
  
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
    .data(starshipsData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", circleR)
    .attr("fill", "lightgreen");
  
  var textGroup = chartGroup.selectAll("text")
    .exit()
    .data(starshipsData)
    .enter()
    .append("text")
    .text(d => d.name)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("font-size", textsize+"px")
    .attr("text-anchor", "middle")
    .attr("class","starshipText");
  
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);
  
  
  // Create group for x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var passengersLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("class","axis-text-x")
    .attr("value", "passengers")
    .classed("active", true)
    .text("Number of Passengers");
  
  var MGLTLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("class","axis-text-x")
    .attr("value", "MGLT") 
    .classed("inactive", true)
    .text("Megalights (MGLT)");
  
  // Create group for y-axis labels
  
  var ylabelsGroup = chartGroup.append("g");
  
  var hyperdrive_ratingLabel = ylabelsGroup.append("text")
    .attr("transform", `translate(-60,${height / 2})rotate(-90)`)
    .attr("dy", "1em")
    .attr("class","axis-text-y")
    .classed("axis-text", true)
    .attr("value", "hyperdrive_rating") 
    .classed("active", true)
    .text("Hyperdrive Rating (%)");
  
  var max_atmosphering_speedLabel = ylabelsGroup.append("text")
    .attr("transform", `translate(-80,${height / 2})rotate(-90)`)
    .attr("dy", "1em")
    .attr("class","axis-text-y")
    .attr("value", "max_atmosphering_speed") 
    .classed("inactive", true)
    .text("Max Atmosphering Speed");
  
  // x axis labels event listener
  labelsGroup.selectAll(".axis-text-x")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
  
        // replaces chosenXAxis with value
        chosenXAxis = value;
  
        console.log(chosenXAxis)
  
        // updates x scale for new data
        xLinearScale = xScale(starshipsData, chosenXAxis);
        // updates y scale for new data
        yLinearScale = yScale(starshipsData, chosenYAxis);
  
  
        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
  
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);
  
        textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);
  
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);
  
        // changes classes to change bold text
        if (chosenXAxis === "passengers") {
          passengersLabel
            .classed("active", true)
            .classed("inactive", false);
          MGLTLabel
            .classed("active", false)
            .classed("inactive", true);
            
        }
        else {
          passengersLabel
            .classed("active", false)
            .classed("inactive", true);
          MGLTLabel
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
  
     // updates x scale for new data
     xLinearScale = xScale(starshipsData, chosenXAxis);
     // updates y scale for new data
     yLinearScale = yScale(starshipsData, chosenYAxis);
     // updates Y axis with transition
     yAxis = renderYAxes(yLinearScale, yAxis);
  
     // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);
  
     textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);
  
     // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);
  
       
     if (chosenYAxis === "hyperdrive_rating") {
      hyperdrive_ratingLabel
        .classed("active", true)
        .classed("inactive", false);
      max_atmosphering_speedLabel
        .classed("active", false)
        .classed("inactive", true);
  
      }
  
      } else {
      hyperdrive_ratingLabel
        .classed("active", false)
        .classed("inactive", true);
      max_atmosphering_speedLabel
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
d3.json('/data/starship').then(function(starshipData) {
    var names = starshipData.map(data => data.name);
    var models = starshipData.map(data => data.model);
    var manufacturers = starshipData.map(data => data.manufacturer);
    var costs = starshipData.map(data => data.cost_in_credits);

  
    // Cast each hours value in starshipData as a number using the unary + operator
    starshipData.forEach(function(data) {
      data.max_atmosphering_speed = +data.max_atmosphering_speed;       
      data.hyperdrive_rating = +data.hyperdrive_rating;
      data.passengers = +data.passengers;
      data.MGLT = +data.MGLT;
    });

    // Use d3 to select the table body to append the data to the table
    d3.select("tbody")
        .selectAll("tr")
        .data(starshipData)
        .enter()
        .append("tr")
        .html(function(d) {
            return `<td>${d.name}</td><td>${d.model}</td><td>${d.manufacturer}</td><td>${d.cost_in_credits}</td>`;
        });
  }).catch(function(error) {        //catches errors
    console.log(error);
  });

  var hyperdriveBar = '../static/images/hyperdrive.png'
  var maxBar = '../static/images/max.png'
  var mgltBar= '../static/images/mglt.png'
  var passengersBar= '../static/images/passengers.png'
// 
  var hyperdriveButton = d3.select("#hyperdrive");
  var maxButton = d3.select("#max");
  var mgltButton = d3.select("#mglt");
  var passengersButton = d3.select("#passengers");

  hyperdriveButton.on("click", function() {
    d3.select(".bar").html(`<img src=${hyperdriveBar} alt='...'>`);
  });

  maxButton.on("click", function() {
    d3.select(".bar").html(`<img src=${maxBar} alt='...'>`);
  });

  mgltButton.on("click", function() {
    d3.select(".bar").html(`<img src=${mgltBar} alt='...'>`);
  });

  passengersButton.on("click", function() {
    d3.select(".bar").html(`<img src=${passengersBar} alt='...'>`);
  });
