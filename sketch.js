let inc = 0.05;
let offset = 0;
let n;
let width = 300;
let height = 300;
let worldMap;
let img;
let detail = 2;
let highResImg;
let highresMap;
var mapOffset;
var simulation;
function setup() {
  //noiseSeed(2);
  canvasW = min(windowWidth - 200, windowHeight);
  canvasH = canvasW;
  width = windowWidth;
  //width = windowHeight;
  height = windowHeight;
  var cnv = createCanvas(canvasW, canvasH);
  cnv.parent("canvas-holder");
  frameRate(60);
  noStroke();
  mapOffset = createVector(0, 0);
  mapMove = createVector(0, 0);
  mapZoom = 1;
  _pixelDensity = 1;
  pixelDensity(1);
  d = pixelDensity();
  height *= d;
  width *= d;
  simulation = new Simulation({
    map_limit: 1000, //limit on longest side (length or width) of the map
    canvas_size: { x: canvasW, y: canvasH },
  });
  /*view_handler = new ViewHandler({
    map_size: {
      x: width,
      y: height,
    },
  });*/
}

function draw() {
  //console.log(humans[0].stamina);
  background("rgb(50,50,100)");
  simulation.draw_map();
  /*image(
    img,
    mapOffset.x,
    mapOffset.y,
    windowWidth * mapZoom,
    windowHeight * mapZoom
  );*/
  //if (updating == false)
  //image(highResImg, mapOffset.x, mapOffset.y, windowWidth, windowHeight);
  //mapOffset.x += mapMove.x * mapZoom;
  //mapOffset.y += mapMove.y * mapZoom;
  /*mapOffset.x = -map(
    mouseX,
    0,
    windowWidth,
    0,
    (width * mapZoom) / detail - windowWidth
  );
  mapOffset.y = -map(
    mouseY,
    0,
    windowHeight,
    0,
    (height * mapZoom) / detail - windowHeight
  );*/
  //drawCreatures();
  ellipse(mouseX, mouseY, 10, 10);
  //console.log(worldMap.height[Math.floor(mouseX)][Math.floor(mouseY)]);
  //showDebug();
  //console.log(humans);
  //noLoop();
}

/*function showDebug() {
  let closestDist = Infinity;
  let closest;
  let x;
  for (let i = 0; i < humans.length; i++) {
    x = distPts(mouseX, mouseY, humans[i].pos.x, humans[i].pos.y);
    if (x < closestDist) {
      closestDist = x;
      closest = humans[i];
    }
  }
  closest.debugInfo();
  return closest;
}*/

function mouseClicked() {
  //var human = showDebug();
  //console.log(human);
}
function distPts(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
