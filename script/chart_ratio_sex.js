// Create a request variable and assign a new XMLHttpRequest object to it.
// JSON result array
var female_population = [];
var request = new XMLHttpRequest();

//var selected = "chn;fr";
var selected = selectedCountries(selected);
request.open('GET', `http://api.worldbank.org/v2/countries/${selected}/indicators/SP.POP.TOTL.FE.ZS?date=2017&format=json`, true);
request.onload = function () {
    //Begin accessing JSON data here
    var requestArray = JSON.parse(this.response);
    requestArray[1].forEach(element => {
		female_population.push({country:`${element.country.value}`,year:`${element.date}`,value:`${element.value}`});
  })
  console.log(female_population);
	
	


var width=800;
var margin = ({top: 30, right: 0, bottom: 10, left: 100});
var height = female_population.length * 25 + margin.top + margin.bottom;


//var format = d3.format(".3f");
var x = d3.scaleLinear()
    .domain([0, 100])
    .range([margin.left, width - margin.right]);

var y = d3.scaleBand()
    .domain(female_population.map(d => d.country))
    .range([margin.top, height - margin.bottom])
    .padding(0.5);


var yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0));


const svgRatio = d3.select("#ratio").append("svg");

svgRatio.append("g")
      .attr("fill", "blue")
    .selectAll("rect")
    .data(female_population)
    .enter().append("rect")
      .attr("x", d => x(0))
      .attr("y", d => y(d.country))
      .attr("width", 200)
      .attr("height", y.bandwidth());
	
  svgRatio.append("g")
      .attr("fill", "red")
    .selectAll("rect")
    .data(female_population)
    .enter().append("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.country))
      .attr("width", d => d.value*2)
      .attr("height", y.bandwidth());
 

  
 svgRatio.append("g")
      .call(yAxis);
  
svgRatio.node();

};
//Send request
request.send();

function transition(path) {
    path.transition()
        .duration(2000)
        .attrTween("stroke-dasharray", tweenDash);
}
function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function (t) { return i(t); };
}
// Path function for url request
function selectedCountries(countries){
    let path = "";
    for(let i=0;i<countries.length;i++){
        if(i==(countries.length-1)){
            path = path + countries[i];
            return path;
        }else {
        path = path + countries[i]+";";
        }
    }
}

console.log('test');

