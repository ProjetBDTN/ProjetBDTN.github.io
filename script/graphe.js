// SVG constants
const widthChart = 400;
const heightChart = 400;
const margin = ({top: 50, right: 50, bottom: 50, left: 60});

// SVG 
let svgPopulation = d3.select('#multichart').append('svg')
svgPopulation.attr('width', widthChart)
    .attr('height', heightChart)
    .attr("fill", "#F0F0F0");
var rectangle = svgPopulation.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", widthChart)
    .attr("height", heightChart)
    .attr("rx", 10)
    .attr("ry", 10)

let svgRatio = d3.select("#ratio").append("svg")


// Multi-chart transition function
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
	console.log(path)
}

//Ratio sexual
function sexualRatio(selected){
	
	// JSON result array
	var female_population = [];
	var request = new XMLHttpRequest();

	var path = selectedCountries(selected);
	request.open('GET', `http://api.worldbank.org/v2/countries/${path}/indicators/SP.POP.TOTL.FE.ZS?date=2017&format=json`, true);
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
	


	//const svgRatio = d3.select("#ratio").append("svg");
	svgRatio.selectAll("path").remove();
	svgRatio.selectAll("#male").remove();
	svgRatio.selectAll("#female").remove();
	svgRatio.selectAll("#yAxis").remove();


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
		
	svgRatio.append("g")
		  .attr("fill", "blue")
		.selectAll("rect")
		.data(female_population)
		.enter().append("rect")
		  .attr("x", d => x(0))
		  .attr("y", d => y(d.country))
		  .attr("width", 200)
		  .attr("height", y.bandwidth())
		.attr("id","male");

	  svgRatio.append("g")
		  .attr("fill", "red")
		.selectAll("rect")
		.data(female_population)
		.enter().append("rect")
		  .attr("x", x(0))
		  .attr("y", d => y(d.country))
		  .attr("width", d => d.value*2)
		  .attr("height", y.bandwidth())
				.attr("id","female");



	 svgRatio.append("g")
			.attr("id","yAxis")
		  .call(yAxis);

	svgRatio.node();
	

	};
	//Send request
	request.send();
}




// Multi-chart display function
function populationChart(selected){

    // Colors choice
    let couleurs = [];
    let nbData = selected.length;
    let delta = 360/nbData;
    for(let i=0;i<nbData;i++){
        couleurs.push(d3.hsl(delta*i, 0.5, 0.6));
    }
    // population array gets the request result
    var population = [];
    // Path function calling
    var path = selectedCountries(selected);
    // Get request from worldbank api 
    // This return countries selected and population for all years (1960-2018)
    var url = "http://api.worldbank.org/v2/countries/"+path+"/indicators/SP.POP.TOTL?per_page=2000&format=json";
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        // Transfer request response to population array
        var requestArray = JSON.parse(this.response);
        requestArray[1].forEach(element => {
            population.push({countryCode:`${element.countryiso3code}`, country: `${element.country.value}`,
                            year: parseInt(element.date),value: parseInt(element.value)
                            });
        }) 
        // We need to tranform population to create path and get the position for labels (selected countries names)
        // points array for the path values
        var points = [];
        // lastValues array for the labels positions
        var lastValues = [];
        // Variables for data arrangment
        var allValues = [];
        var countriesName;
        let temp = 0;
        // Loop to get lastValues and points data
        for(let i=0; i<selected.length; i++){
            allValues = [];
            temp = 0;
            for(let j=population.length-1; j>0; j--){    
                if(population[j].countryCode == selected[i]){
                    allValues.push({x: population[j].year,y: population[j].value});
                    countriesName = population[j].country;
                    temp = population[j].value;
                }
            }
            lastValues.push(temp);
            points.push({country: countriesName,values : allValues});
        }

        // Graph in d3js
        // Min and Max for each scales (y => people number, x => years)
        const xMin = d3.min(population, (population) => population.year);
        const xMax = d3.max(population, (population) => population.year);
        const yMin = d3.min(population, (population) => population.value);
        const yMax = d3.max(population, (population) => population.value);
        // We remove previous paths, labels and yaxis if new selected values
        svgPopulation.selectAll("path").remove();
        svgPopulation.selectAll("#labels").remove();
        svgPopulation.selectAll("#yaxis").remove();
        // Axis
            // xAxis
            var xScale = d3.scaleLinear()
                .domain([xMin, xMax])
                .range([margin.left, widthChart - 2*margin.right]);
            var xAxis = d3.axisBottom()
                    .scale(xScale)
                    .tickFormat(d3.format(""));
            svgPopulation.append("g")
                .attr("transform",`translate(0,${heightChart - margin.bottom})`)
                .call(xAxis)
                .selectAll("text")
                    .attr("y", 10)
                    .attr("x", -35)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(310)")
                    .style("fill", "#004669")
                    .style("text-anchor", "start");
            // yAxis
            var formatNumber = d3.format("");
            function customYAxis(g) {
                g.call(yAxis);
                g.select(".domain").remove();
                g.selectAll(".tick line").attr("stroke", "#777").attr("stroke-dasharray", "2,5");
                g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
            }
            var yScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range([heightChart-margin.bottom, margin.top/2]);
            var yAxis = d3.axisRight(yScale)
                .tickSize(widthChart-2*margin.right)
                .tickFormat(function(d) {
                    var s = formatNumber(d / 1e6);
                    return this.parentNode.nextSibling
                    ? "\xa0" + s
                    : s + " Million Of People";
                });
            svgPopulation.append("g")
                .attr("transform", `translate(${margin.left/2},0)`)
                .attr("id", "yaxis")
                .call(customYAxis)
                .selectAll("text")
                    .style("fill", "#004669"); 
                        
            // Lines scales function
            var lineFunction = d3.line()
                .x(function(d) { return xScale(d.x); })
                .y(function(d) { return yScale(d.y); })
                .curve(d3.curveLinear); 
            // Lines display loop
            for(let i=0; i<points.length; i++){
                lines = svgPopulation.append("g")
                    .attr("transform", "translate(0,0)");
                lines.selectAll("path")
                    .data([points[i].values])
                    .enter()
                    .append("path")
                    .attr("d",lineFunction)
                    .attr("fill", "none")
                    .attr("stroke", couleurs[i])
                    .attr("stroke-width","2")
                    .call(transition);
                svgPopulation.append("text")
                    .attr("transform", "translate(" + 0 + "," + 0 + ")")
                    .attr("dy", ".35em")
                    .attr("text-anchor", "start")
                    .attr("id", "labels")
                    .transition()
                    .duration(2000)
                    .ease(d3.easeCubic)
                    .attr("transform", "translate(" + (widthChart-2*margin.right) + "," + yScale(lastValues[i]) + ")")
                    .style("fill", couleurs[i])
                    .style("font-size", "12px")
                    .text(points[i].country);                
            }
    };
    //Send request
    request.send();
}