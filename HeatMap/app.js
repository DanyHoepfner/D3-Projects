async function draw(el, scale) {
  // Data
  const dataset = await d3.json("data.json");

  dataset.sort((a, b) => a - b);

  // Dimensions
  let dimensions = {
    width: 600,
    height: 150,
  };
  const box = 30;

  // Draw Image
  const svg = d3
    .select(el)
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  let colorScale;

  // 2. Scales
  /* The linear scale maps continuous data to continuous data */
  if (scale === "linear") {
    colorScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset))
      .range(["white", "red"]);
    /* with the quantize scaling, we map a continuous dataset to dicrete data
     here we map our 100 incomes to just three colors */
  } else if (scale === "quantize") {
    colorScale = d3
      .scaleQuantize()
      .domain(d3.extent(dataset))
      .range(["white", "pink", "red"]);
    /* The quantile scale distributes the dataset evenlay,
          here evenly on the three colors */
  } else if (scale === "quantile") {
    colorScale = d3
      .scaleQuantile()
      .domain(dataset)
      .range(["white", "pink", "red"]);
    /* The treshold scaling allows us to define custom thresholds to scale the dataset */
  } else if (scale === "threshold") {
    colorScale = d3
      .scaleThreshold()
      .domain([45200, 135600])
      .range(d3.schemeBuGn[3]);
  }

  // 1. Rectangles
  svg
    .append("g")
    .selectAll("rect")
    .data(dataset)
    .join("rect")
    .attr("stroke", "black")
    .attr("width", box - 3) //change to box-2 ?
    .attr("height", box - 3)
    .attr("x", (d, i) => box * (i % 20)) //makes that 20 rectangles are in a row
    .attr("y", (d, i) => box * Math.floor(i / 20)) //makes, that after 20 boxes a new row starts
    .attr("fill", (d) => colorScale(d));
}

draw("#heatmap1", "linear");
draw("#heatmap2", "quantize");
draw("#heatmap3", "quantile");
draw("#heatmap4", "threshold");
