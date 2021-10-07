let counter = 0;
function drawbg(step) {

  if (counter <= step) {
    if (frameCount % (Q * 5) == 0) {
      push();
      translate(width / 2, height / 2);
      rotate(noise(1) * 5);
      stroke((noise(frameCount/500) * hu + 100) % 360, 100, 50, 0.001);
      if (nz() > 0.7) stroke(0, 0, 0, 0.02);
      strokeWeight(nz()*bx*5);
      line(
        -width,
        (frameCount % height) / 10 + noise(frameCount / 500),
        2 * width,
        (frameCount % height) + noise(frameCount / 500)
      );
      pop();
      counter++;
    }
  }
}
