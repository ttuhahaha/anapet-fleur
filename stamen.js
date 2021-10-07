function drawstamen() {
  if (stamens.length == 0 && maxstamen > 0) {
    stamens = Array(4)
      .fill()
      .map((p) => new Stamen());
  }
  for (let stamen of stamens) {
    if (frameCount % 100 == stamen.offset) {
      push();
      stroke(stamen.color);
      strokeWeight(by / 12);
      for (let i = 0; i < LL.R / 2; i++) {
        line(stamen.pos.x, stamen.pos.y, stamen.pos.x + nz(1) * LL.R / 7, stamen.pos.y + nz(1) * LL.R / 7)
      }
      pop();
      if (stamnum < maxstamen) {
        stamens.push(new Stamen());
        stamnum++;
      }
    } else {
      stamen.color = color(stamen.hu + stamen.LS, 100, 50, stamen.LS);
      stamen.velocity.add(stamen.acceleration);
      stamen.velocity.setMag(LL.R / 90 * STadd);
      if (TYPE == 4) {
        stamen.velocity.mult(10.5), stamen.LS += 0.002
      }
      stamen.pos.add(stamen.velocity);
      stamen.LS += 0.005;
      stroke(stamen.color);
      strokeWeight(by / 5);
      line(
        stamen.prevpos.x,
        stamen.prevpos.y,
        stamen.pos.x,
        stamen.pos.y
      );
      stamen.prevpos = stamen.pos.copy();
    }
  }
  stamens = stamens.filter((p) => frameCount % 100 != p.offset);
  if (stamens.length == 0) return frameCount;
}

class Stamen {
  constructor() {
    this.pos = createVector(home.x - nz(1) * LL.R / 2, home.y - nz(1) * LL.R / 2);
    this.acceleration = createVector(0, 0.002 * bx);
    this.velocity = p5.Vector.sub(this.pos, home);
    this.velocity.setMag(bx);
    let h = home.copy();
    h.setMag(bx);
    this.velocity.add(h);
    this.LS = -0.01;
    this.hu = ((hu + 160) % 360) + nz() * 60;
    this.color = color(this.hu, 100, 50, 1);
    this.offset = (frameCount + floor(map(nz(), 0.3, 1, 40, 99))) % 100; 
    if (this.offset == 0) this.offset = 50;
    if (TYPE == 4) { //position inside of p3???
      let vec = home.copy();
      vec.y *= 0.5;
      this.pos = createVector(nz(1) * LL.R * 2 + vec.x, nz(1) * LL.R + vec.y);
      this.LS = -0.2
      this.velocity = this.pos.copy();
      this.velocity.mult(0.5)
      this.acceleration.mult(40);
    }
    this.prevpos = this.pos.copy();
  }
}