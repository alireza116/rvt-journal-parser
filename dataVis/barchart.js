function barchart(chartid) {
  var margin = { top: 20, right: 20, bottom: 150, left: 40 },
    width = $(chartid).width() - margin.left - margin.right,
    height = $(chartid).height() - margin.top - margin.bottom;

  // set the ranges
  var x = d3
    .scaleBand()
    .range([0, width])
    .padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin

  this.drawChart = function(data) {
    d3.select(chartid)
      .select("svg")
      .remove();
    var svg = d3
      .select(chartid)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
      d.count = +d.count;
    });

    // Scale the range of the data in the domains
    x.domain(
      data.map(function(d) {
        return d.detail;
      })
    );
    y.domain([
      0,
      d3.max(data, function(d) {
        return d.count;
      })
    ]);

    // append the rectangles for the bar chart
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.detail);
      })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {
        return y(d.count);
      })
      .attr("height", function(d) {
        return height - y(d.count);
      });

    // add the x Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));
  };
}
