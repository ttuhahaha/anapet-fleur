function newpetal() {
    for (let flID = 0; flID < layers.length; flID++)
        for (let petalcount = 0; petalcount < layers[flID].petals; petalcount++) {
            petals.push(new Petal(flID, petalcount, petals.length));
        };
}

class Petal {
    constructor(flID, petalcount, ID) {
        let layer = layers[flID];
        this.flID = flID;
        this.petalcount = petalcount;
        let rotation = home.heading() + flID;
        this.mid = sw * (TWO_PI / layer.petals) + petalcount * (TWO_PI / layer.petals) + rotation;
        this.petalcenter = p5.Vector.fromAngle(
            this.mid + (noise(petalcount) - 0.5) / 2,
            layer.t3R
        );
        ///        if (home.mag() > bx * 5 && TYPE == 2) {
        ///            this.t = (flID / 15);
        ///            this.LSstep *= 1 + flID * 0.2;
        ///        }
        this.particles = [];
        this.angle = petalcount * (TWO_PI / layer.petals) + rotation;
        if (layer.closed) {
            this.petalcenter.mult(noise(petalcount));
            if (TYPE == 4) this.petalcenter.mult(noise(petalcount));
        };
        this.petalcenter.add(layer.thome);
        this.createparticle(layer, ID);
    }

    createparticle(layer, ID) {
        for (let i = wr; i <= 1 - wr; i += this.pointy ? 5 / (layer.R * Q) : 2 / (layer.R * Q)) {
            let a =
                i * (TWO_PI / layer.petals) +
                this.angle;
            this.particles.push(new Particle(this, a, layer, ID));
        }
        this.particles.forEach(x => {
            if (this.particles.indexOf(x) == 3) {
                x.color1[2] += 50;
                x.sw1 *= 3
            }
        });
    }

    drawpetal() {
        if (frameCount / 10 > this.flID) {
            for (let p of this.particles) {
                if (p.t < 1) { // && this.particles.indexOf(p) % 50 == 0){// && this.particles.indexOf(p) % 2 == frameCount % 2) {
                    p.update();
                    if (!p.outside() && p.t > p.t0) {
                        p.draw()
                    }
                    p.prevpos = p.pos.copy();
                }
            }
        }
    }

    drawpetalrandom() { //need to turn off redefine in seclayer
        if (frameCount / 20 > this.flID) {
            if (frameCount % 5 == 0) {
                let check = this.particles[floor(random(this.particles.length))];
                //if (check.redef < 2) 
                check.redefine()
            }
            for (let p of this.particles) {
                if (p.t < 1) { // && this.particles.indexOf(p) % 50 == 0){// && this.particles.indexOf(p) % 2 == frameCount % 2) {
                    p.update();
                    if (!p.outside() && p.t > p.t0) {
                        p.draw()
                    }
                    p.prevpos = p.pos.copy();
                }
            }
        }
        this.particles.filter(x => !x.dead())
    }

    checkangle() {
        //        if (abs(degrees(this.angle) % 360) < (frameCount % 450) && abs(degrees(this.angle) % 360) > ((frameCount - 1) % 450)) this.particles.forEach(x => x.redefineoutside(1));
        if (frameCount % 500 == 0) petals[floor(random(petals.length))].particles.forEach(x => x.redefinerandom());
    }

    seclayer() {
        if (this.flID < 3) {
            for (let p of this.particles) {
                //   if (random()>0.6) 
                while (p.t < 1) {
                    p.update();
                    p.drawseclayer();
                    p.prevpos = p.pos.copy();
                }
                //                p.redefine();
            }
        }
    }
}

class Particle {
    constructor(parent, angle, layer, ID) {
        this.pos = this.prevpos = home.copy();
        this.t = this.t0 = 0;
        this.parent = ID;
        let LS = TYPE == 1 ? map((angle - parent.mid), -1, 1, -25, 0) :
            map(abs(angle - parent.mid), 0, 1, -50, 0);
        let thishu = (noise(angle) - 0.5) * 100 + hu + parent.flID * 10;
        LS *= noise(thishu);
        let PQ = floor((bx * 2 - parent.flID) * 3);
        this.speed = (noise(thishu) / 2 + 0.5) *2 / PQ;
        if (TYPE == 4) {
            this.t = this.t0 = (0.6 + parent.flID / 40);
            this.speed *= 0.4;
        }
        this.T1 = p5.Vector.fromAngle(angle, layer.R);
        this.T1.add(home);
        if (layer.pointy || (layer.closed && TYPE != 4)) {
            angle = parent.mid;
        }
        this.T2 = p5.Vector.fromAngle(angle, layer.t2R);
        this.T2.add(layer.thome);
        this.sparkle = random() > 0.6;
        // if (random() > 0.9) {
        //     this.speed *= 1.3;
        //     this.sparkle = true;
        // }
        this.halo = random() > 0.8;
        this.color0 = [thishu + LS, 100, LS * 0.5];
        this.color1 = [thishu + 40 * (feature % 4), 100, 80];
//        this.redef = 0;
        if (parent.flID > 2) {
//            this.redef = 1;
            this.t = 1.1
        }
    }

