// --- Supporting Functions --- //
// - Dynamically Sets the origin depending on the dimensions of the canvas and the limits on x and y -
const origin = [(dims[0]/(xLim[1]-xLim[0]))*Math.abs(xLim[0]),(dims[1]/(yLim[1]-yLim[0]))*Math.abs(yLim[1])];
// - Converts unit lengths to pixel lengths based on the dimensions of the canvas, and the limits on x and y -
const toCoords = mat => [map(mat.plain[0],xLim[0],xLim[1],0,dims[0]),map(mat.plain[1],yLim[0],yLim[1],dims[1],0)];
// - Draws vectors (1d matricies with two entries) to the canvas -
const drawVector = (mat,initPt) => line(initPt[0],initPt[1],toCoords(mat)[0]+(initPt[0]-origin[0]),toCoords(mat)[1]+(initPt[1]-origin[1]));
// - Saves the canvas to a PNG file -
const saveImage = () => {
  saveCanvas(canv,filename,'png');
}
// - Graphs a function -
const graph = (f,...args) => {
  for(let i=xLim[0];i<xLim[1];i+=.001){
    point(map(i,xLim[0],xLim[1],0,dims[0]),map(f(i,args),yLim[0],yLim[1],dims[1],0));
  }
}
// - Graphs the vectors (1d matricies with two entries) as points who are contained in an array arr -
const scatter = arr => {
  arr.forEach((c,i) => ellipse(toCoords(c)[0],toCoords(c)[1],3,3));
}
// - Support function to redraw the grid lines and labels -
const createGraph = () => {
  background(backgroundColor);
  stroke(minorGridLineColor);
  fill(textColor);
  textSize(textSz);
  for(let i=0;i<xLim[1]-xLim[0];i++){
    line(i*(dims[0]/(xLim[1]-xLim[0])),0,i*(dims[0]/(xLim[1]-xLim[0])),dims[1]);
    if(i>0) text(i+xLim[0],i*(dims[0]/(xLim[1]-xLim[0]))+ textOffset[0],origin[1]+textOffset[1]);
  }
  for(let i=0;i<yLim[1]-yLim[0];i++){
    line(0,i*(dims[1]/(yLim[1]-yLim[0])),dims[1],i*(dims[1]/(yLim[1]-yLim[0])));
  }
  stroke(majorGridLineColor);
  line(origin[0],0,origin[0],dims[0]);
  line(0,origin[1],dims[1],origin[1]);
}
