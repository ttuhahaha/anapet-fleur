function drawflower(layer) {
  if (particles.length == 0) newpetal(layer);
  for (let p of particles) {
    p.updatepetal(layer);
    p.drawpetal(layer);
  }
}

class Particle {
  constructor(angle, mid, layer) {
    this.R = layer.R;
    this.hu = (noise(angle) - 0.5) * 100 + hu + flID * 10;
    this.color = color(0,0,0);
    this.pos = home.copy();
    this.prevpos = 0;
    this.LS = TYPE == 1 ? map((angle - mid), -1, 1, -5, 0) :
      map(abs(angle - mid), 0, 1, -10, 0);
    this.Q = floor(home.dist(petalcenter) * Q / 4);
    if (this.Q < 50 * Q) this.Q += 50 * Q;
    this.LSstep = (50 - this.LS) / (this.Q);
    if (feature % 3 == 0) this.LSstep *=1.5
    this.T1 = p5.Vector.fromAngle(angle, layer.R);
    this.T1.add(home);
    if (layer.pointy || (layer.closed && TYPE != 4)) {
      angle = mid;
      this.LSstep *= 1.2}
    this.T2 = p5.Vector.fromAngle(angle, layer.t2R);
    this.T2.add(layer.thome);
    this.startpoint = 0;
    if (TYPE == 4) {
      this.startpoint = floor((0.60 + flID / 40) * this.Q);
      this.LSstep *= 2;
    } else {
      if (home.mag() > bx * 5) {
        if (TYPE == 2) this.startpoint = floor(flID / 15 * this.Q);
        this.LSstep *= 1 + flID * 0.2;
      }
    }

  }

  updatepetal(layer) {
    this.color = color((this.hu + this.LS) % 360, 100, max(this.LS, 4));
    this.LS += this.LSstep;
    if (TYPE == 4) strokeWeight(max(0, this.LS * bx / 150));
    if (((frameCount - startframe + this.startpoint) % this.Q) == 0) this.end(layer);
    let t = ((frameCount - startframe + this.startpoint) % this.Q) / (this.Q);
    this.pos.x = (1 - t) ** 3 * home.x + 3 * (1 - t) ** 2 * t * this.T1.x + 3 * (1 - t) * t ** 2 * this.T2.x + t ** 3 * petalcenter.x;
    this.pos.y = (1 - t) ** 3 * home.y + 3 * (1 - t) ** 2 * t * this.T1.y + 3 * (1 - t) * t ** 2 * this.T2.y + t ** 3 * petalcenter.y;
    if (TYPE == 4) this.pos.y /= 2;
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
      if ((home.mag() > 10 * bx || layer.closed) && flID > 1) strokeWeight(max(0, this.LS * bx / 480));
      if (feature % 5 > 3 && TYPE != 4) 
      strokeWeight(max(0, this.LS / bx / 80))
      line(this.prevpos.x, this.prevpos.y, this.pos.x, this.pos.y);
      
      if (flID < 4 && petalcount % 2 < 1 && !layer.closed && feature % 4 > 0) {
        push();
        strokeWeight(max(0, this.LS / bx / 40));
        this.color = color(this.hu + this.LS / 2, 99, 20);
        stroke(this.color);
        let x = TYPE == 4 ? flID / 2 + 1.3 : flID * 1.5 + 1.5;
        let y = TYPE == 4 ? (x - 1) * 2 : (x - 1) * 1.5
        line(this.prevpos.x * x - y * home.x, this.prevpos.y * x - y * home.y, this.pos.x * x - y * home.x, this.pos.y * x - y * home.y);
        pop()
      }

      if (flID < 4 && particles.indexOf(this) < 2 && (petalcount + flID) % 5 < 3 && nzr() > 0.65 && this.LS > 5 && feature % 3 > 0) {
        push();
        for (i = 20; i > 1; i--) {
          strokeWeight(layer.pointy ? nzr() * (this.LS / 8 - i) * bx : nzr() * (this.LS / 6 - i) * bx);
          stroke((hu + 100) % 360, 99, 50 + i * 4, 0.001 + i / 120);
          point(
            this.pos.x * 1.2,
            TYPE == 4 ? this.pos.y * 1.5 : this.pos.y * (flID + 1)-home.y*flID);
        }
        pop();
      }
      this.prevpos = this.pos.copy();
    }
  }
}

function newpetal(layer) {
  let rotation = home.heading() - 1.3 - noise(flID) * 2;
  let mid = sw * (TWO_PI / layer.petals) + petalcount * (TWO_PI / layer.petals) + rotation;
  petalcenter = p5.Vector.fromAngle(
    mid + nz(1) / 2,
    layer.t3R
  );
  if (layer.closed) {
    petalcenter.mult(nz());
    if (TYPE == 4) petalcenter.mult(nz())
  };
  petalcenter.add(layer.thome);
  for (let i = wr; i <= 1 - wr; i += layer.pointy ? 2 / (layer.R * Q) : 1 / (layer.R * Q)) {
    let a =
      i * (TWO_PI / layer.petals) +
      petalcount * (TWO_PI / layer.petals) + rotation;
    particles.push(new Particle(a, mid, layer));
  }
  particles.forEach(x => {
    if (nzr() > 0.73) x.LSstep *= 1.1
  });
  //  particles.forEach(x => {if (noise(this.hu) > 0.7) x.LSstep *= 1.1});
}