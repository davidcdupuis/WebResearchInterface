/* ------ DESCRIPTION ------
  Properties of the graph:
  BASIC:
    ✓ Graph represents all papers and relationships in RTB research
    ✓ Graph is force dynamic
    ✓ Nodes are coloured by publishing year
    ✓ Graph is draggable
    ✓ Graph is zoomable
    ✓ Graph is made of concentric circles where most recent year is in the middle and latest outside
    ~ Hovering over a Node will display it's tooltip: title, year, authors, saved, printed
    - Clicking a node will allow to visualize it's direct connections
    - Special click on a node will open an information menu about the node

  ADVANCED:
    - Display papers graph
    - Display authors graph
    - Display thesis graph
    - Search for paper based on info: id, title, author, year, ...
    - Add new paper to graph and modify and save JSON file
    - Open PDF File in new Tab
    - Filter nodes by tags, authors, year, ...

  Ressources:
  - http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/
*/


// ----- GLOBAL VARIABLES ------
var w = window.innerWidth;
var h = window.innerHeight;

var currYear = 2016;

var svg = d3.select("body").append("svg")
                           .attr("width",w)
                           .attr("height",h)
                           .style("cursor","move")
                           .style("background-color","black");
var g = svg.append("g");

// NODE COLORS
var color = d3.scaleOrdinal(d3.schemeCategory20);


// FORCE SIMULATION

var simulation = d3.forceSimulation()
                    .force("link", d3.forceLink().id(function(d) { return d.id; }))
                    .force("charge", d3.forceManyBody().strength(-2000))
                    .force("center", d3.forceCenter(w / 2, h / 2))
                    .force("collide", d3.forceCollide(100));

// ZOOM PARAMETERS
var min_zoom = 0.05;
var max_zoom = 7;
var zoom = d3.zoom()
              .scaleExtent([min_zoom,max_zoom])
              .on("zoom", zoomed);
svg.call(zoom);
var transform = d3.zoomIdentity
                  .translate(w / 6, h / 6)
                  .scale(0.5);

svg.call(zoom.transform, transform);

// BASIC NODE SIZE
var nominal_stroke = 1;
var nominal_node_size = 10;

// GRAPH VARIABLES
var cx = w/2;
var cy = h/2;

// HIGHLIGHT VARIABLES
var focus_node = null,
    highlight_node = null;
var highlight_color = "blue";
var highlight_trans = 0.1;

// ----- GLOBAL FUNCTIONS -----

