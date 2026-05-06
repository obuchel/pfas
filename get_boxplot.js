
function plot_boxplot(name,dd0,Mcol,last) {
    var dd=dd0.sort(function(a, b){return a-b});
function boxplotStats(data, valueof) {
  const values = valueof ? data.map(valueof) : data
  const fiveNums = [0.0, 0.25, 0.5, 0.75, 1.0].map((d) => d3.quantile(values, d))
  const iqr = fiveNums[3] - fiveNums[1]
  const step = iqr * 1.5
  const fences = [
    { start: fiveNums[1] - step - step, end: fiveNums[1] - step },
    { start: fiveNums[1] - step, end: fiveNums[1] },
    { start: fiveNums[1], end: fiveNums[3] },
    { start: fiveNums[3], end: fiveNums[3] + step },
    { start: fiveNums[3] + step, end: fiveNums[3] + step + step },
  ]
  const boxes = [
    { start: fiveNums[1], end: fiveNums[2] },
    { start: fiveNums[2], end: fiveNums[3] },
  ]
  const whiskers = [
    { start: d3.min(values.filter((d) => fences[1].start <= d)), end: fiveNums[1] },
    { start: d3.max(values.filter((d) => fences[3].end >= d)), end: fiveNums[3] },
  ]
  const points = values.map((d, i) => ({
    value: d,
    datum: data[i],
    outlier: d < fences[1].start || fences[3].end < d,
    farout: d < fences[0].start || fences[4].end < d,
  }))
  return { fiveNums, iqr, step, fences, boxes, whiskers, points }
}
// var sumstat0=boxplotStats([1,2,3,4,5,7,4,5,6,7,8,9,10]);

						   /*
						   var dd=[12, 180, 1, 244, 244, 85, 3, 3, 155, 6, 138, 104, 100, 124, 80, 97, 105, 2, 60, 467, 34, 28, 15, 195, 448, 35, 50, 10, 24, 83, 25, 30, 29, 27, 120, 14, 12, 56, 23, 5, 74, 6, 11, 21, 22, 99, 90, 50, 13, 150, 56, 24, 107, 27, 135, 37, 119, 47, 264, 292, 35, 55, 98, 129, 21, 119, 21, 6, 40, 1, 1, 2, 0, 1, 1, 1, 0, 0, 0, 0, 4, 1, 0, 5, 53, 211, 9, 244, 1, 244, 3, 3, 155, 520, 146, 176, 1, 133, 132, 132, 132, 104, 34, 15, 65, 35, 80, 119, 28, 75, 195, 37, 170, 61, 89, 330, 5, 51, 34, 89, 37, 56, 6, 596, 100, 109, 33, 33, 55, 25, 49, 48, 2, 14, 100, 30, 6];
var dd=[0, 6, 11, 39, 39, 12, 12, 0, 12, 2, 28, 26, 26, 32, 31, 32, 33, 7, 23, 30, 3, 12, 5, 6, 6, 102, 10, 10, 22, 35, 23, 23, 15, 18, 2, 7, 16, 3, 0, 93, 9, 7, 9, 54, 14, 0, 7, 3, 11, 13, 46, 3, 12, 7, 4, 28, 16, 26, 18, 3, 16, 23, 0, 5, 1, 5, 24, 24, 15, 22, 0, 1, 0, 2, 4, 0, 8, 6, 19, 39, 11, 39, 12, 0, 12, 12, 0, 6, 6, 8, 8, 8, 8, 20, 71, 30, 3, 31, 19, 18, 6, 4, 0, 1, 3, 79, 10, 18, 85, 79, 19, 59, 10, 116, 26, 37, 6, 6, 21, 22, 13, 26, 42, 22, 15, 21, 1];
*/
    //console.log(name,dd);						   
// set the dimensions and margins of the graph
var margin1 = {top: 10, right: 10, bottom: 10, left: 10},
    width1 = 150 - margin1.left - margin1.right,
    height1 = 120 - margin1.top - margin1.bottom;

// append the svg object to the body of the page
var svg = d3.select("#"+name)
    .append("g")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    //.style("fill","black")
    // .style("stroke-width", "10px")
   // .style("outline","solid 3px blue")
     // .style("outline-color","red")
    .attr("transform", "translate(" + (-32) + "," + (-65) + ")")//(-margin1.top*11)
     //.style("fill","black")
     //.style("stroke-width", "10px");

// Read the data and compute summary statistics for each specie
//d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data_) {
//data_.map(function(d,i){if (i<50) dd.push(+d.Sepal_Length); });
//console.log(dd);
    var sumstat0={};
    sumstat0=boxplotStats(dd);
var data0=[];
dd.map(function(d){data0.push({"Sepal_Length":d,"Species":"setosa"});});
//console.log(data0);						   
   // data_.map(function(d){ if (d.Species=="setosa") {data0.push(d);} });
  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Species;})
    .rollup(function(d) {
      q1 = d3.quantile(dd.map(function(g) { return g}).sort(d3.ascending),.25)
      median = d3.quantile(dd.map(function(g) { return g}).sort(d3.ascending),.5)
      q3 = d3.quantile(dd.map(function(g) { return g}).sort(d3.ascending),.75)
      interQuantileRange = q3 - q1
      min = q1 - 1.5 * interQuantileRange
      max = q3 + 1.5 * interQuantileRange
	return({q1: q1, median: median, q3: q3, interQuantileRange: sumstat0["iqr"], min: min, max: max,boxes:sumstat0["boxes"],fences:sumstat0["fences"],fiveNums:sumstat0["fiveNums"],step:sumstat0["step"],whiskers:sumstat0["whiskers"]})
    })
