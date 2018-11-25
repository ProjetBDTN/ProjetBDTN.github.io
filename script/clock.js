
var width = 500,
    height = 500,
    radius = Math.min(width, height) / 3,
    spacing = .09;



var	formatHour = d3.time.format("%-H hours");



var color = d3.scale.linear()
    .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
    .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });


var arcBody = d3.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return d.index * radius; })
    .outerRadius(function(d) { return (d.index + spacing) * radius; })
    .cornerRadius(6);

var arcCenter = d3.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return (d.index + spacing / 2) * radius; })
    .outerRadius(function(d) { return (d.index + spacing / 2) * radius; });

var svg = d3.select("#clock").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ") scale(0.5)");

var field = svg.selectAll("g")
    .data(fields)
  .enter().append("g");
console.log(fields);

field.append("path")
    .attr("class", "arc-body");

field.append("path")
    .attr("id", function(d, i) { return "arc-center-" + i; })
    .attr("class", "arc-center");

field.append("text")
    .attr("dy", ".35em")
    .attr("dx", ".75em")
    .style("text-anchor", "start")
  .append("textPath")
    .attr("startOffset", "50%")
    .attr("class", "arc-text")
    .attr("xlink:href", function(d, i) { return "#arc-center-" + i; });

tick();

d3.select(self.frameElement).style("height", height + "px");

function tick() {
  if (!document.hidden) field
      .each(function(d) { this._value = d.value; })
      .data(fields)
      .each(function(d) { d.previousValue = this._value; })
    .transition()
      .duration(500)
      .each(fieldTransition);

  setTimeout(tick, 1000 - Date.now() % 1000);
}

function fieldTransition() {
  var field = d3.select(this).transition();

  field.select(".arc-body")
      .attrTween("d", arcTween(arcBody))
      .style("fill", function(d) { return color(d.value); });

  field.select(".arc-center")
      .attrTween("d", arcTween(arcCenter));

  field.select(".arc-text")
      .text(function(d) { return d.text; });
}

function arcTween(arc) {
  return function(d) {
    var i = d3.interpolateNumber(d.previousValue, d.value);
    return function(t) {
      d.value = i(t);
      return arc(d);
    };
  };
}

function NewTime(timezone)
{
	var offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
	var nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	var targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
	return targetDate;

}

function fields() {
  var now = new Date;
  return [
    {index: .2, text: formatHour(now),   value: now.getHours() / 24},
	{index: .3, text: formatHour(NewTime(3)),   value: NewTime(3).getHours() / 24},
	{index: .4, text: formatHour(NewTime(-8)),   value: NewTime(-8).getHours() / 24}
  ];
}
