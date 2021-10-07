let Q = 2;
let stamnum = 0;
let particles = [];
let bx;
let by;
let petalcenter;
let petalcount = 0;
let stamens = [];
let startframe = 0;
let flID = 0;
let NZ = 0;
//let closed;//!?
//let center = false;//!?
//let wr = 0; 
//let wl = 0; 
// let LSadd = 1; 
// let LL;
// let sw;
 let st;

function setup() {
  strokeCap(SQUARE)
  colorMode(HSL);
  createCanvas(windowHeight * 1.5, windowHeight);
  noFill();
  strokeWeight(bx / 8);
  bx = width / 100;
  by = height / 100;
  randomHash();
  hashDecode();
  background(hu, 100, 4);
}

function draw() {
  if (LSadd != 4) drawbg(200 * Q);
  glare();
  push();
  translate(translation[0] * bx, translation[1] * by);
  if (layers[flID] != null) drawflower(layers[flID]);
  if (layers[flID] == null && st == null) 
  st = drawstamen();
  pop();

  if (layers[flID] == null && st != null) signature(st);
}