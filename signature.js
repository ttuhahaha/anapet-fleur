let a = [-10, -8, -16, 4, -11, -23, -11, -5];
let n = [-10, -9, -11, 2, -9, -16, -8, -5];
let n1 = [-8, -9, -9, 3, -6, -18, -6, -5];
let prevposx ;
let prevposy ;
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
  let t = ((frameCount - start) % 30) / 29;
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
  if (prevposx == null) {prevposx = thisposx;
    prevposy = thisposy;}
}