    update() {
        this.pos = this.updatepos(this.t);
        this.t += this.speed;
    }

    outside() {
        let x = this.prevpos.x + tx;
        let y = this.prevpos.y + ty;
        return x > width + 3 * bx || x < -3 * bx || y > height + 3 * bx || y < -3 * bx
    }

    updatepos(t) {
        let x = (1 - t) ** 3 * home.x + 3 * (1 - t) ** 2 * t * this.T1.x + 3 * (1 - t) * t ** 2 * this.T2.x + t ** 3 * petals[this.parent].petalcenter.x;
        let y = (1 - t) ** 3 * home.y + 3 * (1 - t) ** 2 * t * this.T1.y + 3 * (1 - t) * t ** 2 * this.T2.y + t ** 3 * petals[this.parent].petalcenter.y;
        return createVector(x, TYPE == 4 ? y / 2 : y)
    }

    sw(sparkle) {
        return map(this.t, this.t0, 1, 0, sparkle ? bx / 6 : bx / 50)
    }

    color(sparkle, a) {
        let h = map(this.t, this.t0, 1, this.color0[0], this.color1[0]);
        let s = map(this.t, this.t0, 1, this.color0[1], this.color1[1]);
        let l = map(this.t, this.t0, 1, this.color0[2], this.color1[2]);
        return color(h % 360, s, sparkle? l * 4 : l, a ? a : 1);
    }

    line(canvas) {
        canvas.strokeWeight(this.sw())
        canvas.line(this.pos.x + tx, this.pos.y + ty, this.prevpos.x + tx, this.prevpos.y + ty)
    }

    draw() {
        //if (this.sparkle)         
        g1.blendMode(LIGHTEST);//needed for sparkle layer//
        if (this.t0 == 0 || TYPE == 4) {
            g1.stroke(this.color());
            this.line(g1);
        }
        if (this.sparkle) this.drawsparkle();
        if (this.halo && this.t > 0.4) this.drawhalo();
    }

    drawseclayer() {
        let x = TYPE == 4 ? 1.3 : 2; //flID * 1.5 + 1.5;
        let y = TYPE == 4 ? 1.2 : 1; //(x - 1) * 1.5
        g2.stroke(this.color());
        g2.strokeWeight(0.1);
        g2.line(this.prevpos.x * x - y * home.x + tx, this.prevpos.y * x - y * home.y + ty, this.pos.x * x - y * home.x + tx, this.pos.y * x - y * home.y + ty);
    }

    drawsparkle() {
        stroke(this.color(1));
        strokeWeight(this.sw(1));
        if (this.sparkle) {
            line(this.pos.x, this.pos.y, this.prevpos.x, this.prevpos.y)
        } else {
            point(this.pos.x, this.pos.y);
        }
    }

    redefineoutside() {
        if (petals[this.parent].particles.indexOf(this) < 2 || petals[this.parent].particles.indexOf(this) > petals[this.parent].particles.length - 5) this.redefine(1);
    }

    redefinerandom() {
        if (random() > 0.8)
            this.redefine(1);
    }

    redefine(x) { //empty = redef for main flower, 1 = for sparkle, not sparkle = sparkle 1st time
        this.t = this.t0;
        this.pos = this.prevpos = home.copy();
        if (x && !this.t0 == 0.3) { //first sparkle redef
            //    this.speed = 2;
            //    this.LSstep *= 2;
            this.sparkle = true;
            this.halo = random() > 0.5;
            this.t0 = 0.3;
        }
        if (x) this.t0 = 0.3
//       this.redef++;
    }

    drawhalo() {
        for (i = 5; i > 1; i--) {
            strokeWeight(nzr() * min((this.t * 5 - i) * bx * 2, bx * 4));
            stroke(this.color(1, 0.05));
            point(
                TYPE == 4 ? this.pos.x : this.pos.x * (this.t + 2),
                TYPE == 4 ? this.pos.y * 1.5 + this.t * bx * 20 : this.pos.y * 2 + 1 - home.y * 2
            );
        }
    }

    dead() {
        return this.t >= 1 && this.redef > 2;
    }
}

function sparkle() {
    //     //  if (frameCount % 150 == 0) {
    //     // petals[floor(random() * petals.length)].particles.forEach(x => x.redefine());
    //     //      let angle = random(630);
    //     petals.forEach(x => x.checkangle())
    if (frameCount % 5 == 0) petals[floor(random(petals.length))].particles.forEach(x => x.redefineoutside())
}