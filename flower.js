function drawflower(layer) {
  if (particles.length == 0) newpetal(layer);
  for (let p of particles) {
    p.updatepetal(layer);
    if (LSadd == 4) {
    p.color = color((p.hu + p.LS / 2) % 360, 100, p.LS / 3, (p.LS-50) / 100);
    //if (flID == 1 && particles.indexOf(p) == 0) console.log(p.color)
    if (flID == 0) {
      strokeWeight(25);
      p.color = color((p.hu + p.LS / 2) % 360, 100, p.LS / 3, 0.006);
//      if (nz()>0.81) p.color.setAlpha(0.1)
    }
      p.drawpetal(layer)
    } else {
      if (home.mag() > 10*bx || layer.closed) {
        if (flID > 2 && p.LS < 6) strokeWeight(0);
        if (flID > 2) strokeWeight(p.LS / 60); 
      };
      p.drawpetal(layer);
  }}
}

class Particle {
  constructor(angle, mid, layer) {
    this.R = layer.R;
    this.hu = noise(angle) * 150 + hu - flID * 10;
    this.color = color(this.hu % 360, 100, 4, 0);
    this.pos = home.copy();
    this.prevpos = this.pos.copy();
    this.LS = map(abs(angle - mid), 0, 1, -20, 0);
    this.Q = floor(dist(home.x, home.y, petalcenter.x, petalcenter.y) * Q / 4);
    if (this.Q < 50*Q) this.Q += 50*Q;
    this.LSstep = (50 - this.LS) / (this.Q);
    this.T1 = p5.Vector.fromAngle(angle, layer.R);
    this.T1.add(home);
    if (layer.pointy || layer.closed) angle = mid
    this.T2 = p5.Vector.fromAngle(angle, layer.t2R);
    this.T2.add(layer.thome);
    this.startpoint = 0;
    if (LSadd == 4) {
      this.startpoint = floor((0.65) * this.Q);
      this.LS += 45;
      this.prevpos = 0;
    }
    if (home.mag()>bx*5) {
      this.startpoint = floor(flID/10*this.Q); 
      this.LSstep *=1+flID*0.2; 
      this.prevpos = 0}
  }

  updatepetal(layer) {
    this.color = color((this.hu + this.LS) % 360, 100, this.LS);
    this.LS += this.LSstep * LSadd;
    if (((frameCount - startframe + this.startpoint) % this.Q) == 0) this.end(layer);
    let t = ((frameCount - startframe + this.startpoint) % this.Q) / (this.Q);
    this.pos.x = (1 - t) ** 3 * home.x + 3 * (1 - t) ** 2 * t * this.T1.x + 3 * (1 - t) * t ** 2 * this.T2.x + t ** 3 * petalcenter.x;
    this.pos.y = (1 - t) ** 3 * home.y + 3 * (1 - t) ** 2 * t * this.T1.y + 3 * (1 - t) * t ** 2 * this.T2.y + t ** 3 * petalcenter.y;
    if (LSadd == 4) this.pos.y /= 2;
    if (this.prevpos == 0) this.prevpos = this.pos.copy();
  }

  end(layer) {
    particles.length = 0;
    startframe = frameCount;
    petalcount++;
    if (petalcount == layer.petals) {
      petalcount = 0;
      flID++;
    }
  }

  drawpetal(layer) {
    stroke(this.color);
    if (particles.length > 0) {
      line(this.prevpos.x, this.prevpos.y, this.pos.x, this.pos.y);
      if (flID < 2 && noise(petalcount)>0.33 && LSadd != 4) {
        if (this.LS > 10 && noise(particles.indexOf(this))>0.6) { //can be 20?
          push()
          strokeWeight(25)
          this.color.setAlpha(0.0065) // colored
//          this.color = color(110, 100, this.LS/3, layer.pointy ? 0.04 : 0.02);
//          if (nz() > 0.7) this.color.setAlpha(0.2);
          stroke(this.color)
          line(
            this.prevpos.x * 2 - home.x,
            this.prevpos.y * 1.9 - home.y,
            this.pos.x * 2 - home.x,
            this.pos.y * 1.9 - home.y)
          pop()
        }
        // if (particles.indexOf(this)+startframe==frameCount+50) {
        //   noFill()
        //   push()
        // strokeWeight(0.1)

        //  bezier(home.x,home.y,this.T1.x*2,this.T1.y*2,petalcenter.x*3,petalcenter.y*3,petalcenter.x*2,petalcenter.y*2);
        // pop()
        //        }      
      }
      this.prevpos = this.pos.copy();
    }
  }
}

function newpetal(layer) {
  let rotation = home.heading() - 1.3 - noise(layer.R) * 2;
  let mid = sw * (TWO_PI / layer.petals) + petalcount * (TWO_PI / layer.petals) + rotation; 
  petalcenter = p5.Vector.fromAngle(
    mid + nz(1) / 2,
    layer.t3R + nz(1) * layer.R /2
  ); 
  if (layer.closed) {
    petalcenter.mult(nz());
  //if (LSadd != 4)  layer.t2R /=2
  }
  petalcenter.add(layer.thome);

  for (let i = wr; i <= 1 -wr; i += layer.pointy ? 2 / (layer.R * Q) : 1 / (layer.R * Q))
  {
    if (flID == 0 && LSadd == 4 && nz()>0.5) i += 20 / (layer.R * Q);
    let angle =
      i * (TWO_PI / layer.petals) +
      petalcount * (TWO_PI / layer.petals) + rotation; 
      particles.push(new Particle(angle, mid, layer)); 
  }

  particles.forEach(x => {
    if (nz() > 0.73) x.LSstep *= 1.1;
  });
}