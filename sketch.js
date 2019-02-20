// --- Configuration --- //
const xLim = [-4,4]; // Each integer value represents its own line on the graph.
const yLim = [-1,1]; // The origin will always be placed at 0,0; and will prefer the lower bound for tie breaks.
const dims = [800,600]; // The dimension in pixels of the canvas
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
let mu1 = 100;

const HorizDotLine = (y,end) => {
  let prevPointy = 50;
  let count = 0;
  while(prevPointy < end){
    if(count==0) nextPointy = prevPointy;
    else nextPointy = prevPointy+15;
    if(nextPointy > end) break;
    line(prevPointy,y,nextPointy,y);
    prevPointy = nextPointy+5;
    count++;
  }
  line(prevPointy,y,end,y);
}
const VertiDotLine = (x,end) => {
  let prevPointx = 550;
  let count = 0;
  while(prevPointx > end){
    if(count==0) nextPointx = prevPointx;
    else nextPointx = prevPointx-15;
    if(nextPointx < end) break;
    line(x,prevPointx,x,nextPointx);
    prevPointx = nextPointx-5;
    count++;
  }
  line(x,prevPointx,x,end);
}

// --- Function and Vector Declaration --- //
// ------------- Vectors ------------------
//let x = new Vector([0,1,2,3]);

// ----------- Scatter Plots --------------

// --------- Plain Functions --------------
// -------------------------------------- //
function setup() {
  canv = createCanvas(800,600);
  button = createButton('Save Image');
  button.position(50,dims[1] + 25);
  button.attribute("onclick","saveImage()");

  background(color('rgba(169,169,169,.5)'));
  textSize(18);
  stroke(0);
  fill(0);
  line(50,550,750,550);
  triangle(750,545,750,555,760,550);
  line(50,50,50,550);
  triangle(45,50,55,50,50,40);
  text("x2",45,25);
  text("x1",769,555);

  HorizDotLine(300,300);
  VertiDotLine(300,300);


  text("0",295,575);
  text("2",30,305);




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
