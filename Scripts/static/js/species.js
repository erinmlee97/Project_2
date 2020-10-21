// Use d3 to pull in data
d3.csv('../data/clean_species.csv').then(function(speciesData) {
    var names = speciesData.map(data => data.name);
    var lifespan = speciesData.map(data => data.average_lifespan);
    var height = speciesData.map(data => data.average_height);
    var classification = speciesData.map(data => data.classification);
    var language = speciesData.map(data => data.language);
    console.log("names", names);
    console.log("climate", lifespan);
    console.log("gravity", height);
    console.log("terrain", classification);
    console.log("terrain", language);

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
//     // Add event listener to the button, with a function when clicked
// $button.addEventListener("click", handleSearchButtonClick);

// // renderTable outputs data into tbody
// function renderTable() {
//   $tbody.innerHTML = "";
//   for (var i = 0; i < tableData.length; i++) {
    
//     var data = tableData[i];
//     var inputs = Object.keys(data);
   
//     var row = $tbody.insertRow(i);
//     for (var j = 0; j < inputs.length; j++) {
//       var input = inputs[j];
//       var $cell = row.insertCell(j);
//       $cell.innerText = data[input];
//     }
//   }
// }

// function handleSearchButtonClick(event) {
//   // prevent page from refreshing
//   event.preventDefault();

//   var DateFilter = $date.value.trim();
//   if (DateFilter != "") {
//     tableData = data.filter(function (data) {
//       var DateField = data.datetime;
//       return DateField === DateFilter;
//     });
// };
// renderTable();
//   }
// function resetData() {
//   tableData = data;
//   $date.value = "";

//   renderTable();
// }

// // Render the table on page load
// renderTable();
//   });
