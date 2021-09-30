//"0x11ac128f8b54949c12d04102cfc01960fc496813cbc3495bf77aeed738579738"

function randomHash() {
  let x = "0123456789abcdef",
    hash = "0x";
  for (let i = 64; i > 0; --i) {
    hash += x[Math.floor(Math.random() * x.length)];
  }
  return hash;
}

tokenData = {
  hash: randomHash(),
//  hash: "0x8cecf536aafacb27a86e7e9b79647b2bbcce452a94700ce7c9e7a65b82e88518",
  tokenId: "123000456",
};


function hashDecode() {
  //  let seed = parseInt(tokenData.hash.slice(0, 16), 16);

  //hash to array//
  let p = [];
  for (let i = 0; i < 64; i += 2) {
    p.push(tokenData.hash.slice(i + 2, i + 4));
  }
  let rns = p.map((x) => {
    return (parseInt(x, 16) % 10) + 1;
  });
  //  rns = rns.map((x) => x + 1);
  console.log(tokenData.hash);
  console.log(rns);
  assign(rns);
}

function assign(rns) {
  //DEFINE TYPE// [0], 0 - 2
  TYPE = rns[31] % 3;

  //testing// //2 ok, 0 ok, 1 ok, 3 witj issues,4
  TYPE = 4;

  //set parameters//
  let prms = [{
      //TYPE 0 hrizantem// 4-7 layers, central translation, thin petals, //!!blackness to be high
      layers: [4, 7],
      petals: [6, 10],
      //        R: "25 * bx", //0.8 for the rest
      t23RH: [1.8, 1.5, 1.5, 1.5], //2r, 3r, 2h, 3h //any ok
      //     t23RHadd: 0.2, //noised, so divided by 2 //?? range of change, not needed?
      stamen: true, //!!stamens needed or closed center. different stamen type// 0 no, 1 yes short, 2 yes long
      center: true,
      pointy: 0, //0 false, 1 true for all, 2 random
      //      width: [-0.3, 0.3],//positive counter, negative clock, +- small, -+ wide
      Rdif: 0.7,
      closed: true,
    },
    {
      //TYPE 1 open flower// high p3, all petal width is the same petals if inside R is big
      layers: [3, 4],
      petals: [4, 7],
      //        R: "25 * bx", //0.8 for the rest
      t23RH: [1.3, 1.5, 1.5], // any ok
      //     t23RHadd: 0.6,
      stamen: true, //0 if small R
      center: "",
      pointy: 2,
      //      width: [-0.3, -0.3],
      Rdif: 0.7
    },
    {
      //TYPE 2 pointy petals, many layers, small difference, inside swirl, big LSadd around 1.5-2
      layers: [8, 12], //3
      petals: [8, 15], //10
      //        R: "25 * bx", //0.8 for the rest
      t23RH: [1, 1, 1.5], //[1.5, 1.3, 1.3, 1.3], any radius from 1 to 1.5
      //      t23RHadd: 0,
      stamen: false, //0 if small R
      center: "",
      //      width: [-0.2, 0.2],
      pointy: 1,
      Rdif: 0.85
    },
    {
      //TYPE 3 mixed petal relations, 2-3 layers, big difference in Res and big home //!! ok, but problem with last petal overlap//!! problem with stamens with 3 layers - too short
      layers: [3, 5], //3
      petals: [8, 15], //10
      //        R: "25 * bx", //0.8 for the rest
      t23RH: [0.7, 1.5, 2], // need shape
      //      t23RHadd: 2,
      stamen: true, //0 if small R
      center: "",
      //      width: [-0.2, 0.2],
      pointy: 0,
      Rdif: 0.6,
      LS: [1,-10]
    },
    {
      //TYPE 4 moonflower, big radius, big translation, big transparency,
      layers: [3, 5], //3-5
      petals: [5, 15], //5-15
      //        R: "25 * bx", //0.8 for the rest
      t23RH: [2, 2.5, 4], // need shape
      //      t23RHadd: 2,
      stamen: true, //0 if small R
      center: "",
      //      width: [-0.2, 0.2],
      pointy: 0,
      Rdif: 0.6,
      closed: true,
    },
  ];

  //GENERAL SETUP//
  //9,10// HSB color hue
  hu = (rns[9] * rns[10] * rns[11]) % 360;

  //11,12// noiseseed
  noiseSeed(rns[11] * rns[12]);

  //12// maxstamen
  maxstamen = prms[TYPE].stamen ? rns[12] * 2 + 10 : 0; // no stamen if [0] < 1
  center = prms[TYPE].center;

  //12,13// 2 coordinates 20 to 80% translation
  translation = prms[TYPE].center ? [40 + rns[12] * 2, 50 + rns[13]] : [10 + rns[12] * 8, 55 + rns[13] * 3];
  if (TYPE == 4) translation = [50, 140];
//  translation = [80,45]

  //14// gradient intensity
   LSadd = map(rns[14], 1, 10, 0.9, 2) 
 // LSadd = 2
    LSadd = 2

  //15,16// petal width
  // wr = map(rns[15], 1, 10, prms[TYPE].width[0], prms[TYPE].width[1]);
  // wl = map(rns[16], 1, 10, prms[TYPE].width[0], prms[TYPE].width[1]);
  wr = map(rns[15], 1, 10, -0.2, 0.2);
  wl = map(rns[16], 1, 10, -0.2, 0.2);
  wr = -0.3;
  wl = 0.3;

  //layers// [0], max 5
  let y = floor(map(rns[0], 1, 10, prms[TYPE].layers[0], prms[TYPE].layers[1]));
  layers = Array.from({
    length: y
  }, () => ({}));
  let i = layers.length - 1;
  LL = layers[i];

  //petals// [0-6]
  for (i = 0; i < y; i++) {
    layers[i].petals = floor(
      map(rns[i], 1, 10, prms[TYPE].petals[0], prms[TYPE].petals[1])
    ); //[i]
    layers[i].R =
      i == 0 ?
      floor(rns[i] * 2 + 24 * bx) :
      floor(layers[i - 1].R * prms[TYPE].Rdif + rns[i] - i * 2); //[i+1], 20-22bx - 3.3bx on 5th layer

    // //randomized//
    // layers[i].t2R = map(rns[11], 1, 10, 1.1, 2) ;//random 23RH, 1.1-2
    // layers[i].t3R = map(rns[12], 1, 10, 1.5, 2) ;//1.5-2
    // layers[i].thome = map(rns[13], 1, 10, 1.1, 2); //1.1-2

    //set//
    layers[i].t2R = prms[TYPE].t23RH[0] * layers[i].R + 0 //nz() * prms[TYPE].t23RHadd;
    layers[i].t3R = prms[TYPE].t23RH[1] * layers[i].R + 0 //nz() * prms[TYPE].t23RHadd;
    layers[i].thome = prms[TYPE].t23RH[2]; //nz() * prms[TYPE].t23RHadd;

    if (prms[TYPE].pointy == 2 && rns[i + 1] > 5) layers[i].pointy = true;
    if (prms[TYPE].pointy == 1) layers[i].pointy = true;
  }

  // ADDITIONAL FEATURES//
  //11<1// closed center - //!!problem drawing
  if (TYPE == 2 || TYPE == 4 ) {
 //   LL.t3R /=3;
    LL.closed = true;
 //   maxstamen = 0;
    console.log("closed center");
  }

  //int radius for stamens// 

  //IR = (layers[LL].R);


  //console//
  console.log("TYPE " + TYPE);
  console.log("prms");
  console.log(prms);
  console.log("hue " + hu);
  console.log("maxstamen " + maxstamen);
  console.log("translation " + translation);
  console.log("LSadd " + LSadd);
  console.log("petalwidth wr" + wr + "; wl" + wl);
  console.log(layers);
 // console.log("IR " + IR);
}

