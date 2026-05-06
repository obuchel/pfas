function plot_tree(arrK,tim) {
    console.log(arrK);
    var svg;
    d3.select("#tree").html("");
var label_names;

var TOTAL_SIZE;
default_colors=[
    "#c25975","#d26bff","#2d5a47","#093868","#fcdfe6","#94a2fa","#faec94","#decaee","#daeeca","#b54c0a","#dc1818","#18dcdc","#000000","#340000","#86194c","#fef65b","#ff9b6f","#491b47","#171717","#e8efec","#1c6047","#a2bae0","#4978c3","#f8fee0","#dcfb66","#91fb66","#29663b","#b4b7be","#0088b2","#88b200","#c43210","#f06848","#f0bc48","#d293a2","#cccccc","#59596a","#fafae6","#ffc125","#ff4e50","#f0e6fa","#f6c1c3","#363636"
]
  
var tree_branch = false // if the thickness of the branches depend on the value of targt + color * /
var tree_branch_parent = true //  true: thickness from the root if not the direct parent
var tree_branch_color = "black"
var strokeness = 120 //  the degree of separation between the nodes 
var default_strokeness = 50
var hover_percent_parent = false // if the display percentage depends on the direct parent or the root
var square = false
var rect_percent = true //display the percentage or the value in the small rectangles of the labels 
var value_percent_top = true /// if we display the value and the percentage above the rectangle /

  var dict_leaf_y = {1:0, 2:-17.5, 3:-35, 4:-52.5,5:-70,6:-87.5,6:-105,7:-122.5,8:-140,9:-157.5,10:-175}
  
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
var version2 = true // if true json from generator_2 will be used
  var height=1900;
  var width=1200;
  var treemap,diagonal,root;
  var margin={"right":150,"left":100,"top":0.5,"bottom":0.5}
d3.json("structureC2.json", function(error, flare) {
 if (error) throw error;
  
//console.log(flare);


    treemap = d3.tree()
        .size([height, 7*width/8]);

    diagonal =  d3.linkHorizontal()
      .x(function(d) { return d.x; })
	.y(function(d) { return d.y; });


    svg = d3.select("#tree").append("svg")
        .attr("width", 7*width/8 + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
	//.style("outline","solid 3px blue")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
						   /*
g {
    outline: solid 3px blue;
    outline-offset: 5px;
  }

g:hover {
 outline-color: red
}

						   */
  TOTAL_SIZE = flare.size
  l = flare.pred_p//.replace(/of/g,"").split(', ')
  for( var j=0; j < l.length; j++){
      l[j] = l[j].split(' ')[2]
  }
  label_names = l

  root = flare;
  root.x0 = height / 2;
  root.y0 = 0;
  //root.children.forEach(collapse);
  update(root,l.length);
  //createLabels(l);
});

  d3.select(self.frameElement).style("height", "480px");




function update(source,n_labels) {

   // console.log(source);
  // Compute the new tree layout.
//var treeData = treemap(source);
//console.log(treeData);		    

let nodes = d3.hierarchy(source, d => d.children);
nodes = treemap(nodes);
    
  // Normalize for fixed-depth.
//  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
     // .data(nodes, function(d) { return d.id || (d.id = ++i); });
      .data(nodes.descendants())

     var nodeEnter = node.enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal"
         : " node--leaf"))
      .attr("transform", d => "translate(" + d.y + "," +
         d.x + ")");   



  nodeEnter.append("circle")
      .attr("r", 5)
      .style("fill", function(d) {
          
          return d._children ? "lightsteelblue" : "#fff"; 
        });

const link = svg.selectAll(".link")
      .data(nodes.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .style("stroke-width", d => {return 2;})
      .attr("d", d => { 
          return "M" + d.y + "," + d.x
             + "C" + (d.y + d.parent.y) / 2 + "," + d.x
             + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
             + " " + d.parent.y + "," + d.parent.x;
      });
      // var arr=[1,2,3,6];
      //var arr=[1,2,3,4,4,4];
      //var arr=[1,2,3,3,4];
      var arr0=[1];
    var ll="";
    console.log(arrK,arrK.toString().length);
      for (var i=1; i<arrK.length; i++) {
          console.log(arrK[i]);				    
	  ll +="(d.data.class=='class_"+arr0.toString().replace("[","").replace("]","").replaceAll(",","_")+"_"+arrK[i].toString()+"' && d.parent.data.class=='class_"+arr0.toString().replace("[","").replace("]","").replaceAll(",","_")+"')";
         console.log(ll);
	 // svg.selectAll(".link").style("stroke-width", d => { if (eval(ll0)) {return d.parent.data.pred_p;}});

	  ll +=" || ";
	arr0.push(arrK[i]);
				  
      }

    var myScale=d3.scaleLinear().domain([0,1]).range([1,10]);
    svg.selectAll(".link").style("stroke-width", d => { var tt=d.parent.children.map(function(f){return f.data.time}); return myScale(d.data.time.length/d3.sum(tt.map(function(f){return f.length;})));});
    //d3.sum(tt.map(function(f){return d3.sum(f);})))
  //  console.log(arr0);
	console.log(ll.substr(0,ll.length-3));
				  
      svg.selectAll(".link").style("stroke", d => { if (eval(ll.substr(0,ll.length-3))) {return "red";}});
      
   //   svg.selectAll(".link")
     //  .style("stroke-width", d => { if ((d.data.class=="class_1_2" && d.parent.data.class=="class_1") || (d.data.class=="class_1_2_3" && d.parent.data.class=="class_1_2") ||  (d.data.class=="class_1_2_3_4" && d.parent.data.class=="class_1_2_3")) {return 10;} })
//       .style("stroke-width", d => {if (d.data.class=="class_1_3" && d.parent.data.class=="class_1_2") {return 10;} });

      
  function check_label(name){
    //console.log(name);
    if (name.indexOf("Failed")>-1) {
    return " Failed ";
    } else if (name.indexOf("Engrossed")>-1) {
    return " Engrossed ";
    } else if (name.indexOf("Enrolled")>-1) {
    return " Enrolled ";
    } else if (name.indexOf("Introduced")>-1) {
    return " Introduced ";

    }else if (name.indexOf("Passed")>-1) {

    return " Passed ";

    } else if (name.indexOf("Vetoed")>-1) {

    return " Vetoed ";
    }
    }
/*
nodeEnter.append("circle")
   .attr("r", 4.5)
   .style("stroke", "grey")
	.style("fill", "red");


	nodeEnter.append("text")
	.attr("class","node_text")
   .attr("dy", ".35em")
   .attr("x", d => d.children ? (d.data.value + 5) * -1 :
      d.data.value + 5)
   .attr("y", d => d.children && d.depth !== 0 ?
      -(d.data.value + 5) : d)
   .style("text-anchor", d => d.children ? "end" : "start")
	.text(d => " "+check_label(d.data.name)+" ");
*/

    function getTextWidth(text, fontSize, fontFace) {
        var a = document.createElement('canvas');
        var b = a.getContext('2d');
        b.font = fontSize + 'px ' + fontFace;
        return b.measureText(text).width;
  }

  
  function check_color(name){
    //console.log(name);
    if (name.indexOf("Failed")>-1) {
    return "#6a3d9a";
    } else if (name.indexOf("Engrossed")>-1) {
    return "#ff7f00";
    } else if (name.indexOf("Enrolled")>-1) {
    return "#33a02c";
    } else if (name.indexOf("Introduced")>-1) {
    return "grey";

    }else if (name.indexOf("Passed")>-1) {

    return "#1f78b4";

    } else if (name.indexOf("Vetoed")>-1) {

    return "#e31a1c";
    }
    }
/*
tooltip2 = d3.select("body")
  .append("div")
    .style("position", "absolute")
	.style("visibility", "hidden")
	.style("background-color","white")
    .style("padding","10px")
	.style("z-index",10000)
    .text("");
*/
    
         var rect2 = nodeEnter.append("rect")
      //.attr("id",function(d){ return d.data.name;})
      .attr("width", 133 + 8)
      .attr("height", 70)
      .attr("x",-35)
      .attr("y",-35)
      .attr("rx",6)
      .attr("ry",6)
      //.attr("class",function(d){return d.data.class;})
      .style("fill","white")//function(d){return check_color(d.data.name);})
	.style("fill-opacity",1)
	.style("stroke-width","2px")
      //.style("stroke-width",function(d){if (d.data.class=="class_1" || d.data.class=="class_1_2") {return "5px"} else {return "2px"};})
      .style("stroke",function(d){  return check_color(d.data.name);})
      //.on("click",function(d){console.log(d);})
     // .style("visibility", function(d){ plot_boxplot(d.data.name);  return  (d.children || d._children) || version2 ? "visible" : "hidden"})
	     .on("mouseover", function(d){return tooltip2.style("visibility", "visible").html(" Number of bills: "+d.data.nums+"<br> Percentage of bills that did not proceed from this stage: "+d.data.pred_f+"% <br> Percentage of bills that moved on from this stage: "+d.data.pred_p+"% <br> Percentage of bills that stopped on from this stage: "+d.data.stop+"%");})
  .on("mousemove", function(){return tooltip2.style("top", (event.pageY-23)+"px").style("left",(event.pageX+30)+"px");})
  .on("mouseout", function(){return tooltip2.style("visibility", "hidden");});

//<br> Current waiting time:"+tim
//      plot_boxplot(d.data.name);
      var rect = nodeEnter.append("g")
      .attr("class","rect")
      .attr("id",function(d){ return d.data.name;})      
      .attr("width", 133 + 8)
      .attr("height", 70)
      //.attr("x",-80)
      .attr("y",-35)
      .attr("x",-35)
      // .attr("y",-80)//function(d){if (d.data.stop=="0") {return -80;} else {return 0;} })
      .attr("rx",6)
      .attr("ry",6)
	  .style("visibility", function(d){ if (d.data.time.length>0) {plot_boxplot(d.data.name,d.data.time,check_color(d.data.name),d.data.class)} ;  return  (d.children || d._children) || version2 ? "visible" : "hidden"});
//	  .on("click",function(d){console.log(JSON.stringify(d))});


rect.append("text")
    .attr("x", function(d) { return 10; })
    .attr("y", -70*0.4)
    .attr("dy", ".35em")
	.text(function(d) {  return check_label(d.data.name); });
      
    /*
      var rect2 = nodeEnter.append("rect")
      .attr("id",function(d){ return d.data.name;})
      .attr("width", 133 + 8)
      .attr("height", 70)
      .attr("x",-35)
      .attr("y",-35)
      .attr("rx",6)
      .attr("ry",6)
      .attr("class",function(d){return d.data.class;})
      //.style("fill",function(d){return check_color(d.data.name);})
      //.style("fill-opacity",0.4) 
      //.style("stroke-width",function(d){if (d.data.class=="class_1" || d.data.class=="class_1_2") {return "5px"} else {return "2px"};})
      //.style("stroke",function(d){  return check_color(d.data.name);})
      //.on("click",function(d){console.log(d);})
      .style("visibility", function(d){ plot_boxplot(d.data.name);  return  (d.children || d._children) || version2 ? "visible" : "hidden"})

 nodeEnter.append("text")
      .attr("x", function(d) { 
          ttr = 13
          if(default_colors.length > 5){
              ttr = (40*default_colors.length)/2
          }
          return (d.children || d._children) || version2 ? -75 - ( (getTextWidth(d.data.size+"%",10,'Verdana')+5.7 ) - (133+8) ) / 2 : ttr

	  
       }) 
      .attr("y",function(d){ 
          ttr = dict_leaf_y[label_names.length] - 15
          if(default_colors.length > 5){
              ttr = -20
          }
          return (d.children || d._children) || version2 ? -87 : ttr;

        })
      .attr("dy", ".35em")
      .attr("text-anchor", "start" )
      .style("font-size","10px")
      .style("font-family","Verdana")
      .style("stroke","#c2c2c2")
      .style("stroke-width","0.05em")
      .text(function(d) {  return true ? d.data.size+"%" : ""; })
      .attr('visibility',function(){
          return value_percent_top ? 'visible' : 'hidden'
      })
*/
      d3.selectAll(".link").moveToBack();
      d3.selectAll(".rect").moveToFront();
}



function createLabels(labels) {
    
    
    var Size = 400


	var svg1 = d3.select("body")
                .append("svg")
                .attr("width",Size)
                .attr("height", Size)
                .attr("class","legends");
        
   // console.log(labels.length)
   // console.log(default_colors.slice(0,labels.length))
    default_colors = default_colors.slice(0,labels.length)
    if(default_colors.length == 2) default_colors.push('')
    if (default_colors.length == 0){
       var c_l =  default_colors
    }else{
       var c_l =  default_colors
    }   

    for(i=0; i< c_l.length; i++){

//        console.log(labels[i],"",c_l[i])

        var legendG = svg1
        .append("g")
        .attr("transform", function(d){
		    return "translate("+0+"," + ( 30*i + Size/33 + Size/50) + ")"; // place each legend on the right and bump each one down 15 pixels
	    })
        .attr("class", "legend");   

        legendG.append("rect") // make a matching color rect
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", c_l[i])
        .style('visibility',function(){
            return labels[i] ? "visible": "hidden"
        })

        legendG.append("text") // add the text
        .text(labels[i])
        .style("font-size", 30)
        .attr("y", 12)
        .attr("x", 21)
 svg.selectAll(".link").style("stroke", d => { if (eval(ll.substr(0,ll.length-3))) {return "red";}});
		
    }

     svg.selectAll(".link").style("stroke", d => { if (eval(ll.substr(0,ll.length-3))) {return "red";}});
//d3.selectAll('.link').pushElementAsBackLayer();
//d3.selectAll(".link").moveToBack();
}
//    svg.selectAll(".link").style("stroke", d => { if (eval(ll.substr(0,ll.length-3))) {return "red";}});
//d3.selectAll(".link").moveToBack();
//d3.selectAll('.link').pushElementAsBackLayer();
}
