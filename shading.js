let counter = 0;
function drawbg(x1, y1, x2, y2, x3, y3, x4, y4, step) {
  if (counter <= step) {
    let v1 = createVector(x1, y1);
    let v2 = createVector(x2, y2);
    let v3 = createVector(x3, y3);
    let v4 = createVector(x4, y4);
    let point1 = p5.Vector.lerp(v1, v2, counter / step);
    let point2 = p5.Vector.lerp(v3, v4, counter / step);
    push();
    stroke(30);
    strokeWeight(random(2));
    line(
      point1.x + random(-5, 5),
      point1.y + random(-5, 5),
      point2.x + random(-5, 5),
      point2.y + random(-5, 5)
    );
    pop();
    counter++;
    console.log(frameCount);
  } else {
    counter = 0;
    return false;
  }
}
