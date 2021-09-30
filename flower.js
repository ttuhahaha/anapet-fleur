let startpoint
function drawflower(layer) {
  if (particles.length == 0 && petalcount < layer.petals) newpetal(layer); //new petal
  if (petalcount == layer.petals) petalcount = 0; //new flower
  particles.forEach((p) => p.drawpetal()); //draw petal
}

class Particle {
  constructor(angle, mid, layer) {
    this.R = layer.R;
    this.R3 = layer.t2R;
    this.hu = noise(angle) * 100 + hu - 70; //hue value of color Set bigger noise value for rougher gradient (like nz())
//    this.color = color(this.hu, 100, 4, this.R3 < bx * 5 ? 0 : 1);
    this.color = color(this.hu, 100, 4, 0);
    this.position = home.copy();
    this.prevPosition = this.position.copy();
    this.LS = map(
      abs(angle - mid),
      0,
      1,
      -20,
      0
    ); //controls the gradient
    this.Q = floor(dist(home.x, home.y, petalcenter.x, petalcenter.y) * Q * 0.25);
    this.LSstep = (50 - this.LS) / (this.Q); ////controls the gradient
    this.T1 = p5.Vector.fromAngle(angle, layer.R);
    this.T1.add(home);
    if (layer.pointy) angle = mid
    this.T2 = p5.Vector.fromAngle(angle, layer.t2R);
    this.T2.add(home.x * layer.thome, home.y * layer.thome);
  }

  updatepetal() {
    startpoint = floor(0.5 * this.Q);
    //end of petal//
    if (((frameCount - startframe + startpoint) % this.Q) == 0) {
    this.color.setAlpha(0);
    particles.length = 0;
    startframe = frameCount+1;
  }

  //  let t = ((frameCount - startframe) % this.Q) / (this.Q);
    let t = ((frameCount - startframe + startpoint) % this.Q) / (this.Q);
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
    //moonflower//
    if (TYPE == 4) this.position.y /= 2
  }
        
  updateLS() {
    //update color//
    this.color = color((this.hu + this.LS * 3) % 360, 100, this.LS, this.R3 < bx * 5 ? this.LS / 100 : 1);
    this.LS += this.LSstep * LSadd;

    //moonflower//
    if (TYPE == 4) this.color.setAlpha(this.LS/100);
  }

  drawpetal() {
//    this.updateLS();
//    if (this.LS > 2) {
    this.updatepetal();
    stroke(this.color);
    line(
      this.prevPosition.x,
      this.prevPosition.y,
      this.position.x,
      this.position.y
    );
    this.prevPosition = this.position.copy();
    this.updateLS();
  }}
//}

function newpetal(layer) {
  //rotation for smaller radiuses
  let rotation = home.heading() - 1.3 - noise(layer.R);

  //petalcenter//
  let mid = 0.5 * (TWO_PI / layer.petals) + petalcount * (TWO_PI / layer.petals) + rotation; //noise(layer.petals) for rotation, 0.5 controls swirling
  petalcenter = p5.Vector.fromAngle(
    mid + (nz() - 0.5) / 2,
    layer.t3R + (nz() - 0.5) * layer.R / 2
  ); //create vector. R*2 controls view of petals
  if (layer.closed) petalcenter.mult (nz()); //closed layer
  petalcenter.add(home.x * layer.thome, home.y * layer.thome); //translate to home

  //withered petals for fewer layers//
  if (layers.length <= 3 && petalcenter.y < this.home.y - bx * 5 && nz() > 0.65 && TYPE != 4) {
    petalcenter.y *= 0.5;
    console.log("withered")
  }

  //calculate angle//
  for (let i = wr; i <= 1 + wl; i += layer.pointy ? 2 / (layer.R * Q) : 1 / (layer.R * Q)) //positive counter, negative clock, +- small, -+ wide
  {
    let angle =
      i * (TWO_PI / layer.petals) +
      petalcount * (TWO_PI / layer.petals) + rotation; //calculate angle
    particles.push(new Particle(angle, mid, layer)); //initiate petal
  }
  petalcount++;
  particles.forEach(x => {
    if (nz() > 0.73) x.LSstep *= 1.1
  });
}