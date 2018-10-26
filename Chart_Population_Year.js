// Create a request variable and assign a new XMLHttpRequest object to it.
// JSON result array
var population = [];
var request = new XMLHttpRequest();

request.open('GET', "http://api.worldbank.org/v2/countries/chn;bra;usa;fra/indicators/SP.POP.TOTL?per_page=1000&format=json", true);
request.onload = function () {
    //Begin accessing JSON data here
    var requestArray = JSON.parse(this.response);
    requestArray[1].forEach(element => {
        population.push({country:`${element.countryiso3code}`,year:`${element.date}`,value:`${element.value}`});
  })
  console.log(population);
};
//Send request
request.send();