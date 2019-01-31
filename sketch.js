// --- Configuration --- //
const xLim = [-4,4]; // Each integer value represents its own line on the graph.
const yLim = [-1,1]; // The origin will always be placed at 0,0; and will prefer the lower bound for tie breaks.
const dims = [500,500]; // The dimension in pixels of the canvas
const filename = "graph"; // The image file name is saved
const backgroundColor = "black"; // The background of the graph
const majorGridLineColor = 200; // The color of the axis
const minorGridLineColor = 50; // The color of the grid lines
const textColor = 200; // The color of the numbers on the graph
const textSz = 15; // The size of the numbers on the graph
const textOffset = [-4,18]; // The position of the numbers on the graph, [-4,18] represents 18px below the x axis, and -4 pixels aligns with the minor grid lines.
// -------------------- //
let button;
let canv;

let sigma = 1.458285942;
let mean = 0;

// --- Function and Vector Declaration --- //
// ------------- Vectors ------------------
//let x = new Vector([0,1,2,3]);

// ----------- Scatter Plots --------------

// --------- Plain Functions --------------
// -------------------------------------- //
function setup() {

  // Create the grid lines

  //stroke("blue");
  //drawVector(a,origin); // Draw 'a' at the origin

  //stroke("green");
  //drawVector(b,toCoords(a)); // Draw 'b' at 'a'

  //stroke("yellow");
  //drawVector(c,origin); // Draw 'c' (a+b) at the origin

  //stroke("pink");
  //scatter(points); // Draw the scatter plot

  //stroke("red");
 // Graph the function, where 2,5,1 represents amplitude, angular frequency, and y-offset respectively.
}
