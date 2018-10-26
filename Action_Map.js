var height = window.innerHeight;
var width = window.innerWidth;
var svg = d3.select('#container').append('svg');

d3.json("world-countries.json", function (data) {

    var features = _.filter(data.features, function (value, key) {
        return value.properties.name != 'Antarctica';
    });

    var projection = d3.geo.mercator();
    var oldScala = projection.scale();
    var oldTranslate = projection.translate();

    xy = projection.scale(oldScala * (width / oldTranslate[0] / 2) * 0.9)
        .translate([width / 2, height / 2]);

    xy1 = projection.scale(oldScala * (width / oldTranslate[0] / 2) * 0.6)
        .translate([width / 2, height / 2]);

    path = d3.geo.path().projection(xy);

    svg.attr('width', width).attr('height', height);
    svg.selectAll('path').data(features).enter().append('svg:path')
        .attr('d', path)
        //                .on('click', function (data) {
        //                    d3.select(this)
        //                        .attr('fill', d3.hsl(0, 1, 0.6))
        //                        .attr("class", "selected");
        //                })
        //                .on('mouseover', function (data) {
        //                    d3.select(this).attr('fill', d3.hsl(240, 1, 0.6));
        //
        //                })
        //                .on('mouseout', function (data) {
        //                    d3.select(this).attr('fill', 'rgba(128,124,139,0.61)');
        //                })
        //                .on('click', function (data) {
        //                    d3.select(this)
        //                        .attr('fill', d3.hsl(0, 1, 0.6))
        //                        .attr("class", "selected");
        //                })
        .attr('fill', 'rgba(128,124,139,0.61)')
        .attr('stroke', 'rgba(255,255,255,1)')
        .attr('stroke-width', 1);

    d3.selectAll("path:not(#selected)")
        .on('mouseover', function (data) {
            d3.select(this).attr('fill', d3.hsl(240, 1, 0.6));

        })
        .on('mouseout', function (data) {
            if (this.id != "selected") {
                d3.select(this).attr('fill', 'rgba(128,124,139,0.61)');
            }
        })
        .on('click', function (data) {
            if (this.id != "selected") {
                d3.select(this)
                    .attr('fill', d3.hsl(0, 1, 0.6))
                    .attr("id", "selected");
            }else
                {
                     d3.select(this)
                    .attr('fill', 'rgba(128,124,139,0.61)')
                    .attr("id", "unselected");
                }
        });


});