function nz() {
  NZ++;
  return noise(NZ);
}

// //5// layers swirling 0.3 .. -0.3;
// s = map(rns[5], 1, 10, -0.05 * bx, 0.05 * bx);
// console.log("s " + s);

/*
  //0// number of layers (min 2, max 5)
  x = (rns[0] % 3) + 2;
  layers = Array.from({ length: x }, () => ({
    petals: "",
    R: "",
    rotation: "",
    t2R: "",
    t3R: "",
    t2home: "",
    t3home: "",
  }));
  //1...3*layers// layers specs (petals 3-12 R whole numbers 30-500). Sort by biggest R
  for (i = 0; i < x; i++) {
    layers[i].petals = rns[1 + 6 * i] + 2;
    layers[i].R = floor((rns[2 + 8 * i] + 20) * bx);
    layers[i].rotation = rns[3 + 6 * i];
    layers[i].t2R = map(rns[5 + 5 * i], 1, 10, 1, 2);
    layers[i].t3R = map(rns[6 + 5 * i], 1, 10, 1, 3);
    layers[i].t2home = map(rns[7 + 5 * i], 1, 10, 1, 2);
    layers[i].t3home = map(rns[8 + 5 * i], 1, 10, 1, 3);
  }
  layers.sort((a, b) => b.R - a.R);


*/

/*
rules:
small R limitations
small petals on outside layers - with big R
t3r on lower levels means smaller Res on higher levels
t3 of inside layers must not be lower than t3 of outside. difference must be significant.
small R layers may get too thin and be black
? high home distance for bigger t3 Res
!! on wider Res stamens must have more visibility
t2home < t3home on small Res
to limit min Res


TYPE 5 rose, overlap -0.3,0.3, more petals, closed,more transparency, swirl
TYPE 6 long thin pointy

pointed petals - p3 one point
quality relative to bx/by?

wr  -   wl
-0.2    -0.2  swirl
0.2     0.2   swirl
-0.2    0.2   overlap
0.2     -0.2  too thin, careful

same offset start for different swirls:
100% offset = wl > -wr ? wl + mid : wr + mid //ranges 0.7-0.3
100% offset / angle-mid = current offset // ranges 1-0

small radius + big translation = harsh gradient
swirling;
gradient type
lower layer number require less blackness

*/