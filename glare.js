let glares = [];
function glare() {
//    let glare = new Glare();
if (frameCount % 5 == 0)    
glares.push( new Glare()); 
    glares.forEach (p => p.draw())
//if (glares.length > 100) glares.splice(0,1)
    }
    
    class Glare {
        constructor () {
            this.pos = createVector((100 - translation[0]) * bx * nz()*5, (100 - translation[1]) * by * nz()*5);
    //        this.size = nz() * bx * 10;
            this.color = color(hu, 100,100,0.01)
    //        this.prevpos = this.pos.copy()
        }

        draw () {
            stroke(this.color);
            line (this.pos.x, this.pos.y, this.pos.x+(nz()-0.5)*bx*5, this.pos.y+(nz()-0.5)*by*5);
        }

        draw1() {
            //fill(this.color);
            //noStroke();
            stroke(this.color)
            strokeWeight(5)
            noFill()
            ellipse(this.pos[0]+(frameCount%100)*10, this.pos[1], this.size*nz());
        }
        draw2() {
            stroke(this.color)
            this.pos.y -=15;
            this.pos.x = this.pos.x + cos(this.pos.y)*50;
            line(this.prevpos.x, this.prevpos.y, this.pos.x, this.pos.y)


            this.prevpos = this.pos.copy()
        }
    }