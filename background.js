let counter = 0;
function drawbg(step) {
  if (counter <= step) {
    if (frameCount % (Q * 5) == 0) {
      push();
      translate(width / 2, height / 2);
      rotate(noise(1) * 5);
      stroke((noise(frameCount/500) * hu + 100) % 360, 100, 50, 0.002);
      if (nzr() > 0.8) stroke(0, 0, 0, 0.02);
      strokeWeight(nzr()*bx*5);
      line(
        -width,
        (frameCount) / 10 + noise(frameCount / 500),
        2 * width,
        (frameCount ) + noise(frameCount / 500)
      );
      pop();
      counter++;
    }
  }
}
