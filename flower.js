function drawflower(layer) {
  if (particles.length == 0) newpetal(layer);
  for (let p of particles) {
    p.updatepetal(layer);
    if (LSadd == 4) {
    p.color = color((p.hu + p.LS/2) % 360, 100, p.LS / 3, (p.LS-50) / 100);
    if (flID == 0 ) {
      strokeWeight(bx*3);
      p.color = color((p.hu+p.LS/2) % 360, 70, p.LS*0.2, 0.01);
      stroke(p.color)
      point(p.pos.x, p.pos.y);
    } else {
      p.drawpetal(layer)}
    } else {
      if (home.mag() > 10*bx || layer.closed) {
  //      if (flID > 2 && p.LS < 6) strokeWeight(0);

        if (flID > 1) strokeWeight(p.LS * bx / 480); 
      };
      p.drawpetal(layer);
    }
}
}

class Particle {
  constructor(angle, mid, layer) {
    this.R = layer.R;
    this.hu = (noise(angle)-0.5) * 100 + hu - flID * 10;
    this.color = color(this.hu % 360, 100, 4, 0);
    this.pos = home.copy();
    this.prevpos = 0;
    this.LS = map(abs(angle - mid), 0, 1, -20, 0);
    this.Q = floor(dist(home.x, home.y, petalcenter.x, petalcenter.y) * Q / 4);
    if (this.Q < 50*Q) this.Q += 50*Q;
    this.LSstep = (50 - this.LS) / (this.Q);
    this.T1 = p5.Vector.fromAngle(angle, layer.R);
    this.T1.add(home);
    if (layer.pointy || (layer.closed && LSadd != 4)) {angle = mid; this.LSstep *=1.3}
    this.T2 = p5.Vector.fromAngle(angle, layer.t2R);
    this.T2.add(layer.thome);
    this.startpoint = 0;
    if (LSadd == 4) {
      this.startpoint = floor((0.65+flID/40) * this.Q);
      this.LS += 55;
    } else {
    if (home.mag()>bx*5) {
      this.startpoint = floor(flID/15*this.Q); 
      this.LSstep *=1+flID*0.2;}
  }}

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
    fill(this.color)
    if (particles.length > 0) {
      line(this.prevpos.x, this.prevpos.y, this.pos.x, this.pos.y);
 //     point(this.pos.x,this.pos.y);
      if (flID < 2 && (petalcount+flID) % 3 == 0 && LSadd != 4) {
        if (this.LS > 23 
          //&& noise(particles.indexOf(this)) > 0.5
          ) { //REDUCE # OF STEPS FOR HIGH Q!!
          push()
          strokeWeight(bx*3)
          this.color = color(this.hu+this.LS, 99, this.LS*0.6, 0.008)//(this.LS-20) / 400);
          stroke(this.color);
          let x = flID + 1.7;
          point(this.pos.x * x - x*home.x, this.pos.y * x - x*home.y)
          pop()
        }    
      }

      if (flID>0 && flID < 4 && particles.indexOf(this) < 2 && (petalcount+flID) % 5 < 3 && nzr() > 0.7 && this.LS > 10 
      //&& (layer.pointy == false || layer.t2R < layer.t3R)
      ) {           
//NEED LESS STEPS FOE HIGHER Q
        push()      
//         if (nzr() > 0.7) {/////////////////how to calc this step??
//          console.log("glare");
          for (i = 20; i>1; i--) {
           strokeWeight(LSadd == 4 ? nzr()*(this.LS/12-i)*bx : layer.pointy ? nzr()*(this.LS/8-i)*bx : nzr()*(this.LS/5-i)*bx);
           stroke((hu+100)%360, 100, 40+i*7, 0.001+i/120);
           point(
              this.pos.x*1.2,//1.1
              LSadd == 4 ? this.pos.y * 1.4 : this.pos.y*2)
         }
//        }
        pop()
      }
      this.prevpos = this.pos.copy();
    }
  }
}

function newpetal(layer) {
  let rotation = home.heading() - 1.3 - noise(LSadd) * 2;
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

  for (let i = wr; i <= 1 -wr; i += layer.pointy ? 2 / (layer.R * Q) : 1 / (layer.R * Q))//!!starts nz() discrepancy, constructor ok,
  {
    let angle =
      i * (TWO_PI / layer.petals) +
      petalcount * (TWO_PI / layer.petals) + rotation; 
      particles.push(new Particle(angle, mid, layer)); 
  }
  if (flID == 0 && LSadd == 4) particles = particles.filter(x => nzr()<0.6)
  particles.forEach(x => {
    if (nzr() > 0.73) x.LSstep *= 1.1;
  });
//  if (flID == 0) glares.push(new Glare(createVector(petalcenter.x * 1.5 - home.x, petalcenter.y * 1.2 - home.y)));
}