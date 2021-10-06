function drawstamen() {
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
        line(stamen.pos.x, stamen.pos.y, stamen.pos.x + (nz()-0.5)*LL.R/7, stamen.pos.y + (nz()-0.5)*LL.R/7) 
       }
      pop();
      if (stamnum < maxstamen) {
        stamens.push(new Stamen());
        stamnum++;
      }
    } else {
      //draw//
      stamen.color = color(stamen.hu+stamen.LS, 100, 50, stamen.LS);
//      strokeWeight(bx/8);
      stamen.velocity.add(stamen.acceleration);
 //     console.log(stamens)
      stamen.velocity.setMag(LL.R/90*LL.thome);
      if (TYPE == 4) {stamen.velocity.mult (10.5), stamen.LS +=0.002}
//      if (TYPE == 4 && stamen.LS<0.1) stamen.color.setAlpha(0)
      stamen.pos.add(stamen.velocity);
      stamen.LS += 0.005;
      stroke(stamen.color);
      strokeWeight(by/5);
      line(
        stamen.prevpos.x,
        stamen.prevpos.y,
        stamen.pos.x,
        stamen.pos.y
      );
    //   point(stamen.pos.x, stamen.pos.y)
      stamen.prevpos = stamen.pos.copy();
//      console.log(stamen.LS)
    }
  }
  stamens = stamens.filter((p) => frameCount % 100 !== p.offset); //remove dead
  if (stamens.length == 0) return frameCount; //done drawing
}

class Stamen {
  constructor() {
    this.pos = createVector(home.x - (nz() - 0.5)*LL.R/2, home.y - (nz()-0.5)*LL.R/2);
    this.acceleration = createVector(0, 0.001 * bx); //gravity
    this.velocity = p5.Vector.sub(this.pos, home);
    this.velocity.setMag(bx);
    let h = home.copy();
    h.setMag(bx);
    h.mult(LL.thome);
    this.velocity.add(h);
    this.LS = -0.01;
    this.hu = ((hu + 160) % 360) + nz() * 60;
    this.color = color(this.hu, 100, 50, 1);
    this.offset = (frameCount + floor(map(nz(), 0.3, 1, 40, 99))) % 100; //randomness of length
    if (this.offset == 0) this.offset = 50;
    if (TYPE == 4) {//position inside of p3???
      let vec = home.copy();
      vec.mult(LL.thome*0.4)
      vec.y *=0.5;
    //  ellipse (vec.x, vec.y, LL.R);
    //  this.pos = createVector((nz() - 0.5)*width/2, (nz()-0.5)*height/2-50*by);
      this.pos = createVector((nz() - 0.5)*LL.R*2+vec.x, (nz()-0.5)*LL.R+vec.y);
      this.LS =-0.2
      this.velocity = this.pos.copy();
      this.velocity.mult(0.5)
      this.acceleration.mult(40);
    }
    this.prevpos = this.pos.copy();
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
        console.log(stamnum)
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