function commandsList(data) {
  var commands = {};
  data.forEach(function(d) {
    if (!(d["commandDesc"] in commands)) {
      commands[d["commandDesc"]] = 1;
    } else {
      commands[d["commandDesc"]]++;
    }
  });

  var commandCounts = Object.keys(commands).map(function(key) {
    return [key, commands[key]];
  });

  commandCounts.sort(function(a, b) {
    return b[1] - a[1];
  });

  var boxColorScale = d3
    .scaleLog()
    .range(["grey", "#2166ac"])
    .domain(
      d3.extent(
        commandCounts.map(function(d) {
          return d[1];
        })
      )
    );

  var boxes = d3
    .select("#lbottom")
    .selectAll("div")
    .data(commandCounts)
    .enter()
    .append("div")
    .attr("class", "commandEntry")
    .style("background-color", function(d) {
      return boxColorScale(d[1]);
    })
    .style("color", "white")
    .attr("selected", "false");

  boxes.append("p").text(function(d) {
    return d[0];
  });

  boxes.on("click", function(d) {
    var selected = d3.select(this).attr("selected");
    if (selected === "false") {
      d3.select(this).attr("selected", "true");
      d3.select(this).attr("class", "commandEntry selected");
    } else {
      d3.select(this).attr("selected", "false");
      d3.select(this).attr("class", "commandEntry");
    }

    selected = d3.select(this).attr("selected");

    var thisText = d3.select(this).text();
    console.log(thisText);
    var filterData = data.filter(function(d) {
      return d["commandDesc"] === thisText || d["isWarning"];
    });
    console.log(filterData);
    timechart = new timeChart("#top", filterData);
    var barData = {};
    filterData.forEach(function(d) {
      if (d["details"] in barData) {
        barData[d["details"]]++;
      } else {
        barData[d["details"]] = 1;
      }
    });
    barData = Object.keys(barData).map(function(d) {
      return { count: barData[d], detail: d };
    });
    b.drawChart(barData);
  });
}
