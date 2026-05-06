

//<![CDATA[
//var progs3 = [];
   var tooltip2 = d3.select("body")
       .append("div")
       .style("position", "absolute")
       .style("visibility", "hidden")
       .style("background-color", "white")
       .style("padding", "10px")
       .style("z-index", 10000)
       .text("");
   var all = []; ////replace with all chem terms
   var all_nes = []; ////replace with all NE terms
   // var editor;
   var x11,
       y,
       canvas,
       highlightGroup,
       interactionSvg;
   var width = window.innerWidth * 0.4;
   var height = window.innerHeight * 0.5;
   var margin = {
       top: 5,
       left: 20,
       bottom: 30,
       right: 30
   };
   var padding = {
       top: 10,
       right: 40,
       bottom: 10,
       left: 80
   };
   var all_points = [];
   var cust_names = [];
   var kk0 = {
       '0': 'Accounts',
       '1': 'Acts',
       '2': 'Administration',
       '3': 'Agencies',
       '4': 'Associations',
       '5': 'Bipoc',
       '6': 'Boards',
       '7': 'Center',
       '8': 'Codes',
       '9': 'Colleges',
       '10': 'Commissions',
       '11': 'Committees',
       '12': 'Companies',
       '13': 'Corps',
       '14': 'Dental',
       '15': 'Departments',
       '16': 'Diseases',
       '17': 'District',
       '18': 'Division',
       '19': 'Divisions',
       '20': 'Fire',
       '21': 'Funds',
       '22': 'Geolocations',
       '23': 'Habitats',
       '24': 'Hospitals',
       '25': 'Indian',
       '26': 'Insurances',
       '27': 'Laboratories',
       '28': 'Laws',
       '29': 'Materials',
       '30': 'Offices',
       '31': 'Organisms',
       '32': 'Other',
       '33': 'Permits',
       '34': 'Plans',
       '35': 'Plants',
       '36': 'Plastic',
       '37': 'Pollutants',
       '38': 'Pollution',
       '39': 'Products',
       '40': 'Programs',
       '41': 'Recycling',
       '42': 'Senate',
       '43': 'Service',
       '44': 'Societies',
       '45': 'Specification',
       '46': 'Standards',
       '47': 'Systems',
       '48': 'Tests',
       '49': 'Training',
       '50': 'Union',
       '51': 'Universities',
       '52': 'Verbs',
       '53': 'Waste',
       '54': 'Water'
   };
   var dialog,
       form;
   var table;
   var data = {};
   data["data"] = [];

   $(document).ready(function() {

       $("#tabs").tabs();
       d3.json("data/controlled_vocabs.json", function(kkeys) {
           all = kkeys["chems"]; ////replace with all chem terms
           all_nes = kkeys["nes"]; ////replace with all NE terms

           d3.json("data/datavis.json", function(treeData) {

               //   console.log(treeData);

               ///////////////////////////////////////////// 

               function filter_chart(sels) {
                   var filtered = Object.keys(allOptions).reduce(function(filtered, key) {
                       if (sels.indexOf(key) > -1)
                           filtered[key] = allOptions[key];
                       return filtered;
                   }, {});
                   context = canvas.node().getContext('2d');
                   context.save();
                   context.clearRect(0, 0, 0, 0);
                   context.restore();
                   highlightGroup.html("");
                   make_plot(filtered);

               }
               //console.log(filtered); ///make chart...

               //"capital projects account": [0, "0", 2019, 2021, 737]
               function get_filtered_datatable() {
                   var filteredrows = $("#example1").dataTable()._('tr', {
                       "filter": "applied"
                   });
                   var arr = [];
                   //var sels=[];
                   for (var i = 0; i < filteredrows.length; i++) {
                       arr.push(filteredrows[i]);
                   };
               }
               var d = treeData;
               var prs = [];
               for (var i = 0; i < d.length; i++) {
                   var temp = {};
                   temp["ID"] = i;
                   temp["id0"] = d[i]["bill_id"];
                   temp["Title"] = d[i]["title"];
                   temp["Bill_Number"] = d[i]["bill_number"];
                   temp["State"] = d[i]["state"];
                   temp["Progress"] = d[i]["status"];
                   if (prs.indexOf(temp["Progress"]) == -1) {
                       prs.push(temp["Progress"]);
                   }
                   temp["progress2"] = d[i]["progress"];
                   temp["URL"] = d[i]["url"];
                   temp["Summary"] = d[i]["summary"];
                   temp["last_update"] = d[i]["last_update"];
                   temp["active"] = "0";
                   temp["description"] = d[i]["description"];
                   temp["full_text"] = d[i]["full_text"];
                   temp["chems"] = d[i]["chem"];
                   temp["nes"] = d[i]["ners"];
                   temp["pg1"] = d[i]["pg1"];
                   temp["pg2"] = d[i]["pg2"];
                   temp["rake"] = d[i]["rake"];
                   data["data"].push(temp);
               }
               // console.log(prs);

               $.fn.dataTable.ext.errMode = 'throw';
               table = $('#example1').DataTable({
                   data: data["data"],
                   columns: [ // { data: "ID" },
                       {
                           data: "Title"
                       },
                       {
                           data: "Bill_Number"
                       }, //{ data: "Description" },
                       {
                           data: "State"
                       }, // { data: "last_update" },


                       {
                           data: 'Progress',
                           render: function(data, type, row, meta) {

                               if (data == 0) {

                                   return type === 'display' ?
                                       '<progress value="-1"></progress>' : data;

                               } else if (data > 0 && data < 5) {
                                   return type === 'display' ?
                                       '<progress class="coral" value="' + data + '" max="6"></progress>' :
                                       data;
                               } else {
                                   return type === 'display' ?
                                       '<progress value="' + data + '" max="6"></progress>' :
                                       data;

                               }


                           },
                       },
                       {
                           data: "last_update"
                       }, //  { data: "URL" },
                       //  { data: "Summary" },
                       // { data: "Progress" },
                       {
                           data: "active",
                           render: function(data, type, row) {
                               if (type === 'display') {
                                   return '<input type="checkbox" class="editor-active">';
                               }
                               return data;
                           },
                           className: "dt-body-center"
                       }
                   ],
                   select: {
                       style: 'os',
                       selector: 'td:not(:last-child)' // no row selection on last column
                   },
                   buttons: [



                   ],
                   /*  { extend: "create", editor: editor },
                               { extend: "edit",   editor: editor },
                               { extend: "remove", editor: editor }*/
                   responsive: true,
                   select: true,
                   rowCallback: function(row, data) {
                       // Set the checked state of the checkbox in the table
                       $('input.editor-active', row).prop('checked', data.active == 1);
                   },
                   //dom: 'Bfrtilp<"clear">>rt<"bottom"iflp<"clear">>'
                   dom: '<"top"Bif<"clear">>rt<"bottom"lp<"clear">>'
               }).on('search.dt', function() {
                   // eventFired('Search');
                   get_filtered_datatable();

               });
               var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                   title = $("#title1"),
                   id = $("#ID"),
                   bill_number = $("#bill_number"),
                   state = $("#state"),
                   progress = $("#progress"),
                   url = $("#URL"),
                   chems = $("#chems"),
                   nes = $("#nes"),
                   pg1 = $("#pg1"),
                   pg2 = $("#pg2"),
                   rake = $("#rake"),
                   last_update = $("#last_update"),
                   //list = $( "#list" ),       
                   description = $("#description"),
                   full_text = $("#full_text"),
                   summary = $("#summary"),
                   active = $("#active"),
                   allFields = $([]).add(id).add(title).add(bill_number).add(state).add(progress).add(url).add(chems).add(nes).add(pg1).add(pg2).add(rake).add(last_update).add(description).add(full_text).add(summary).add(active),
                   //.add( list ),
                   tips = $(".validateTips");

               function updateTips(t) {
                   tips
                       .text(t)
                       .addClass("ui-state-highlight");
                   setTimeout(function() {
                       tips.removeClass("ui-state-highlight", 1500);
                   }, 500);
               }

               function checkLength(o, n, min, max) {
                   if (o.val().length > max || o.val().length < min) {
                       o.addClass("ui-state-error");
                       updateTips("Length of " + n + " must be between " +
                           min + " and " + max + ".");
                       return false;
                   } else {
                       return true;
                   }
               }

               function checkRegexp(o, regexp, n) {
                   if (!(regexp.test(o.val()))) {
                       o.addClass("ui-state-error");
                       updateTips(n);
                       return false;
                   } else {
                       return true;
                   }
               }

               function addUser() {
                   var valid = true;
                   allFields.removeClass("ui-state-error");

                   valid = valid && checkLength(title, "title1", 3, 16);
                   valid = valid && checkLength(bill_number, "bill_number", 6, 80);
                   valid = valid && checkLength(state, "state", 2, 20);
                   valid = valid && checkLength(progress, "progress", 0, 2);
                   valid = valid && checkRegexp(title, /^[a-z]([0-9a-z_\s])+$/i, "Title may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
                   if (valid) {
                       $("#example1 tbody").append("<tr>" +
                           "<td>" + id.val() + "</td>" +
                           "<td>" + title.val() + "</td>" +
                           "<td>" + bill_number.val() + "</td>" +
                           "<td>" + state.val() + "</td>" +
                           "<td>" + progress.val() + "</td>" +
                           "<td>" + url.val() + "</td>" +
                           "<td>" + chems.val() + "</td>" +
                           "<td>" + nes.val() + "</td>" +
                           "<td>" + pg1.val() + "</td>" +
                           "<td>" + pg2.val() + "</td>" +
                           "<td>" + rake.val() + "</td>" +
                           "<td>" + last_update.val() + "</td>" +
                           "<td>" + description.val() + "</td>" +
                           "<td>" + full_text.val() + "</td>" +
                           "<td>" + summary.val() + "</td>" +
                           "<td>" + active.val() + "</td>" +
                           "</tr>");
                       dialog.dialog("close");

                   }
                   return valid;
               }

               dialog = $("#dialog-form").dialog({
                   autoOpen: false,
                   overflow: "auto",
                   height: 2700,
                   //window.innerHeight*0.9,
                   width: window.innerWidth * 0.9,
                   modal: true,
                   buttons: {
                       "Update Bill": addUser,
                       Cancel: function() {
                           dialog.dialog("close");
                           if (tooltip2 != "undefined") {
                               tooltip2.html("");
                           }
                       }
                   },
                   close: function() {
                       form[0].reset();
                       allFields.removeClass("ui-state-error");
                       //$imageDialog.empty();
                       if (tooltip2 != "undefined") {
                           tooltip2.html("");
                       }
                   },
                   show: {
                       effect: "blind",
                       duration: 1000
                   },
                   hide: {
                       effect: "explode",
                       duration: 1000
                   },
                   open: function() {
                       $("#tabs").tabs();
                       $("#tabs").css({
                           "visibility": "visible"
                       });


                   }
               });

               form = dialog.find("form").on("submit", function(event) {
                   event.preventDefault();
                   addUser();
               });


               function drawPoints1() {

                   //context.restore();
                   d3.select("#canvas_root2").selectAll(".line2").remove();
                   d3.select("#canvas_root3").selectAll(".line2").remove();
                   // if (points.length>26000) {    

                   highlightGroup
                       .selectAll("dot")
                       .data(points)
                       .enter()
                       .append("circle")
                       .attr("class", function(d) {
                           return "cir cir_" + d.c.replaceAll(" ", "");
                       })
                       .attr('r', function(d) {
                           return radScale(d.o2);
                       })
                       .attr("cx", function(d) {
                           return d.x + 80;
                       })
                       .attr("cy", function(d) {
                           return d.y + 10;
                       })
                       .attr('stroke-width', 0)
                       .attr('fill', function(d) {
                           /*colorScale(d.o)*/

                           return d.color;


                       })
                       . //  });
                   attr('stroke', d3.rgb(0, 0, 0))
                       .style('z-index', 101)
                       .style("fill-opacity", 0.3)
                       .on("click", function(e) {




                       });




               }

               function drawLine1(context1, d, i, x, y) {




               }

               function make_plot(translated10, name, tex) {


                   var visRoot = d3
                       .select("#" + name)
                       .append('div')
                       .attr('class', 'vis-root')
                       .style('position', 'absolute');

                   // main canvas to draw on
                   var screenScale = window.devicePixelRatio || 1;

                   //  alert(screenScale);
                   //if (tex!="National") {
                   //console.log(width,screenScale);    
                   canvas = visRoot
                       .append('canvas')
                       .attr('id', "canvas_root" + name.slice(-1))
                       .attr('width', width * screenScale)
                       .attr('height', height * screenScale)

                       . //.attr('transform', 'translate(' + (50) + ', ' + (-200) + ')')
                   style('width', (width + "px"))
                       .style('height', (height + "px"))
                       .style('z-index', 100);
                   canvas
                       .node()
                       .getContext('2d')
                       .scale(screenScale, screenScale);

                   // add in an interaction layer as an SVG
                   interactionSvg = visRoot
                       .append('svg')
                       .attr('id', "canvas_root" + name.slice(-1))
                       .attr('width', width)
                       .attr('height', height)
                       .style('position', 'absolute')
                       .style('top', 0)
                       .style('left', 0);
                   // .attr('transform', 'translate(' + (50) + ', ' + (-200) + ')');
                   highlightGroup = interactionSvg.append("g").attr("class", "highlight");

                   x1 = d3.scaleTime().range([0, width - 100]).domain([new Date(2016, 1, 1), new Date(2024, 12, 1)]);
                   y = d3.scaleLinear()
                       .domain([0, 10])
                       .range([0, height - margin.bottom]);
                   var x11 = d3.scaleTime().range([new Date(2016, 1, 1), new Date(2024, 12, 1)]).domain([0, width - 100]);
                   x12 = d3.scaleTime().range([50, width - 50]).domain([new Date(2016, 1, 1), new Date(2024, 12, 1)]);
                   var y11 = d3.scaleLinear().domain([0, height - margin.bottom])
                       .range([0, 10]);
                   line = d3.line()
                       .x(function(d, i) {
                           return d.date + 80;
                       }) // set the x values for the line generator
                       .y(function(d) {
                           return d.value + 10;
                       }) // set the y values for the line generator 
                       .curve(d3.curveMonotoneX) // apply smoothing to the line   

                   var xAxisG = interactionSvg.append('g')
                       .attr('class', 'x')
                       .attr('transform', 'translate(' + margin.left + ', ' + (margin.top + height - margin.bottom) + ')');
                   var yAxisG = interactionSvg.append('g')
                       .attr('class', 'y')
                       .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
                   var xAxis = d3.axisBottom().scale(x1);
                   var yAxis = d3.axisLeft().scale(y);
                   xAxisG.call(xAxis);
                   yAxisG.call(yAxis);
                   var kkk30 = d3.values(translated10);
                   var translated9 = [];
                   for (var r = 0; r < kkk30.length; r++) {
                       translated9.push(kkk30[r]);

                   }
                   var arr = [0., 1.64705882, 2.29411765, 3.94117647, 4.58823529,
                       5.23529412, 7.88235294, 9.52941176, 10.17647059, 13.82352941,
                       20.47058824, 28.11764706, 40, 48.41176471, 60,
                       68.70588235, 80, 100
                   ];

                   colorScale = d3.scaleLinear()
                       .domain(arr)
                       .range(["#000080", "#08306b", "#023858", "#045a8d", "#0570b0", "#2171b5", "#2b8cbe", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c", "#f9d057", "#f29e2e", "#fd8d3c", "#e76818", "#d94801", "#a63603", "#7f2704"]);

                   radScale = d3.scaleLinear()
                       .domain([0, 96])
                       .range([2, 20]);

                   var radScale2 = d3.scaleLinear()
                       .domain([0, 96])
                       .range([3, 22]);
                   var maxes = [];
                   points = [];
                   translated9.map(function(d) {
                       if (typeof d != "undefined") {
                           for (var o = 0; o < d.length; o++) {
                               var temp = {}
                               temp.c = d[o]["c"]; //.replace(" ",""); 
                               temp.end = cust_names[d[o]["c"]][3];
                               temp.start = cust_names[d[o]["c"]][2];
                               temp.life = cust_names[d[o]["c"]][4];
                               temp.sel = 1;
                               temp.sels1 = true;
                               temp["y1"] = d[o]["y"];
                               temp["yr"] = d[o]["yr"];
                               temp["x1"] = d[o]["x"];
                               if (d[o]["x"].toString().indexOf("-") > -1) {
                                   temp.x = x1(new Date(d[o]["x"].toString().split("-")[0], d[o]["x"].toString().split("-")[1], d[o]["x"].toString().split("-")[2])) - 30;
                                   temp.y = y(d[o]["y"]); // + 35;
                               } else {

                                   temp.x = d[o]["x"];
                                   temp.y = d[o]["y"];
                               }
                               temp["o2"] = d[o]["o2"];
                               temp.color = d[o]["color"];
                               temp.st = "rgba(0,0,0,1)";
                               temp.w = 0.15;
                               temp.r = radScale(d[o]["o2"]);
                               temp.r2 = radScale2(d[o]["o2"]);
                               // d.tip="#text";
                               points.push(temp);
                               maxes.push(d[o]["o2"]);

                           }

                       }

                   });
                   var nested_data = d3.nest()
                       .key(function(d) {
                           return d.c;
                       })

                       .
                   sortKeys(d3.ascending)
                       .
                   entries(points);

                   var rels = {};
                   for (var i = 0; i < nested_data.length; i++) {
                       rels[nested_data[i].key] = [];
                       for (var k = 0; k < nested_data[i].values.length; k++) {
                           rels[nested_data[i].key].push({
                               "date": nested_data[i].values[k]["x"],
                               "value": nested_data[i].values[k]["y"],
                               "orders": nested_data[i].values[k]["o2"],
                               "name": nested_data[i].key
                           });
                       }




                   }

                   lines = rels;
                   for (var h = 0; h < d3.values(lines).length; h++) {
                       interactionSvg.append("path")
                           .data([d3.values(lines)[h]]) // 10. Binds data to the line 
                           .attr("class", function(d, i) {
                               return "line line_" + d[i].name.replaceAll(" ", "");
                           }) // Assign a class for styling 
                           .attr("d", line); // 11. Calls the line generator 

                   }
                   // for (var h=0; h<d3.values(lines).length; h++) {
                   //}
                   interactionSvg.append("text")
                       .attr("x", (width / 2))
                       .attr("y", 15)
                       .attr("text-anchor", "middle")
                       .style("font-size", "16px")
                       .style("text-decoration", "underline")
                       .text(tex);
                   var htm = "";

                   for (var t = 0; t < d3.keys(translated10).length; t++) {
                       htm += "  <span class='lab'  onclick='get0((this.textContent || this.innerText))'>" + d3.keys(translated10)[t] + "</span>";

                   }
                   if (tex == "National") {
                       d3.select("#labels").html(htm);

                   }
                   drawPoints1();




               }


               var states = {
                   "AL": "Alaska",
                   "AR": "Arizona",
                   "AK": "Arkansas",
                   "CA": "California",
                   "CO": "Colorado",
                   "CT": "Connecticut",
                   "DE": "Delaware",
                   "FL": "Florida",
                   "GA": "Georgia",
                   "HI": "Hawaii",
                   "ID": "Idaho",
                   "IL": "Illinois",
                   "IN": "Indiana",
                   "IA": "Iowa",
                   "KS": "Kansas",
                   "KY": "Kentucky",
                   "LA": "Louisiana",
                   "ME": "Maine",
                   "MD": "Maryland",
                   "MA": "Massachusetts",
                   "MI": "Michigan",
                   "MN": "Minnesota",
                   "MS": "Mississippi",
                   "MO": "Missouri",
                   "MT": "Montana",
                   "NE": "Nebraska",
                   "NV": "Nevada",
                   "NH": "New Hampshire",
                   "NJ": "New Jersey",
                   "NM": "New Mexico",
                   "NY": "New York",
                   "NC": "North Carolina",
                   "ND": "North Dakota",
                   "OH": "Ohio",
                   "OK": "Oklahoma",
                   "OR": "Oregon",
                   "PA": "Pennsylvania",
                   "RI": "Rhode Island",
                   "SC": "South Carolina",
                   "SD": "South Dakota",
                   "TN": "Tennessee",
                   "TX": "Texas",
                   "UT": "Utah",
                   "VT": "Vermont",
                   "VA": "Virginia",
                   "WA": "Washington",
                   "WV": "West Virginia",
                   "WI": "Wisconsin",
                   "WY": "Wyoming",
                   'US': "USA"
               }

               function add_legend1(name) {
                   var paddingL = 150;
                   var widthL = 520;
                   var innerWidth = widthL - (paddingL * 2);
                   var barHeight = 8;
                   var heightL = 28;

                   var svgL = d3.select("#canvas_root" + name.slice(-1)).append("g").attr("class", "legend").attr("width", widthL).attr("height", heightL);

                   var cols = ['green', 'blue', 'red', 'black'];
                   var labels = ['Acceleration', 'Inflection time', 'Deceleration', 'Deactivation'];
                   var labels2 = ['Local', 'Local', 'Global'];
                   for (var t = 0; t < cols.length; t++) {
                       if (t == 0) {
                           var g = svgL.append("g").attr("transform", "translate(" + (paddingL - 90) + ", 50)");
                       } else {
                           var g = svgL.append("g").attr("transform", "translate(" + (paddingL * (t + 1) - 90) + ", 50)");

                       }

                       g.append('circle')
                           .attr('cx', 10)
                           .attr('cy', 10)
                           .attr('r', 5)
                           .attr('stroke', 'black')
                           .attr('fill', cols[t]);
                       g.append("text")
                       .text(function(d) {
                           return labels[t]
                       });
                   }
               }

               function htmlEntities(str) {
                   return String(str).replaceAll(/&/g, '&amp;').replaceAll('/</g', '&lt;').replaceAll('/>/g', '&gt;').replaceAll('/"/g', '&quot;').replaceAll('/>/g', '&gt;').replaceAll('/x96', '');
               }
               $('#example1').on('click', 'tbody tr', function() {
                   d3.select("#chart4").html("");
                   d3.select("#tree").html("");
                   var row = table.row($(this)).data();
                   //console.log(row);
                   document.getElementById('list').href = row["URL"];
                   id.val(row["ID"]);
                   title.val(row["Title"]);
                   bill_number.val(row["Bill_Number"]);
                   state.val(row["State"]);
                   progress.val(row["Progress"]);
                   url.val(row["URL"]);
                   summary.val(row["Summary"]);
                   active.val(row["active"]);
                   if (typeof row["chems"] != "undefined") {
                       chems.val((row["chems"]).toString().replace("[", "").replace("]", "").replaceAll("'", ""));
                   } else {
                       chems.val("");

                   }
                   description.val(row["description"]);
                   full_text.val(row["full_text"]);
                   last_update.val(row["last_update"]);
                   //nes.val(row["nes"]);

                   if (typeof row["nes"] != "undefined") {
                       nes.val((row["nes"]).toString().replace("[", "").replace("]", "").replaceAll("'", ""));
                   } else {
                       nes.val("");
                   }
                   pg1.val(row["pg1"]);
                   pg2.val(row["pg2"]);
                   rake.val(row["rake"]);
                   dialog.dialog("open");

                   $('#chems').tagator({
                       autocomplete: all,
                       name: 'chems',
                       useDimmer: true,
                       prefix: 'tagator_',
                       height: 'auto',
                       width: window.innerWidth * 0.5,
                       showAllOptionsOnFocus: false
                   });
                   $('#chems').tagator('refresh');

                   $('#nes').tagator({
                       autocomplete: all_nes,
                       name: 'nes',
                       useDimmer: true,
                       prefix: 'tagator_',
                       height: 'auto',
                       width: window.innerWidth * 0.5,
                       showAllOptionsOnFocus: false
                   });

                   $('#nes').tagator('refresh');
                   d3.select("#chart2").html("");
                   d3.select("#chart3").html("");
                   d3.select("#labels").html("");

                   d3.json(states[row["State"]].replaceAll(" ", "_") + "/all_years_shipped_to_final_saturation_final_circles3_Gore_chem1.json", function(one_lines) {
                       d3.json(states[row["State"]].replaceAll(" ", "_") + "/customers_more1_Gore_ners1.json", function(two_recs) {
                           d3.json(states[row["State"]].replaceAll(" ", "_") + "/all_years_shipped_to_final_saturation_final_circles3_Gore_ners1.json", function(one_) {
                               d3.json(states[row["State"]].replaceAll(" ", "_") + "/customers_more1_Gore_chem1.json", function(two_) {
				   var progs3=[];
                                   for (var i = 0; i < d3.keys(one_).length; i++) {
                                       one_lines[d3.keys(one_)[i]] = one_[d3.keys(one_)[i]];
                                   }
                                   for (var i = 0; i < d3.keys(two_).length; i++) {
                                       two_recs[d3.keys(two_)[i]] = ("55," + two_[d3.keys(two_)[i]]).toString().split(",");
                                   }
                                   all_points = one_lines;
                                   cust_names = two_recs;




                                   if (typeof row["chems"] != "undefined" && row["chems"].toString().length > 2) {

                                       // console.log(all_points);
                                       // console.log(cust_names);
                                       var sels = JSON.parse(row["chems"].toString().replaceAll("'", '"'));
                                   } else {
                                       var sels = [];

                                   }

                                   if (typeof row["nes"] != "undefined" && row["nes"].toString().length > 2) {
                                       var sels0 = JSON.parse(row["nes"].toString().replaceAll("'", '"'));
                                       for (var u = 0; u < sels0.length; u++) {
                                           sels.push(htmlEntities(sels0[u]));
                                       }
                                   }

                                   try {
                                       var filtered = Object.keys(all_points).reduce(function(filtered, key) {
                                           if (sels.indexOf(htmlEntities(key)) > -1)
                                               filtered[htmlEntities(key)] = all_points[htmlEntities(key)];
                                           return filtered;
                                       }, {});

                                   } catch (err) {
                                       console.log(err.message);
                                   }
                                   //  console.log(filtered, row["Title"]);

                                   if (filtered == "undefined") {

                                       try {

                                           var filtered = Object.keys(all_points).reduce(function(filtered, key) {
                                               if (sels.indexOf(key) > -1)
                                                   filtered[key] = all_points[key];
                                               return filtered;
                                           }, {});
                                       } catch (err) {
                                           console.log(err.message);
                                       }
                                   }

                                   var DateDiff = {

                                       inDays: function(d1, d2) {
                                           var t2 = d2.getTime();
                                           var t1 = d1.getTime();

                                           return Math.floor((t2 - t1) / (24 * 3600 * 1000));
                                       },

                                       inWeeks: function(d1, d2) {
                                           var t2 = d2.getTime();
                                           var t1 = d1.getTime();

                                           return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
                                       },

                                       inMonths: function(d1, d2) {
                                           var d1Y = d1.getFullYear();
                                           var d2Y = d2.getFullYear();
                                           var d1M = d1.getMonth();
                                           var d2M = d2.getMonth();

                                           return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
                                       },

                                       inYears: function(d1, d2) {
                                           return d2.getFullYear() - d1.getFullYear();
                                       }
                                   }

                                   //console.log(1, row);
                                   if ((typeof row["chems"] != "undefined" && row["chems"].toString().length > 2) || (typeof row["nes"] != "undefined" && row["nes"].toString().length > 2)) {
                                       //highlightGroup.html("");
                                       make_plot(filtered, "chart2", row["State"]);
                                       add_legend1("chart2");
                                   }
                                   var tims = [];
                                   //var progs3 = [];
                                   //console.log(2, row);
                                   d3.json("individual/terms_" + row["id0"].toString() + ".json", function(chem_lines) {
                                       console.log(chem_lines);
                                       var filtered2 = chem_lines;
                                       /*Object.keys(chem_lines).reduce(function (filtered, key) {
                                           if (sels.indexOf(htmlEntities(key))>-1) filtered[htmlEntities(key)] = chem_lines[htmlEntities(key)];
                                           return filtered;
                                       }, {}); */
                                       make_plot(filtered2, "chart3", "National");
                                       //tooltip2.html("");
                                       add_legend1("chart3");
                                       var progs = JSON.parse(row["progress2"].replaceAll("'", '"'));
                                       var progs2 = [];
                                       //var progs3=[];
                                       // var tims=[];
                                       var events = {
                                           1: "Introduced",
                                           2: "Engrossed",
                                           3: "Enrolled",
                                           4: "Passed",
                                           5: "Vetoed",
                                           6: "Failed/Dead",
                                           7: "Veto Override",
                                           8: "Chapter/Act/Statute",
                                           9: "Committee Referral",
                                           10: "Committee Report Pass",
                                           11: "Committee Report DNP"
                                       }
                                       progs.map(function(d) {
                                           if ([8, 9, 10, 11].indexOf(d.event) == -1) {
                                               progs2.push(events[d.event]);
                                               progs3.push(d.event);
                                               tims.push(d.date);
                                           }
                                       });
                                       //d3.csv("leila_predictions.csv", function(preds) {     
                                       d3.select("#chart4").html("");
                                       //d3.select("#chart4").html("["+progs2.toString().replaceAll('"',"").replaceAll(",",", ")+"]"+row["progress2"].toString()+events[row["Progress"]]);   
                                       var new_terms = [];
                                       var new_terms0 = JSON.parse(row["progress2"].toString().replaceAll("'", '"'));
                                       new_terms = new_terms0.map(function(g) {
                                           g.event = events[g.event];
                                           return g;
                                       });
                                       //    preds.map(function(f){ if(f["Bill Statues"]=="["+progs2.toString().replaceAll('"',"").replaceAll(",",", ")+"]") {

                                       d3.select("#chart4").html("<b>Progress</b>: " + JSON.stringify(new_terms) + "<br><b>Pattern</b>: " + progs2.toString());




                                   });

                                   if (tims.length > 2) {
                                       //var td = tims[tims.length - 1].split("-");
                                       //var d1 = new Date(+td[0], +td[1], +td[2]);
                                       //var d2 = new Date();
                                       plot_tree(progs3, 0);//DateDiff.inDays(d1, d2));
                                   } else {
                                       plot_tree(progs3, 0);
                                   }




                               });
                           });
                       });
                   });
               });

               table.columns.adjust().draw();

           });

       });


   });

   function get0(e) {

       //alert(e);
       d3.selectAll(".line").classed('line2', false);
       d3.selectAll(".cir").attr('r', function(d) {
           return d.r;
       });
       d3.selectAll(".cir_" + e.replaceAll(" ", "")).attr('r', function(d) {
           return d.r * 5;
       });
       d3.selectAll(".line_" + e.replaceAll(" ", "")).classed('line2', true);

   }

   //]]>
