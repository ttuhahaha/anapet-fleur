function drawstamen() {
  console.log (stamens)
  //create new stamens
  if (stamens.length == 0 && maxstamen > 0) {
    stamens = Array(4)
      .fill()
      .map((p) => new Stamen());
  }

  for (let stamen of stamens) {
    if (frameCount % 100 == stamen.offset) {
      //draw tip//
      push();
      stroke(stamen.color);
      strokeWeight(by/12);
      for (let i = 0; i < LL.R/2; i++) {
        line(stamen.pos.x, stamen.pos.y, stamen.pos.x + (nz()-0.5)*LL.R/20, stamen.pos.y + (nz()-0.5)*LL.R/20) 
       }
      pop();
      if (stamnum < maxstamen) {
        stamens.push(new Stamen());
        stamnum++;
      }
    } else {
      //draw//
      stamen.color.setAlpha(stamen.LS);
//      strokeWeight(bx/8);
      stamen.velocity.add(stamen.acceleration);
      stamen.velocity.setMag(LL.R/90);
      if (TYPE == 4) stamen.velocity.setMag (height/70)
      if (TYPE == 4 && stamen.LS<0.3) stamen.color.setAlpha(0)
      stamen.pos.add(stamen.velocity);
      stamen.LS += 0.01;
      stroke(stamen.color);
      strokeWeight(by/5);
      // line(
      //   stamen.prevpos.x,
      //   stamen.prevpos.y,
      //   stamen.pos.x,
      //   stamen.pos.y
      // );
      point(stamen.pos.x, stamen.pos.y)
      stamen.prevpos = stamen.pos.copy();
//      console.log(stamen.LS)
    }
  }
  stamens = stamens.filter((p) => frameCount % 100 !== p.offset); //remove dead
  if (stamens.length == 0) return true; //done drawing
}

class Stamen {
  constructor() {
    this.pos = createVector(home.x - (nz() - 0.5)*LL.R/2, home.y - (nz()-0.5)*LL.R/2);
    this.acceleration = createVector(0, 0.00015 * LL.R); //gravity
    this.velocity = p5.Vector.sub(this.pos, home);
    this.velocity.setMag(bx);
    let h = home.copy();
    h.setMag(bx);
    h.mult(LL.thome);
    this.velocity.add(h);
    this.LS = -0.1;
    this.color = color(((hu + 160) % 360) + nz() * 40, 100, 50, 1);
    this.prevpos = this.pos.copy();
    this.offset = (frameCount + floor(map(nz(), 0.3, 1, 40, 99))) % 100; //randomness of length
    if (this.offset == 0) this.offset = 50;
    if (TYPE == 4) {

      this.LS = -0.5;
      this.acceleration.mult(20)}
    //    this.velocity.mult (50);}
  }
}

//only for central//for central 10x stamens, /10 magnitude
function drawstamen1() {
  //create new stamens
  if (stamens.length == 0 && maxstamen > 0) {
    stamens = Array(4)
      .fill()
      .map((p) => new Stamen1());
  }

  for (let stamen of stamens) {
    if (frameCount % 50 == stamen.offset) {
      push()
      //draw tip//
//        stroke(stamen.color);
//        noFill();
fill(stamen.color)
//      strokeWeight(LL.R/50);
//      ellipse(stamen.pos.x, stamen.pos.y, LL.R/10);
      for (let i = 0; i < LL.R; i++) {
        line(stamen.pos.x, stamen.pos.y, stamen.pos.x + (nz()-0.5)*LL.R/8, stamen.pos.y + (nz()-0.5)*LL.R/8) 
       }
       bezier(stamen.pos.x, stamen.pos.y, stamen.pos.x, stamen.pos.y-LL.R/4, stamen.home.x, stamen.home.y-LL.R/5, stamen.home.x,stamen.home.y);
      if (stamnum < maxstamen) {
        stamens.push(new Stamen1());
        stamnum++;
      }
      pop()
    }
  }
  stamens = stamens.filter((p) => frameCount % 50 !== p.offset); //remove dead
  if (stamens.length == 0) return true; //done drawing
}

class Stamen1 {
  constructor () {
    let x = home.copy();
    x.mult(1.2);
    this.color = color(((hu + nz() * 60) % 360), 50, 50, 0.1);
    this.pos = createVector(x.x - (nz() - 0.5)*LL.R*1.5, x.y - (nz()-0.5)*LL.R*1.5);
    this.pos.add(home);
    this.pos.mult(0.7);
    this.home = p5.Vector.lerp(this.pos, home, 0.8);
    this.offset = (frameCount + floor(map(nz(), 0.3, 0.7, 2, 49))) % 50;
//    if (this.offset == 0) this.offset = 1;
  }
}