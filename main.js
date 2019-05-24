// === Config

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const PADDING = { left: 10, top: 10, right: 10, bottom: 10 };
const Y_AXIS_WIDTH = 30;
const X_AXIS_HEIGHT = 30;
const BLOCK_PADDING = 0.3;
const BACKGROUND_COLOR = 'white';
const BLOCK_COLOR = 'indianred';


// === Main stuff

function main() {
  const svgElt = document.querySelector('svg');
  const svgBBox = svgElt.getBoundingClientRect();

  // Compute layout variables ...
  const svg = {
    width: svgBBox.width,
    height: svgBBox.height,
    elt: svgElt
  };
  const chart = {
    width: svg.width - (PADDING.left + PADDING.right),
    height: svg.height - (PADDING.top + PADDING.bottom),
    offset: { x: PADDING.left, y: PADDING.top },
    node: null
  };
  const domain = {
    width: chart.width - Y_AXIS_WIDTH,
    height: chart.height - X_AXIS_HEIGHT,
    offset: { x: Y_AXIS_WIDTH, y: 0 },
    node: null
  };
  const yAxis = {
    width: Y_AXIS_WIDTH,
    height: domain.height,
    offset: { x: Y_AXIS_WIDTH, y: 0 },
    scale: null,
    axis: null,
    node: null
  };
  const xAxis = {
    width: domain.width,
    height: X_AXIS_HEIGHT,
    offset: { x: domain.offset.x, y: domain.height },
    scale: null,
    axis: null,
    node: null
  };

  // ...compute X/Y axis...
  yAxis.scale = d3.scaleBand()
    .domain(DAYS)
    .range([0, domain.height])
    .padding(BLOCK_PADDING);
  yAxis.axis = d3.axisLeft(yAxis.scale)
    .tickFormat(function(day) { return day.substring(0, 3); });

  xAxis.scale = d3.scaleBand()
    .domain(MONTHS)
    .range([0, domain.width])
    .padding(BLOCK_PADDING);
  xAxis.axis = d3.axisBottom(xAxis.scale)
    .tickFormat(function(month) { return month.substring(0, 3); });

  // ...create SVG elements...
  chart.node = d3.select(svg.elt).append('g')
    .attr('class', 'chart')
    .attr('width', chart.width)
    .attr('height', chart.height)
    .attr('transform', `translate(${chart.offset.x},${chart.offset.y})`);
  yAxis.node = chart.node.append('g')
    .attr('class', 'y axis')
    .attr('width', yAxis.width)
    .attr('height', yAxis.height)
    .attr('transform', `translate(${yAxis.offset.x},${yAxis.offset.y})`)
    .call(yAxis.axis);
  xAxis.node = chart.node.append('g')
    .attr('class', 'x axis')
    .attr('width', xAxis.width)
    .attr('height', xAxis.height)
    .attr('transform', `translate(${xAxis.offset.x},${xAxis.offset.y})`)
    .call(xAxis.axis);
  domain.node = chart.node.append('g')
    .attr('class', 'domain')
    .attr('width', domain.width)
    .attr('height', domain.height)
    .attr('transform', `translate(${domain.offset.x},${domain.offset.y})`);

  // ... and load data !
  d3.csv("commits.csv", parseCsvDatum).then(function(rawData) {
    const data = rawData.reduce((acc, arr) => [...acc, ...arr], []);
    const maxCommits = data.reduce((max, d) => d.commits > max ? d.commits : max, 0);
    const colorInterpolator = d3.interpolateRgb(BACKGROUND_COLOR, BLOCK_COLOR);
//    const colorInterpolator = d3.interpolateGnBu;
    const colorScale = commits => colorInterpolator(commits/maxCommits);

    domain.node.selectAll('rect.data-point')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'data-point')
      .attr('y', function(d) { return yAxis.scale(d.day); })
      .attr('x', function(d) { return xAxis.scale(d.month); })
      .attr('width', xAxis.scale.bandwidth())
      .attr('height', yAxis.scale.bandwidth())
      .attr('stroke', 'none')
      .attr('fill', function(d) { return colorScale(d.commits); });
  });
};

function parseCsvDatum(datum) {
  return DAYS.map(day => ({
    month: datum.month,
    day: day,
    commits: parseInt(datum[day])
  }));
}


// === Init

main();
