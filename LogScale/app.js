async function draw() {
  // Data
  const dataset = await d3.json("data.json");

  const sizeAccessor = (d) => d.size;
  const nameAccessor = (d) => d.name;

  // Dimensions
  let dimensions = {
    width: 200,
    height: 500,
    margin: 50,
  };

  // Draw Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // Scales

  const yScale = d3
    .scaleLog()
    .domain(d3.extent(dataset, sizeAccessor))
    .range([dimensions.height - dimensions.margin, dimensions.margin]);

  // Draw Circles
  const circlesGroup = svg
    .append("g")
    .style("font-size", "15px")
    .style("dominant-baseline", "middle");

  circlesGroup
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("cx", dimensions.margin)
    .attr("cy", (d) => yScale(sizeAccessor(d)))
    .attr("r", 6);

  circlesGroup
    .selectAll("text")
    .data(dataset)
    .join("text")
    .attr("y", (d) => yScale(sizeAccessor(d)))
    .attr("x", dimensions.margin + 15)
    .text(nameAccessor);

  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .call(yAxis)
    .attr("transform", `translate(${dimensions.margin}, 0)`);
}

draw();
