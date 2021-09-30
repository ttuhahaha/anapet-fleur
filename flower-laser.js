// laser etching

function drawflower(petals, radius, homex, homey, rotation) {
console.log (linesx.length)
//  redrawall();
  //initiate new petal//
  if (particles.length == 0 && petalcount < petals) {
    for (let i = 0; i < (TWO_PI / petals) * (quality * 100); i++) {
      let angle =
        i * (TWO_PI / petals / (quality * 100)) +
        petalcount * (TWO_PI / petals) +
        rotation;
      particles.push(
        new Particle(angle, petals, radius, homex, homey, rotation)
      );
    }
    midpoint(petals, radius, homex, homey, rotation);
    petalcount++;
  }

  if (petalcount == petals) {
    petalcount = 0;
  }
  //draw petal//
  for (let particle of particles) {
    
     if (particle.lifespan > 60) {
       particle.drawpetal ();
    } else {
      particle.lifespan += 1 / quality ** 2;
//      particle.updatepetal ();
//      particle.prevPosition = particle.position.copy ();
    }
   } 
  
  //particles.forEach (p => p.drawpetal());
  
  //ray
 let p = particles[round(random(0,particles.length-1))]
 if (p) p.ray();
}

function midpoint(petals, radius, homex, homey, rotation) {
  let mid = ((2 * petalcount + 1) * (TWO_PI / petals)) / 2 + rotation;
  petalcenter = p5.Vector.fromAngle(
    mid,
    radius * 2 + random(-radius / 3, radius / 3)
  );
  petalcenter.add(homex * 2, homey * 2);
}

class Particle {
  constructor(angle, petals, radius, homex, homey, rotation) {
//    this.color = color(random(80, 255), random(0, 70), random(0, 70), 0);
    let mid = ((2 * petalcount + 1) * (TWO_PI / petals)) / 2 + rotation;
    this.color = color('hsb(0, 100%, 100%)'); //remove abs for swirled
//    this.color = color ((map(abs(angle - mid)), 0, 0.5, 100, 255) ,0, 0)
    this.home = createVector(homex, homey);
    this.position = this.home.copy();
    this.prevPosition = this.position.copy();
    this.velocity = p5.Vector.fromAngle(angle);
    this.lifespan = 0;
    this.target1 = p5.Vector.fromAngle(angle, radius);
    this.target1.add(this.home);
    this.target2 = p5.Vector.fromAngle(angle, radius * 1.2);
    this.target2.add(homex * 2, homey * 2)
  }

  updatepetal() {
    let t = (frameCount % (100 * quality)) / (100 * quality); //step

    //bezier 4 point//
    this.position.x =
      (1 - t) ** 3 * this.home.x +
      3 * (1 - t) ** 2 * t * this.target1.x +
      3 * (1 - t) * t ** 2 * this.target2.x +
      t ** 3 * petalcenter.x;
    this.position.y =
      (1 - t) ** 3 * this.home.y +
      3 * (1 - t) ** 2 * t * this.target1.y +
      3 * (1 - t) * t ** 2 * this.target2.y +
      t ** 3 * petalcenter.y;

    this.lifespan += 1 / quality ** 2;
    this.color = this.color = color('hsb(0, 100%, ' + this.lifespan/4 + '%)');
  }

  drawpetal() {
    this.updatepetal();
    if (frameCount % (100 * quality) == 0) {
      this.color.setAlpha(0);
      particles = [];
    }

    stroke(this.color);
    // line(
    //   this.prevPosition.x,
    //   this.prevPosition.y,
    //   this.position.x,
    //   this.position.y
    // );
    // this.prevPosition = this.position.copy();
    linesx.push(this.position.x);
    linesy.push (this.position.y);
    linesc.push (this.color);
    
    //points
     // strokeWeight (1)
     // point (this.position.x, this.position.y)
  }
  
  ray(){
    push()
    strokeWeight (1);
    line (-80 * bx, -80 * by, this.position.x, this.position.y);
    pop()
  }
}

function redrawall() {
  for (let i = 0; i < linesx.length; i++) {
    stroke (linesc[i]);
    strokeWeight (2);
    point (linesx[i], linesy[i])
  }
  
}