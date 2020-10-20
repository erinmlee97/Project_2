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
var circleR = svgWidth*0.012; 
var textsize = parseInt(svgWidth*0.009);

var margin = {
top: 20,
right: 40,
bottom: 100,
left: 80
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

var chosenYAxis ="crew";

// function used for updating x-scale var upon click on axis label
function xScale(vehicleData, chosenXAxis) {
// create scales
var xLinearScale = d3.scaleLinear()
  .domain([d3.min(vehicleData, d => d[chosenXAxis]) * 0.8,
    d3.max(vehicleData, d => d[chosenXAxis]) * 1.2])
  .range([0, width]);

return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(vehicleData, chosenYAxis) {
// create scales
var yLinearScale = d3.scaleLinear()
  .domain([d3.min(vehicleData, d => d[chosenYAxis]) * 0.8,
    d3.max(vehicleData, d => d[chosenYAxis]) * 1.2])
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
  .offset([80, -60])
  .html(function(d) {
    if (chosenXAxis === "cost_in_credits"){
      return (`${d.name},${d.vehicle_class}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}%`); 

    }    
    else {
      return (`${d.name},${d.vehicle_class}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}%`); 
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
d3.csv("../data/vehicles.csv").then(function(vehicleData) {
// parse data
vehicleData.forEach(function(data) {

  data.passengers = +data.passengers;
  data.crew = +data.crew;

  data.cost_in_credits = +cost_in_credits;
  data.max_atmosphering_speed = +data.max_atmosphering_speed;

  data.vehicle_class = data.vehicle_class;
});
console.log(vehicleData);

 
// xLinearScale function above csv import
var xLinearScale = xScale(vehicleData, chosenXAxis);

// Create y scale function
var yLinearScale = yScale(vehicleData, chosenYAxis);

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
  .data(vehicleData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", circleR)
  .attr("fill", "green");

var textGroup = chartGroup.selectAll("text")
  .exit() //because enter() before, clear cache
  .data(vehicleData)
  .enter()
  .append("text")
  .text(d => d.vehicle_class)
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]))
  .attr("font-size", textsize+"px")
  .attr("text-anchor", "middle")
  .attr("class","stateText");

circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);


// Create group for x-axis labels
var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

var passengersLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("class","axis-text-x")
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");

var creditsLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("class","axis-text-x")
  .attr("value", "age") // value to grab for event listener
  .classed("inactive", true)
  .text("Age (Median)");

// Create group for y-axis labels

var ylabelsGroup = chartGroup.append("g");

var crewLabel = ylabelsGroup.append("text")
  .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
  .attr("dy", "1em")
  .attr("class","axis-text-y")
  .classed("axis-text", true)
  .attr("value", "healthcare") // value to grab for event listener
  .classed("active", true)
  .text("Lack of Healthcare (%)");

var atmosphereLabel = ylabelsGroup.append("text")
  .attr("transform", `translate(-60,${height / 2})rotate(-90)`)
  .attr("dy", "1em")
  .attr("class","axis-text-y")
  .attr("value", "smokes") // value to grab for event listener
  .classed("inactive", true)
  .text("Smokes (%)");

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
      xLinearScale = xScale(vehicleData, chosenXAxis);
      // updates y scale for new data
      yLinearScale = yScale(vehicleData, chosenYAxis);


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
        creditsLabel
          .classed("active", false)
          .classed("inactive", true);
          
      }
        
      }else {
        passengersLabel
          .classed("active", false)
          .classed("inactive", true);
          creditsLabel
          .classed("active", true)
          .classed("inactive", false);
      }

    })
  });


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
   xLinearScale = xScale(vehicleData, chosenXAxis);
   // updates y scale for new data
   yLinearScale = yScale(vehicleData, chosenYAxis);
   // updates Y axis with transition
   yAxis = renderYAxes(yLinearScale, yAxis);

   // updates circles with new x values
   circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

   textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

   // updates tooltips with new info
   circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

     
   if (chosenYAxis === "crew") {
    crewLabel
      .classed("active", true)
      .classed("inactive", false);
    atmosphereLabel
      .classed("active", false)
      .classed("inactive", true);

    }

    } else {
    crewLabel
      .classed("active", false)
      .classed("inactive", true);
    atmosphereLabel
      .classed("active", true)
      .classed("inactive", false);
     }
  })
});
});

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);