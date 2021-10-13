let Q = 2;
let stamnum = 0;
let particles = [];
let bx;
let by;
let petalcenter;
let petalcount = 0;
let startframe = 0;
let flID = 0;
let NZ = 0;
let NZR = 0;

function setup() {
  colorMode(HSL);
  createCanvas(windowHeight * 1.5, windowHeight);
  noFill();
  strokeWeight(bx / 8);
  bx = width / 100;
  by = height / 100;
  randomHash();
  hashDecode();
  background(hu % 360, 100, 4);
  a = a.map(x => x * by);
  n = n.map(x => x * by);
  n1 = n1.map(x => x * by);
}

function draw() {
  if (TYPE != 4) drawbg(2000 * Q);
  push();
  translate(translation[0] * bx, translation[1] * by);
  if (layers[flID] != null) drawflower(layers[flID]);
//  glare();
  if (layers[flID] == null && maxstamen > 0) drawstamen(); 
  pop();
  if (layers[flID] == null && maxstamen == 0) signature(startframe);
}