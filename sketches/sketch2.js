// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  function canvasW() { return Math.min(800, p.windowWidth); }
  function canvasH() { return Math.min(800, p.windowHeight); }

  p.setup = function () {
    p.createCanvas(canvasW(), canvasH());
    p.noStroke();
  };

  p.draw = function () {
    const w = p.width;
    const h = p.height;

    // background
    p.background(200);

    // road
    p.fill(60);
    p.rect(0, h * 0.65, w, h * 0.35);

    if (p.taxiX === undefined) {
      p.taxiX = -550;
      p.lastSecond = p.second();
    }

    const taxiW = 500;
    const taxiY = h * 0.70;

    // movement
    const currentSecond = p.second();
    if (currentSecond !== p.lastSecond) {
      p.taxiX += 50; // px per second
      p.lastSecond = currentSecond;
    }

    // reset
    if (p.taxiX > w + taxiW) {
      p.taxiX = -taxiW;
    }

    // wheels
    p.fill(20);
    p.ellipse(p.taxiX + 90,  taxiY + 90, 70, 70);
    p.ellipse(p.taxiX + 410, taxiY + 90, 70, 70);

    // taxi body
    p.fill(245, 210, 60);
    p.rect(p.taxiX, taxiY, taxiW, 120, 20);

    // roof
    p.rect(p.taxiX + 120, taxiY - 70, 260, 80, 20);

    // ad screen base
    p.fill(30);
    p.rect(p.taxiX + 200, taxiY - 120, 120, 40, 8);

    // ad screen placeholder
    p.fill(180);
    p.rect(p.taxiX + 208, taxiY - 114, 104, 28, 6);

    // clock
    const hr = p.hour();
    const min = p.minute();
    const sec = p.second();

    const timeStr =
      p.nf(hr, 2) + ":" + p.nf(min, 2) + ":" + p.nf(sec, 2);

    p.fill(0, 255, 180); // digital clock green
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text(timeStr, p.taxiX + 260, taxiY - 100);
  };

  p.windowResized = function () {
    p.resizeCanvas(canvasW(), canvasH());
  };
});