.entries(data0)
//    console.log(name,sumstat);						   
/*
boxes: [{start: 4, end: 4}, {start: 4, end: 7}]
fences: [{start: -5, end: -0.5}, {start: -0.5, end: 4}, {start: 4, end: 7}, {start: 7, end: 11.5}, {start: 11.5, end: 16}]
fiveNums: [1, 4, 4, 7, 10]
iqr: 3
points: [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, …]
step: 4.5
whiskers: [{start: 1, end: 4}, {start: 10, end: 7}] 
*/
  // Show the Y scale
  var y = d3.scaleBand()
    .range([ height1, 10 ])
    .domain(["setosa"])
    .padding(.4);
/*  svg.append("g")
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()
*/
//    console.log(sumstat[0].value.fiveNums);
  // Show the X scale
  var x = d3.scaleLinear()
      .domain([0,d3.max(sumstat[0].value.fiveNums)])
    .range([5, width1])
  svg.append("g")
	.attr("transform", "translate(0," + (height1-20) + ")")
    .call(d3.axisBottom(x).ticks(5))
  // .select(".domain").remove()

  // Color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([sumstat[0].value["min"],sumstat[0].value["max"]])
/*
  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width*0.75)
      .attr("y", height + margin.top + 3)
      .text("Sepal Length");
*/
  // Show the main vertical line
  svg
    .selectAll(".vert_1_"+name)//vertLines
    .data(sumstat)
    .enter()
	.append("line")
	.attr("class","vert_1_"+name)
      .attr("x1", function(d){return(x(d.value.whiskers[0]["start"]))})
      .attr("x2", function(d){return(x(d.value.median))})// d.value.whiskers[1]["start"]
      .attr("y1", function(d){return(y(d.key) + y.bandwidth()/2)})
      .attr("y2", function(d){return(y(d.key) + y.bandwidth()/2)})
      .attr("stroke", Mcol)
	.style("stroke-width", 1)
    
     svg
    .selectAll(".vert_2_"+name)//vertLines                                                                                                                                                          
    .data(sumstat)
    .enter()
        .append("line")
        .attr("class","vert_2_"+name)
      .attr("x1", function(d){return(x(d.value.median))})
	.attr("x2", function(d){if (d.value.whiskers[1]["start"]!="undefined") {return x(d.value.whiskers[1]["start"])} else {return d.value.max;}})// d.value.whiskers[1]["start"]                                                                                             
      .attr("y1", function(d){return(y(d.key) + y.bandwidth()/2)})
      .attr("y2", function(d){return(y(d.key) + y.bandwidth()/2)})
      .attr("stroke", Mcol)
        .style("stroke-width", 1)

  // rectangle for the main box
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.value.q1))}) // console.log(x(d.value.q1)) ;
        .attr("width", function(d){ ; return(x(d.value.q3)-x(d.value.q1))}) //console.log(x(d.value.q3)-x(d.value.q1))
        .attr("y", function(d) { return y(d.key); })
        .attr("height", y.bandwidth() )
        .attr("stroke", d3.hsl(Mcol).brighter(-0.5))
        .style("stroke-width","1px")
        .style("fill", Mcol)
        .style("opacity", 0.5)

  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
	.append("line")
	.attr("class", name)
      .attr("y1", function(d){return(y(d.key))})
      .attr("y2", function(d){return(y(d.key) + y.bandwidth())})
      .attr("x1", function(d){return(x(d.value.median))})
      .attr("x2", function(d){return(x(d.value.median))})
	.attr("stroke", Mcol)
     .style("stroke-width","1px")
	//.style("width", 80)


   svg
    .selectAll("maxLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("y1", function(d){return(y(d.key))})
      .attr("y2", function(d){return(y(d.key) + y.bandwidth())})
      .attr("x1", function(d){return(x(d.value.whiskers[1]["start"]))})
      .attr("x2", function(d){return(x(d.value.whiskers[1]["start"]))})
      .attr("stroke", Mcol)
      .style("stroke-width", 1)  


    svg
        .selectAll("minLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function(d){return(y(d.key))})
        .attr("y2", function(d){return(y(d.key) + y.bandwidth())})
        .attr("x1", function(d){return(x(d.value.whiskers[0]["start"]))})
        .attr("x2", function(d){return(x(d.value.whiskers[0]["start"]))})
        .attr("stroke", Mcol)
        .style("stroke-width", 1)

    
  // create a tooltip
  var tooltip = d3.select("#"+name)
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("font-size", "16px")
  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 1)
    tooltip
        .html("<span style='color:grey'>Sepal length: </span>" + d.Sepal_Length) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add individual points with jitter
  var jitterWidth = 10
  svg
    .selectAll("indPoints")
    .data(data0)
    .enter()
	.append("circle")
	.attr("class",name)
      .attr("cx", function(d){ return(x(d.Sepal_Length))})
      .attr("cy", function(d){ return( y(d.Species) + (y.bandwidth()/2)- jitterWidth/2 + Math.random()*jitterWidth )})
      .attr("r", 2)
      .style("fill", function(d){ return "white"})
      .style("fill-opacity",0.5)						   
      .attr("stroke", Mcol)
      .style("stroke-opacity",0.5)						   
//      .on("mouseover", mouseover)
  //    .on("mousemove", mousemove)
    //  .on("mouseleave", mouseleave)
d3.selectAll("path.link").moveToBack();

//})
}
