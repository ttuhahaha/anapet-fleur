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
    hash: "0x3bf120b4e61cebc1a400bb81e6d38c682426388a35efce3a067685facb824144",
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
  TYPE = P[30] % 5;
  //    TYPE = 4;
  let prms = [{
      layers: [6, 7],
      petals: [6, 7],
      pointy: 2,
      closed: true
    },
    {
      layers: [3, 4],
      petals: [5, 7],
      t23R: [1, 1.3, 1.4, 1.6],
      stamen: true,
      pointy: 2
    },
    {
      layers: [8, 9],
      petals: [8, 12],
      pointy: 1,
      closed: true
    },
    {
      layers: [3, 6],
      petals: [5, 9],
      t23R: [0.6, 0.8, 1.2, 1.5],
      stamen: true
    },
    {
      layers: [4, 5],
      petals: [5, 7],
      t23R: [1.9, 2.2, 2.7, 2.8],
      closed: true
    }
  ];

  hu = (map(P[9] * P[10] * P[11], 3, 150, 0, 360)) % 360;
  noiseSeed(P.reduce((a, b) => a * b));
  maxstamen = prms[TYPE].stamen ? P[12] * 3 + 70 : 0;
  translation = TYPE == 0 ? [40 + P[12] * 2, 50 + P[13]] :
    TYPE == 4 ? [50, 140] : [25 + P[12] * 5, 25 + P[13] * 5];
  home = createVector((50 - translation[0]) * bx, (50 - translation[1]) * by);
  home.lerp(0, 0, 0, 0.5);
  wr = map(P[15], 1, 10, 0, -0.2);
  sw = map(P[17], 1, 10, 0.3, 0.7);
  feature = P[20]
  let y = (home.mag() > bx * 10 && TYPE == 3) ? prms[TYPE].layers[0] : floor(map(P[0], 1, 10, prms[TYPE].layers[0], prms[TYPE].layers[1])); //chck
  layers = Array.from({length: y}, () => ({}));
  for (i = 0; i < y; i++) {
    layers[i].petals = floor(map(P[i], 1, 10, prms[TYPE].petals[0], prms[TYPE].petals[1]));
    layers[i].R = i == 0 ? P[i] * 2 + 21 * bx : layers[i - 1].R * 0.7;
    layers[i].t2R = prms[TYPE].t23R ? map(P[11], 1, 10, prms[TYPE].t23R[0], prms[TYPE].t23R[1]) * layers[i].R : map(P[11], 1, 10, 1, 1.5) * layers[i].R;
    layers[i].t3R = prms[TYPE].t23R ? map(P[11], 1, 10, prms[TYPE].t23R[2], prms[TYPE].t23R[3]) * layers[i].R : map(P[12], 1, 10, 1.2, 1.6) * layers[i].R;
    let h = home.copy();
    layers[i].thome = TYPE == 4 ? h.mult(4) : h.mult(1 + 3 / y);
    layers[i].pointy = prms[TYPE].pointy == 1 ? true :
      prms[TYPE].pointy == null ? false :
      nz() > 0.6 ? true : false;
    if (i == y - 1) layers[i].closed = prms[TYPE].closed;
  }
  LLR = layers[y - 1].R;
  console.log("TYPE " + TYPE);
  console.log(prms);
  console.log("hue " + hu);
  console.log("maxstamen " + maxstamen);
  console.log("translation " + translation);
  console.log("petalwidth wr" + wr);
  console.log("swirl ", +sw);
  console.log("feature ", +feature)
  console.log(layers);
}

function nz(x) {
  NZ += 1;
  if (x) {
    return noise(NZ) - 0.5
  } else {
    return noise(NZ)
  };
}

function nzr() {
  NZR += 1;
  return noise(NZR)
}
/*
feature
% 2 2 layer
% 3 glare
% 4 lsadd
% 5 bg
*/