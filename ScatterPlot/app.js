async function draw() {
  // Get Data
  const dataset = await d3.json("./data.json");

  //dimensions and variables
  const dimensions = {
    width: 800,
    height: 800,
    margin: {
      top: 70,
      bottom: 70,
      left: 70,
      right: 70,
    },
    dotSize: 5,
  };
  const containerWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  const containerHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // Accessor functions to return the properties
  const xAccessor = (d) => d.currently.humidity;
  const yAccessor = (d) => d.currently.apparentTemperature;

  // Drawing Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const ctr = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    );

  // Returns scaling functions under the hood
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .rangeRound([0, containerWidth]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .rangeRound([containerHeight, 0]) // Range Round rounds the scaled values
    .nice(); //nice rounds the domain values to the next whole number

  // Draw Circles
  ctr
    .selectAll("circle")
    .data(dataset)
    .join(`circle`)
    // both xScale and yScale are functions that are given the actual value and map that to a scaled value
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", dimensions.dotSize)
    .attr("fill", "red")
    .attr("data-temp", yAccessor);

  // Axes
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(5)
    .tickFormat((d) => d * 100 + " %");
  const yAxis = d3.axisLeft(yScale);

  const xAxisGroup = ctr
    .append("g")
    .call(xAxis)
    // for svg elements I must use translate, however if I'd be using style, I could use translateY
    .attr("transform", `translate(0, ${containerHeight})`)
    .classed("axis", true);

  xAxisGroup
    .append("text")
    .attr("x", containerWidth / 2)
    .attr("y", dimensions.margin.bottom - 20)
    .attr("fill", "black")
    .text("Humidity");

  const yAxisGroup = ctr.append("g").call(yAxis).classed("axis", true);

  yAxisGroup
    .append("text")
    .attr("x", -containerHeight / 2)
    .attr("y", -dimensions.margin.left + 25)
    .style("transform", `rotate(270deg)`)
    .attr("fill", "black")
    .text("Temperature °F")
    .style("text-anchor", "middle");
}

draw();
