function drawflower(layer) {
  if (particles.length == 0 && petalcount < layer.petals) newpetal(layer); //new petal
  if (petalcount == layer.petals) petalcount = 0; //new flower
  particles.forEach((p) => p.drawpetal()); //draw petal
  ellipse (0,0,20)
}

class Particle {
  constructor(angle, mid, layer) {
    this.R = layer.R;
    this.R3 = layer.t2R;
    this.hu = noise(angle) * 100 + hu - 70; //hue value of color Set bigger noise value for rougher gradient (like nz())
    this.color = color(this.hu, 100, 4, this.R3 < bx*5 ? 0 : 1); 
    this.position = home.copy();
    this.prevPosition = this.position.copy();
    this.LS = map(
      abs(angle - mid),
      0,
      1,
      -20,
      0
    ); //controls the gradient
    this.LSstep = (50 - this.LS) / (layer.R * Q);////controls the gradient, lower layers darker with "-layer.R/15"
    this.T1 = p5.Vector.fromAngle(angle, layer.R); //R*x controls view of petals
    // //oval//
    // this.T1 = createVector (layer.R*cos (angle), layer.R*layer.thome*sin (angle))
    // //*oval//
    this.T1.add(home);
    if (layer.pointy) angle = mid
//      this.petalcenter1 = p5.Vector.mult(petalcenter, 1.1)}
//      this.petalcenter1 = p5.Vector.fromAngle(mid, layer.t3R + 10);
//      this.petalcenter1.add(home.x * layer.t3home, home.y * layer.t3home);} //translate to home
    //   this.T2 = p5.Vector.fromAngle(mid, layer.t2R)
    // } else {
      this.T2 = p5.Vector.fromAngle(angle, layer.t2R);
      // //oval//
      // this.T2 = createVector (layer.t2R*cos (angle) * cos (PI/4), layer.t2R*layer.thome*sin (angle) * sin (PI/4))
      // //*oval//
 //   }
    this.T2.add(home.x * layer.thome, home.y * layer.thome);

  }

  updatepetal() {
    //calculate step//
    let t = ((frameCount - startframe) % (this.R * Q)) / (this.R * Q);

    //bezier 4 point//
    this.position.x =
      (1 - t) ** 3 * home.x +
      3 * (1 - t) ** 2 * t * this.T1.x +
      3 * (1 - t) * t ** 2 * this.T2.x +
      t ** 3 * petalcenter.x;
    this.position.y =
      (1 - t) ** 3 * home.y +
      3 * (1 - t) ** 2 * t * this.T1.y +
      3 * (1 - t) * t ** 2 * this.T2.y +
      t ** 3 * petalcenter.y; //randomiser for 'furry' effect
    if (TYPE == 4) this.position.y /= 2;

    //update gradient / lifespan//   
    //if (this.position.dist(home) > IR / 4) 
    this.LS += this.LSstep * LSadd;

    if (this.LS > 4) this.color = color((this.hu + this.LS * 3) % 360, 100, this.LS, this.R3 < bx*5 ? this.LS/100 : 1);
    //moonflower//
    if (TYPE == 4) 
      {this.color.setAlpha(this.LS/600)}
  }

  drawpetal() {
    this.updatepetal();
    // reset the petal//
    if ((frameCount - startframe) % (this.R * Q) == 0) {
      this.color.setAlpha(0);
      particles = [];
    }
    stroke(this.color);
    fill(this.color);
    line(
      this.prevPosition.x,
      this.prevPosition.y,
      this.position.x,
      this.position.y
    );
    this.prevPosition = this.position.copy();
  }
}

function newpetal(layer) {

  //rotation for smaller radiuses
  //let rotation = layer.R < bx * 10 ? 3 : noise(layer.R) * 2;
  let rotation = home.heading() - 1.3 - noise(layer.R);
  

  //petalcenter//
  let mid = 0.5 * (TWO_PI / layer.petals) + petalcount * (TWO_PI / layer.petals) + rotation; //noise(layer.petals) for rotation, 0.5 controls swirling
  petalcenter = p5.Vector.fromAngle(
    mid + (nz() - 0.5) / 2,
    layer.t3R + (nz() - 0.5) * layer.R / 2
  ); //create vector. R*2 controls view of petals
  // //oval//
  // petalcenter = createVector (layer.R*cos (mid), layer.R*layer.thome*sin (mid)/9)
  // //*oval//
  petalcenter.add(home.x * layer.thome, home.y * layer.thome); //translate to home
  //withered petals for fewer layers//
  if (layers.length <=3 & petalcenter.y < this.home.y-bx*5 & nz()>0.65 & TYPE != 4) {
    petalcenter.y *= 0.5;
    console.log("withered")
  }

  for (let i = wr; i <= 1 + wl; i += layer.pointy ?  2.5 / (Q * layer.R) : 1 / (Q * layer.R)) //positive counter, negative clock, +- small, -+ wide
  {
    let angle =
      i * (TWO_PI / layer.petals) +
      petalcount * (TWO_PI / layer.petals) + rotation; //calculate angle, noise for rotation
    particles.push(new Particle(angle, mid, layer)); //initiate petal
  }

  //x = layer.R/cos (angle)
  //y = layer.R*layer.thome/sin (angle)

  petalcount++;
  //  particles = particles.filter((x) => nz() < 0.73); //black lines on petals 
  particles.forEach(x => {
    if (nz() > 0.73) x.LSstep /= 1.1;
  });
  //petal borders
}
/*
function midpoint(layer) {
  let mid = ((2 * petalcount + 1) * TWO_PI) / 2 / layer.petals + layer.rotation; //calculate midpoint
  console.log ("mid "+mid)
  let pc = p5.Vector.fromAngle(mid + nz()/2-0.5, layer.t3R); //create vector. R*2 controls view of petals
  pc.add(home.x * layer.t3home, home.y * layer.t3home); //translate to home
  console.log("pc "+pc)
}
*/