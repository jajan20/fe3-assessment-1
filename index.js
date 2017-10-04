// ORIGINAL SOURCE CODE Mike Bostock https://bl.ocks.org/mbostock/3884955

// Variable that sets properties for the SVG element.
var svg = d3.select("svg"),
    
    margin = {top: 10, right: 80, bottom: 30, left: 50},        // Sets margin (space around the graph)
    width = svg.attr("width") - margin.left - margin.right,     // 
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Variable g is created with contains svg with g attached. Transform is used to indicate a transformation
                                                                                                // for an element and it's children. Translate is used for the Y axis (if nothing is specified, assume y = 0)

var parseTime = d3.timeParse("%Y%m%d");         // A variable that sets the format on how dates should be rendered.

var x = d3.scaleTime().range([0, width]),       // Start at 0 and make it as wide as the range of data it contains.
    y = d3.scaleLinear().range([height, 0]),    // Height is set to the input of the data negative & positive.
    z = d3.scaleOrdinal(d3.schemeCategory10);   // Gives the Z variable a colorscheme, category 10.

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })           // This tells me that the information I recieve from data should be used for the x axis.
    .y(function(d) { return y(d.temperature); });   // This tells me that the information I recieve from temperature should be used for the y axis.

d3.csv("data.csv", type, function(error, data) {          // Connect to data.csv
  if (error) throw error;                                 // if you can't, give an error.

  var cities = data.columns.slice(1).map(function(id) {   // Variable cities is created which returns the data from the input file.
    return {
      id: id,
      values: data.map(function(d) {
        return {date: d.date, temperature: d[id]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));    // Shows a portion of the data on x axis (range = range of data, domain is what part of that data is showed on screen).

  y.domain([                                                    // Shows a portion of the data on y axis (range = range of data, domain is what part of that data is showed on screen).
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);

  // z.domain(cities.map(function(c) { return c.id; }));         //This was used in the original source code, not really sure why I would need this.

  
  // Make a group for the x axis and give this a class with different properties. 
  g.append("g")          //
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Make a group for the y axis and give this a class with different properties.
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")             // Add temperature to the group.
      .attr("x", 135)              // Distance on X axis
      .attr("y", 10)              // Distance on Y axis
      .attr("fill", "#FF0303")    // Color of the word temperature.
      .text("Temperature, °C");   // Using a different temperature indicator.

  var temp = g.selectAll(".temp") // Temp = select every group with the "class" .temp.
    .data(cities)                 // Temp.data(cities)
    .enter().append("g")          // Temp.enter() and add this to the group.
    .attr("class", "temp");       // Give this group a class named temp.

  temp.append("path")             // Add path to
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });
});

// function is created for date parsing, for each row of data in the column render a "input" point.
function type(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}
