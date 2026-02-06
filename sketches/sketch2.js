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

    // Road
    p.fill(60);
    p.rect(0, h * 0.65, w, h * 0.35);

    // taxi
    if (p.taxiX === undefined) p.taxiX = -550;
    const taxiW = 500;
    p.taxiX += 4;

    // reset only after taxi fully exits right
    if (p.taxiX > w + taxiW) {
      p.taxiX = -taxiW;
    }

    const taxiY = h * 0.70;

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
  };

  p.windowResized = function () {
    p.resizeCanvas(canvasW(), canvasH());
  };
});
