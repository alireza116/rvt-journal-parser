function timeChart(chartID, data) {
  d3.select(chartID)
    .select("svg")
    .remove();
  var width = $(chartID).width();
  var height = $(chartID).height();

  var svg = d3
    .select(chartID)
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  var margin = { top: 20, right: 20, bottom: 110, left: 40 };
  var margin2 = { top: 200, right: 20, bottom: 30, left: 40 };
  var width1 = +svg.attr("width") - margin.left - margin.right;
  var height1 = +svg.attr("height") - margin.top - margin.bottom;
  var height2 = +svg.attr("height") - margin2.top - margin2.bottom;

  var parseDate = d3.timeParse("%d-%b-%Y %H:%M:%S.%L");

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width1)
    .attr("height", height1);

  var x = d3.scaleTime().range([0, width1]),
    x2 = d3.scaleTime().range([0, width1]),
    y = d3.scaleLinear().range([height1, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

  data.forEach(function(d) {
    d.date = parseDate(d.time);
  });
  console.log(data);
  x.domain(
    d3.extent(data, function(d) {
      return d.date;
    })
  );

  x2.domain(x.domain());

  var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2);

  var brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width1, height2]
    ])
    .on("brush end", brushed);

  var zoom = d3
    .zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([
      [0, 0],
      [width1, height1]
    ])
    .extent([
      [0, 0],
      [width1, height1]
    ])
    .on("zoom", zoomed);
  svg
    .append("rect")
    .attr("class", "zoom")
    .attr("width", width1)
    .attr("height", height1)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

  var focus = svg
    .append("g")
    .attr("class", "focus")
    .attr("width", width1)
    .attr("height", height1)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  focus
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "events")
    .attr("cx", function(d) {
      return x(d.date);
    })
    .attr("cy", height1 / 2)
    .attr("r", function(d) {
      if (d["isWarning"] == true) {
        return 5;
      } else {
        return 3;
      }
    })
    .attr("fill", function(d) {
      //   console.log(d["isWarning"]);
      if (d["isWarning"] === true) {
        return "red";
      } else {
        return "blue";
      }
    })
    .on("click", function(d) {
      console.log(d);
      var eventData = Object.keys(d).map(function(key) {
        return [key, d[key]];
      });
      d3.selectAll("ul").remove();
      d3.select("#bright")
        .append("ul")
        .selectAll("li")
        .data(eventData)
        .enter()
        .append("li")
        .style("color", "black")
        .style("font-size", "18px")
        .text(function(d) {
          return d[0] + " : " + d[1];
        });
    });

  focus
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height1 + ")")
    .call(xAxis);

  var context = svg
    .append("g")
    .attr("class", "context")
    .attr("width", width1)
    .attr("height", height2)
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  context
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "events")
    .attr("cx", function(d) {
      return x(d.date);
    })
    .attr("cy", height2 / 2)
    .attr("r", function(d) {
      if (d["isWarning"] == true) {
        return 3;
      } else {
        return 1;
      }
    })
    .attr("fill", function(d) {
      //   console.log(d["isWarning"]);
      if (d["isWarning"] === true) {
        return "red";
      } else {
        return "blue";
      }
    });

  context
    .append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range());

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.selectAll("circle").attr("cx", function(d) {
      return x(d.date);
    });
    focus.select(".axis--x").call(xAxis);
    svg
      .select(".zoom")
      .call(
        zoom.transform,
        d3.zoomIdentity.scale(width1 / (s[1] - s[0])).translate(-s[0], 0)
      );
  }
  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    focus.selectAll("circle").attr("cx", function(d) {
      return x(d.date);
    });
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
  }

  function type(d) {
    // d.date = parseDate(d.date);
    // d.price = +d.price;
    // return d;
  }
  console.log(parseDate("07-Feb-2020 09:42:20.786"));
}
