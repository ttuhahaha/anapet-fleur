let a = [-65, -47, -101, 25, -68, -140, -65, -30];
let n = [-60, -54, -65, 12, -55, -103, -50, -30];
let n1 = [-47, -55, -52, 20, -40, -113, -33, -30];
let prevposx = a[0];
let prevposy = a[1];
let ltr = a;  

function signature(start) {
  push();
  translate(100 * bx, 100 * by);
  if (frameCount == start) ltr = a;
  if (frameCount == start + 30) ltr = n;
  if (frameCount == start + 60) ltr = n1;
  if (frameCount == start + 89) noLoop();
  letter(ltr, start);
  strokeWeight(2);
  stroke(20);
  line(prevposx, prevposy, thisposx, thisposy);
  prevposx = thisposx;
  prevposy = thisposy;
  pop();
}

function letter(a, start) {
  let t = ((frameCount-start) % 30) / 29;
  thisposx =
    (1 - t) ** 3 * a[0] +
    3 * (1 - t) ** 2 * t * a[2] +
    3 * (1 - t) * t ** 2 * a[4] +
    t ** 3 * a[6];
  thisposy =
    (1 - t) ** 3 * a[1] +
    3 * (1 - t) ** 2 * t * a[3] +
    3 * (1 - t) * t ** 2 * a[5] +
    t ** 3 * a[7];
}
