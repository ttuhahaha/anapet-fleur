let startpoint

function drawflower(layer) {
  if (particles.length == 0) newpetal(layer); //new petal
  particles.forEach((p) => p.drawpetal(layer)); //draw petal
}

class Particle {
  constructor(angle, mid, layer) {
    this.R = layer.R;
    this.R3 = layer.t2R;
    this.hu = noise(angle) * 150 + hu - flID * 10; //hue value of color Set bigger noise value for rougher gradient (like nz())
    //    this.color = color(this.hu, 100, 4, this.R3 < bx * 5 ? 0 : 1);
    this.color = color((this.hu) % 360, 100, 4, 0);
    this.position = home.copy();
    this.prevPosition = this.position.copy();
    this.LS = map(
      abs(angle - mid),
      0,
      1,
      -20,
      0
    ); //controls the gradient
    this.Q = floor(dist(home.x, home.y, petalcenter.x, petalcenter.y) * Q / 4);
    if (this.Q < 50) this.Q += 50
    this.LSstep = (50 - this.LS) / (this.Q); ////controls the gradient
    this.T1 = p5.Vector.fromAngle(angle, layer.R);
    this.T1.add(home);
    if (layer.pointy) angle = mid
    this.T2 = p5.Vector.fromAngle(angle, layer.t2R);
    this.T2.add(home.x * layer.thome, home.y * layer.thome);
  }

  updatepetal(layer) {
    startpoint = TYPE == 4 ? floor((0.55 + flID / 20) * this.Q) : 0; //start for petal drawing, 0 - 1

    if (((frameCount - startframe + startpoint) % this.Q) == 0) this.end(layer);

    let t = ((frameCount - startframe + startpoint) % this.Q) / (this.Q);
    this.position.x =
      (1 - t) ** 3 * home.x +
      3 * (1 - t) ** 2 * t * this.T1.x +
      3 * (1 - t) * t ** 2 * this.T2.x +
      t ** 3 * petalcenter.x;
    this.position.y =
      (1 - t) ** 3 * home.y +
      3 * (1 - t) ** 2 * t * this.T1.y +
      3 * (1 - t) * t ** 2 * this.T2.y +
      t ** 3 * petalcenter.y;
    //moonflower//
    if (TYPE == 4) this.position.y /= 2
  }

  end(layer) {
    particles.length = 0;
    startframe = frameCount; //for TYPE 4 frameCount-1
    petalcount++;
    if (petalcount == layer.petals) {
      petalcount = 0; //new flower
      flID++;
    }
  }

  updateLS() {
    //update color//
    this.color = color((this.hu + this.LS) % 360, 100, this.LS);
    this.LS += this.LSstep * LSadd;

    //moonflower//
    if (TYPE == 4) this.color.setAlpha(this.LS / 200); //??strokeWeight(bx/24)
    //    if (TYPE == 4 ) this.color = color((this.hu + this.LS) % 360, 100, this.LS/2)

    //this.R3 < bx * 5 ? this.LS / 100 : 1
  }

  drawpetal(layer) {
    this.updateLS();
    this.updatepetal(layer);

    if (flID > 1 && this.LS < 6) strokeWeight(0)//??
    if (flID > 1) strokeWeight(this.LS / 50)
    if (TYPE == 4 && flID < 1) {
      strokeWeight(25);
      this.color = color((this.hu + this.LS / 2) % 360, 100, this.LS / 3, 0.006); //
      if (this.LS < 15 || particles.indexOf(this) % 7 > 0) strokeWeight(0);
    }
    stroke(this.color);
    if (particles.length > 0) {
      line(
        this.prevPosition.x,
        this.prevPosition.y,
        this.position.x,
        this.position.y
      );
      // //fuzzy
      //              this.color.setAlpha(alpha(this.color)/5);
      //              stroke(this.color)
      //     for (let x = 0; x<5; x++) {
      //       line(
      //         this.position.x,
      //         this.position.y,
      //         this.position.x+(nz()-0.5)*bx*3,
      //         this.position.y+(nz()-0.5)*bx*3)
      //       ;}

      if (flID < 2 && petalcount % 2 == 0 && TYPE != 4
      ) {
        if (this.LS > 20 && particles.indexOf(this) % 7 > 0) { //can be 20?
          

            push()
            strokeWeight(25)
            this.color.setAlpha(0.002)
            if (layer.pointy) this.color.setAlpha(0.005)
            stroke(this.color)

            line(
              this.prevPosition.x * 2 - home.x,
              this.prevPosition.y * 1.7 - home.y * 0.7,
              this.position.x * 2 - home.x,
              this.position.y * 1.7 - home.y * 0.7)
            pop()
        }
          // if (particles.indexOf(this)+startframe==frameCount+50) {
          //   noFill()
          //   push()
          // strokeWeight(0.1)
          //  bezier(home.x,home.y,this.T1.x*2,this.T1.y*2,this.T2.x*2,this.T2.y*2,petalcenter.x*2,petalcenter.y*2);
          // pop()
//        }      
      }
      this.prevPosition = this.position.copy();
    }
  }
}

function newpetal(layer) {
  //rotation for smaller radiuses
  let rotation = home.heading() - 1.3 - noise(layer.R) * 2;

  //petalcenter//
  let mid = 0.5 * (TWO_PI / layer.petals) + petalcount * (TWO_PI / layer.petals) + rotation; //noise(layer.petals) for rotation, 0.5 controls swirling
  petalcenter = p5.Vector.fromAngle(
    mid + (nz() - 0.5) / 2,
    layer.t3R + (nz() - 0.5) * layer.R / 2
  ); //create vector. R*2 controls view of petals
  if (layer.closed) petalcenter.mult(nz()); //closed layer
  petalcenter.add(home.x * layer.thome, home.y * layer.thome); //translate to home

  // //withered petals for fewer layers//
  // if (layers.length <= 3 && petalcenter.y < this.home.y - bx * 5 && nz() > 0.65 && TYPE != 4) {
  //   petalcenter.y *= 0.7;
  //   console.log("withered")
  // }

  //calculate angle//
  for (let i = wr; i <= 1 + wl; i += layer.pointy ? 2 / (layer.R * Q) : 1 / (layer.R * Q)) //positive counter, negative clock, +- small, -+ wide
  {
    let angle =
      i * (TWO_PI / layer.petals) +
      petalcount * (TWO_PI / layer.petals) + rotation; //calculate angle
    particles.push(new Particle(angle, mid, layer)); //initiate petal
  }
  particles.forEach(x => {
    if (nz() > 0.73) x.LSstep *= 1.1;
    //    if (particles.indexOf(x)<15) x.LSstep += (15-particles.indexOf(x))/100
  });
}