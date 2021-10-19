function drawstamen() {
  if (particles.length == 0 && maxstamen > 0) {
    particles = Array(7)
      .fill()
      .map((p) => new Stamen());
  }
  for (let p of particles) {
    if (frameCount % 100 == p.offset) {
      stroke(p.color);
      strokeWeight(by / 12);
      for (let i = 0; i < LLR / 2; i++)
        line(p.pos.x, p.pos.y, p.pos.x + nz(1) * LLR / 7, p.pos.y + nz(1) * LLR / 7)
      if (stamnum < maxstamen) {
        particles.push(new Stamen());
        stamnum++;
      }
    } else {
      p.color.setAlpha(p.LS);
      p.vel.add(p.acc);
      p.vel.setMag(layers.length > 4 ? LLR / 50 : LLR / 90);
      p.pos.add(p.vel);
      p.LS += 0.002;
      stroke(p.color);
      strokeWeight(by / 5);
      line(p.prevpos.x, p.prevpos.y, p.pos.x, p.pos.y);
      p.prevpos = p.pos.copy();
    }
  }
  particles = particles.filter((p) => frameCount % 100 != p.offset);
  if (particles.length == 0) {
    maxstamen = 0;
    startframe = frameCount;
  }
}

class Stamen {
  constructor() {
    this.pos = createVector(home.x - nz(1) * LLR / 2, home.y - nz(1) * LLR / 2);
    this.acc = createVector(0, 0.001 * bx);
    this.vel = p5.Vector.sub(this.pos, home);
    this.vel.setMag(bx);
    let h = home.copy();
    h.setMag(bx * 2);
    this.vel.add(h);
    this.LS = -0.01;
    this.hu = hu + nz() * 160;
    this.color = color(this.hu, 100, 50);
    this.offset = (frameCount + floor(map(nz(), 0.1, 0.9, 10, 99, true))) % 100;
    this.prevpos = this.pos.copy();
  }
}