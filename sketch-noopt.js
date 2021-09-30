/* project with auto resizing, adjustable Q
 TODO
 */
//hash "0x11ac128f8b54949c12d04102cfc01960fc496813cbc3495bf77aeed738579738"

//settings//
let maxstamen = 6;
let Q = 1; //whole numbers only
let layers = [{
    petals: 5,
    R: 130,
    //     rotation: 6, 
    t2R: 2,
    t3R: 2,
    t2home: 2,
    t3home: 1.5
  },

];
let hu; //hue of color per HSB
let translation = [80, 80]; // 2 coordinates 0 to 100% translation



//not configs//
let stamnum = 0;
let particles = [];
let bx;
let by;
let petalcenter;
let petalcount = 0;
let stamens = [];
let endframe;
let startframe = 0;
let flID = 0;
let b = 0;
let NZ = 0; 
let closed;
let wr = 0; //right petal width trim
let wl = 0; //left petal width trim
let LSadd = 1; //speed of gradient
let DEBUG = 0;
//let IR;
let LL;
let center = false;
let TYPE;

function setup() {
  colorMode(HSL);
  hu = random(360);
  createCanvas(windowHeight * 1.5, windowHeight);

 // noFill();
  strokeWeight(bx/8);
  bx = width / 100;
  by = height / 100;
  randomHash();
  hashDecode();
  endframe = layers[0].petals * layers[0].R * Q;
  background(hu, 100, 4);
  //  background("white")
}

function draw() {

  //draw shades
if (TYPE != 4)  drawbg(200 * Q);

  push();
  translate(translation[0] * bx, translation[1] * by);
  home = createVector((50 - translation[0]) * bx, (50 - translation[1]) * by);
  home.lerp(0, 0, 0, 0.5);

  //draw flower
  if (frameCount <= endframe) {
    drawflower(layers[flID]);
  } else {
    flID++;
    if (layers[flID] != null) {
      startframe = endframe;
      endframe += layers[flID].petals * layers[flID].R * Q;
    }
  }
 
  //draw stamen
  if (frameCount > endframe && a !== true) a = drawstamen();
  pop();

  //draw signature
  if (frameCount > endframe + 300) signature(endframe + 300);
}