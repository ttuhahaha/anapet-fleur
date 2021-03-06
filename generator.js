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
//  hash: "0xa9686fc66c71482d9821c8c41011847a223819700897d6e31e5f8c6e50d2c61c",
  tokenId: "",
};

function hashDecode() {
  let p = [];
  for (let i = 0; i < 64; i += 2) {
    p.push(tokenData.hash.slice(i + 2, i + 4));
  }
  let P = p.map((x) => {
    return (parseInt(x, 16) % 10) + 1;
  });
  console.log(tokenData.hash);
  console.log(P);
  assign(P);
}

function assign(P) {
  TYPE = P[30] % 3;
  //TYPE = 0;
  let prms = [{
      //TYPE 0 hrizantem// 4-7 layers, central translation, thin petals, //!!blackness to be high
      layers: [6, 7],
      petals: [6, 7],
      center: true,
      pointy: 2, //0 false, 1 true for all, 2 random
      closed: true,
      LSadd: 0.8
    },
    {
      //TYPE 1 open flower// high p3, all petal width is the same petals if inside R is big
      layers: [3, 4],
      petals: [5, 7],
      t23R: [1, 1.3, 1.4, 1.7],
      stamen: true,
      pointy: 2,
    },
    {
      //TYPE 2 pointy petals, many layers, small difference, inside swirl, big LSadd around 1.5-2//!!still problem with overlap!!
      layers: [8, 9],
      petals: [8, 12],
      pointy: 1,
      closed: true,
    },
    {
      //TYPE 3 mixed petal relations, 2-3 layers, big difference in Res and big home //!! ok, but problem with last petal overlap//!! problem with stamens with 3 layers - too short
      layers: [3, 6],
      petals: [5, 10],
      t23R: [0.6, 0.8, 1.2, 1.5],
      stamen: true,
    },
    {
      //TYPE 4 moonflower, big radius, big translation, big transparency,//!!all layers cant be pointy//problem with stamens
      layers: [4, 6],
      petals: [5, 7],
      t23R: [1.9, 2.2, 2.7, 2.8],
      stamen: true,
      LSadd: 4,
      closed:true,
    },
  ];

  //GENERAL SETUP//
  hu = map(P[9] * P[10] * P[11], 30, 150, 0, 360);
  noiseSeed(P[11] * P[12]);
  maxstamen = prms[TYPE].stamen ? P[12] * 3 + 10 : 0;

  center = prms[TYPE].center;
  translation = prms[TYPE].center ? [40 + P[12] * 2, 50 + P[13]] 
    : TYPE == 4 ? [50, 140] : [25 + P[12] * 5, 25 + P[13] * 5];
  home = createVector((50 - translation[0]) * bx, (50 - translation[1]) * by);
  home.lerp(0, 0, 0, 0.5);
  LSadd = prms[TYPE].LSadd ? prms[TYPE].LSadd : map(P[14], 1, 10, 0.9, 1.5);
  wr = map(P[15], 1, 10, -0.1, 0.2);
  sw = map (P[17], 1, 10, 0.2, 0.8);
  //layers//
  let y = floor(map(P[0], 1, 10, prms[TYPE].layers[0], prms[TYPE].layers[1]));
  layers = Array.from({length: y}, () => ({}));
  LL = layers[y-1];
  //petals//
  for (i = 0; i < y; i++) {
    layers[i].petals = floor(map(P[i], 1, 10, prms[TYPE].petals[0], prms[TYPE].petals[1]));
    layers[i].R = i == 0 ? floor(P[i] * 2 + 22 * bx) : floor(layers[i-1].R * 0.7);
    layers[i].t2R = prms[TYPE].t23R ? map(P[11], 1, 10, prms[TYPE].t23R[0], prms[TYPE].t23R[1]) * layers[i].R : map(P[11], 1, 10, 1, 1.5) * layers[i].R; 
    layers[i].t3R = prms[TYPE].t23R ? map(P[11], 1, 10, prms[TYPE].t23R[2], prms[TYPE].t23R[3]) * layers[i].R : map(P[12], 1, 10, 1.2, 1.5) * layers[i].R; 
    let h = home.copy();
    layers[i].thome = TYPE == 4 ? h.mult(4) : h.mult(1+4/y); 
    layers[i].pointy = prms[TYPE].pointy == 1 ? true 
      : prms[TYPE].pointy == null ? false
      : nz() > 0.6 ? true : false;
    if (i == y-1) layers[i].closed = prms[TYPE].closed;
  }
  STadd = TYPE == 4 ? 4 : 1+4/y;

  console.log("TYPE " + TYPE);
  console.log("prms");
  console.log(prms);
  console.log("hue " + hu);
  console.log("maxstamen " + maxstamen);
  console.log("translation " + translation);
  console.log("LSadd " + LSadd);
  console.log("petalwidth wr" + wr);
  console.log("swirl ", +sw)
  console.log(layers);
  console.log("LL")
  console.log(LL)
  console.log("stadd "+STadd)
}

function nz(x) {
  NZ++;
  if (x) {return noise(NZ)-0.5}
  else {return noise(NZ)};
}

/*
TYPE 5 rose, overlap -0.3,0.3, more petals, closed,more transparency, swirl
Q for stamens?
swirling;
1005 problem with type 4 stamens, type 2-3 overlap
22.6kb
13.7
*/