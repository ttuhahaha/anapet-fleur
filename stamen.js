function drawstamen() {
  if (particles.length == 0 && maxstamen > 0) {
    particles = Array(15)
      .fill()
      .map((p) => new Stamen());
  }
  for (let s of particles) {
    if (frameCount % 100 == s.offset) {
      stroke(s.color);
      strokeWeight(by / 12);
      for (let i = 0; i < LLR / 2; i++) 
        line(s.pos.x, s.pos.y, s.pos.x + nz(1) * LLR / 7, s.pos.y + nz(1) * LLR / 7)     
      if (stamnum < maxstamen) {
        particles.push(new Stamen());
        stamnum++;
      }
    } else {
      s.color.setAlpha(s.LS);
      s.vel.add(s.acc);
      s.vel.setMag(layers.length > 4 ? LLR / 50 : LLR / 90);
      s.pos.add(s.vel);
      s.LS += 0.002;
      stroke(s.color);
      strokeWeight(by / 5);
      line(s.prevpos.x, s.prevpos.y, s.pos.x, s.pos.y);
      s.prevpos = s.pos.copy();
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
    this.offset = (frameCount + floor(map(nz(), 0.1, 1, 10, 99))) % 100;
    if (this.offset == 0) this.offset = 50;
    this.prevpos = this.pos.copy();
  }
}