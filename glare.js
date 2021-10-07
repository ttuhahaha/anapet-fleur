let glares = [];

function glare() {
    if (frameCount % (50 * Q) == 0) {
        let glare = new(Glare);
        glare.draw2();
    }

    //    if (frameCount % 10 == 0) glares.forEach(p => p.draw1())
}

class Glare {
    constructor() {
        this.posx = width * nz() + noise(hu);
        this.posy = height * nz() + noise(sw);
        this.color = color(nz(1)*hu, 100, 50, 0.05);
        this.radius = nz() * 50
    }
    draw() {
        stroke(this.color);
        line(this.posx, this.posy, this.posx + nz(1) * bx * 5, this.posy + nz(1) * by * 5);
    }
    draw1() {
        push()
        stroke(this.color)
        strokeWeight(nz() * 70)
        point(this.posx, this.posy)
        pop()
    }
    draw2() {
        push()
        noStroke()
        fill(this.color)
        beginShape();
        for (let a = 0; a < TWO_PI; a += PI / 3) {
            let sx = cos(a) * this.radius + this.posx;
            let sy = sin(a) * this.radius + this.posy;
            vertex(sx, sy);
        }
        endShape(CLOSE);
        pop()
    }
}