function dragStart(d){
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragging(d){
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragEnd(d){
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function zoomed() {
  g.attr("transform", d3.event.transform);
  // Manually offsets the zoom to compensate for the initial position. Should get fixed asap or the position variables made global.
  //svg.attr("transform", "translate(" + (d3.event.transform.x + 400) + "," + (d3.event.transform.y + 325) + ")scale(" +  d3.event.transform.k + ")");
}

function isInList(el, list){
  for (var i = 0; i < list.length; i++){
    if (el == list[i]) return true;
  }
  return false;
}

// builds a graph dictionary based on paper references
function referencesGraph(file_data){
  var nodes = [];
  var links = [];

  // we use these to add nodes to references that are missing as nodes
  var node_ids = [];
  var ref_ids = [];

  // for each paper in graph create a node and append result to node list
  for (var i = 0; i < file_data.length; i++ ){
    var node = {
      "id":file_data[i].id,
      "title":file_data[i].title,
      "year":file_data[i].year,
      "authors":file_data[i].authors,
      "read":file_data[i].read,
      "saved":file_data[i].saved,
      "printed":file_data[i].printed,
      "problematic":file_data[i].problematic,
      "solution":file_data[i].solution
    };

    node_ids.push(file_data[i].id);
    nodes.push(node);

    // for each referenced paper in graph create a link and append result to link list
    for (var j = 0; j < file_data[i].references.length; j++){
      var link = {
        "source":file_data[i].id,
        "target":file_data[i].references[j]
      };

      ref_ids.push(file_data[i].references[j]);
      links.push(link);
    }
  }

  //check if all referenced elements have a node associated
  for (var i = 0; i < ref_ids.length; i++){
    if (!isInList(ref_ids[i],node_ids)){
      var node = {
        "id":ref_ids[i],
        "title":ref_ids[i],
        "year":""
      }

      nodes.push(node);
    }
  }

  var graph = {
    "nodes":nodes,
    "links":links
  };
  return graph;
}

// builds a graph dictionary based on author collaboration
function authorsGraph(data){

}

//optional function
function drawCircles(){
  for(var i=0; i < 20; i++){
    var radius = (i + 1) * 80;
    g.append("circle").attr("cx",cx).attr("cy",cy).attr("r", radius ).style("stroke","gray").style("fill","none");
  }
}

//Toggle stores whether the highlighting is on
var toggle = 0;
//Create an array logging what is connected to what
var linkedByIndex = {};

//This function looks up whether a pair are neighbours
function neighboring(a, b) {
    return linkedByIndex[a.index + "," + b.index];
}

function connectedNodes() {
    if (toggle == 0) {
        //Reduce the opacity of all but the neighbouring nodes
        d = d3.select(this).node().__data__;
        node.style("opacity", function (o) {
            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
        });
        link.style("opacity", function (o) {
            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
        });
        //Reduce the op
        toggle = 1;
    } else {
        //Put them back to opacity=1
        node.style("opacity", 1);
        link.style("opacity", 1);
        toggle = 0;
    }
}

// ----- MANAGE JSON DATA -----
d3.json("data/data.json",function(error,graph){
  if (error) throw error;

  // Read the JSON data and create a dictionary of nodes and links based on references
  var paper_graph_data = referencesGraph(graph.papers);

  //var authors_graph_data; //function not implemented yet

  // INITIALIZE THE LINKS
  var link = g.append("g")
                .attr("class","links")
                .selectAll("line")
                .data(paper_graph_data.links)
                .enter()
                .append("line")
                .attr("stroke-width",function(d){return nominal_stroke})


  for (i = 0; i < paper_graph_data.nodes.length; i++) {
      linkedByIndex[i + "," + i] = 1;
  };

  paper_graph_data.links.forEach(function (d) {
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
  });
  /* FUNCTION THAT CREATES DIV ELEMENT TO HOLD NODE INFORMATION
    [              PAPER TITLE              ]
    [ PUBLISHING YEAR ][    PERSONAL RATING ]
    [           AUTHORS & LINKS             ]
    [             PROBLEMATIC               ]
    [              SOLUTION                 ]
                              [OPEN PDF FILE]
  */
  var div = d3.select("body").append("div")
                             .attr("class", "tooltip")
                             .style("opacity", 0);

  function createTooltip(d){
    //get node data, manage missing values
    div.transition()
        .duration(200)
        .style("opacity", .9);

    div.html("<table><tr><td colspan='3'>" + d.title + "</td></tr>" +
                    "<tr><td>" + d.year + "</td><td id='saved'> saved </td><td id='printed'> printed </tr>" +
                    "<tr><td id='authors' colspan='3'></td></tr></table>")
       .style("left", d3.event.pageX + "px")
       .style("top", d3.event.pageY + "px")
       .style("background-color",function(){
         if(d.read == "yes")
          return "green";
         else if(typeof d.problematic != "undefined" && typeof d.solution != "undefined"){
           return "orange";
         }
         else {
          return null;
        }
        });

    div.select('#authors').text(function(){
      result = "";
      if (typeof d.authors != "undefined"){
        for (var i = 0 ; i < d.authors.length - 1; i++){
          result += d.authors[i] + ", ";
        }
        result += d.authors[d.authors.length - 1];
        return result;
      } else {
        return "--> authors not added <--";
      }

    });

    div.select('#saved').style('background-color',function(){
      if (d.saved == "yes"){
        return "green";
      }else{
        return "red";
      }
    });

    div.select('#printed').style('background-color',function(){
      if (d.printed == "yes"){
        return "green";
      }else{
        return "red";
      }
    });
  }

  //drawCircles();

  // INITIALIZE THE NODES
  var node = g.append("g")
                .attr("class","nodes")
                .selectAll("circles")
                .data(paper_graph_data.nodes)
                .enter()
                .append("circle")
                .attr("r",nominal_node_size)
                .attr("fill",function(d){
                  if (d.year !== "")
                    return color(d.year);
                  else
                    return "black";
                })
                .style("cursor","pointer")
                .on("mouseover",createTooltip)
                .on("mouseout",function(d){
                  div.transition()
                     .duration(500)
                     .style("opacity", 0);

                })
                .on('dblclick',connectedNodes)
                .call(d3.drag()
                        .on("start", dragStart)
                        .on("drag", dragging)
                        .on("end", dragEnd));

  simulation.nodes(paper_graph_data.nodes)
            .on("tick",annulus_ticked);

  simulation.force("link")
            .links(paper_graph_data.links);

  function getY(year){
    if(year !== ""){
      var multiplier = Math.abs(parseInt(year)-currYear);
      var separator = 30;
      return (multiplier + 1) * separator;
    } else {
      return 2010;
    }
  }

  //function returns small and big radiuses of annulus based on Point year
  function getAnnulus(year){
    var big_radius;
    var separator = 200;
    if(year !== ""){
      var multiplier = Math.abs(parseInt(year) - currYear);
      big_radius = (multiplier + 1) * separator;
    } else {
      big_radius = 2010;
    }
    return [big_radius - separator, big_radius];
  }

  //function to verify if X in the correct position
  function verifyPosition(x, y, small_r,big_r){
    var point;
    //verify if P is in annulus defined by small_r and big_r
    if ( (Math.pow(x - cx,2) + Math.pow(y - cy, 2)) <= Math.pow(small_r,2) ){
      // P inside small circle
      point = recalculateP(x, y, small_r);
    } else if ( (Math.pow(x - cx, 2) + Math.pow(y - cy, 2)) > Math.pow(big_r,2)){
      // P outside big circle
      point = recalculateP(x, y, big_r);
    } else {
      point = [x,y];
    }
    return point;
  }

  //places point off circle on circle ring
  function recalculateP(x, y, r){
    var vx = x - cx;
    var vy = y - cy;
    var norm = Math.sqrt(Math.pow(vx,2)+ Math.pow(vy,2));
    var new_x = cx + vx / norm * r;
    var new_y = cy + vy / norm * r;
    return [new_x,new_y];
  }

  // function to return link and node position when simulation is generated
  function ticked(){
    // Each year is placed on a different level to get chronological order of paper network

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }

  function annulus_ticked(){
    node
        .attr("cx", function(d){
          var annulus = getAnnulus(d.year);
          var position = verifyPosition(d.x, d.y, annulus[0], annulus[1]);
          d.x = position[0];
          return d.x;
        })
        .attr("cy", function(d){
          var annulus = getAnnulus(d.year);
          var position = verifyPosition(d.x, d.y, annulus[0], annulus[1]);
          d.y = position[1];
          return d.y;
        });

    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }

  function pythag(r, b, coord) {
    r += nodeBaseRad;

    // force use of b coord that exists in circle to avoid sqrt(x<0)
    b = Math.min(w - r - strokeWidth, Math.max(r + strokeWidth, b));

    var b2 = Math.pow((b - radius), 2),
        a = Math.sqrt(hyp2 - b2);

    // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
    coord = Math.max(radius - a + r + strokeWidth,
                Math.min(a + radius - r - strokeWidth, coord));

    return coord;
}

});
