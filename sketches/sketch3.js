// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  
  function canvasW() { return Math.min(800, p.windowWidth); }
  function canvasH() { return Math.min(800, p.windowHeight); }

  p.setup = function () {
    p.createCanvas(canvasW(), canvasH());
    p.noStroke();
  };

  p.draw = function () {
    const w = p.width;
    const h = p.height;

    // sky
    p.background(150, 190, 225);

    // building
    p.fill(145, 95, 60);
    p.rect(0, h * 0.15, w * 0.85, h * 0.85);

    // darker base
    p.fill(120, 75, 45);
    p.rect(0, h * 0.75, w * 0.85, h * 0.25);

    // awning
    p.fill(120, 75, 45);
    p.rect(0, h * 0.15, w * 0.85, h * 0.175);

    // awning text
    p.fill(210, 170, 85);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(w * 0.1);
    p.textStyle(p.BOLD);

    p.text(
      "BARBER SHOP",
      w * 0.425,
      h * 0.25
    );

    // window frame
    p.fill(120, 75, 45);    
    p.rect(w * 0.3, h * 0.375, w * 0.525, h * 0.35);

    // window glass
    p.fill(200, 220, 230);
    p.rect(w * 0.325, h * 0.4, w * 0.475, h * 0.30);

    // door
    p.fill(90, 55, 35);
    p.rect(w * 0.025, h * 0.375, w * 0.25, h * 0.5);

    // door window
    p.fill(200, 220, 230);
    p.rect(w * 0.05, h * 0.4, w * 0.2, h * 0.3);

    // open sign
    const signX = w * 0.075;
    const signY = h * 0.475;
    const signW = w * 0.15;
    const signH = h * 0.2;

    // blue inner
    const blueX = w * 0.085;
    const blueY = h * 0.535;
    const blueW = w * 0.13;
    const blueH = h * 0.13;

    // open sign + blue
    p.fill(255);
    p.rect(signX, signY, signW, signH);

    p.fill(173, 216, 230);
    p.rect(blueX, blueY, blueW, blueH);

    // center blue square
    const cx = blueX + blueW / 2;
    const cy = blueY + blueH / 2;

    // clock circle
    p.fill(255);
    p.ellipse(cx, cy, blueW * 0.9, blueH * 0.9);

    // ground
    p.fill(180, 170, 160);
    p.rect(0, h * 0.85, w, h * 0.15);

    // bush
    p.fill(70, 140, 85);
    p.ellipse(w * 0.82, h * 0.82, w * 0.35, h * 0.3);
    p.ellipse(w * 0.72, h * 0.86, w * 0.3, h * 0.25);
    p.ellipse(w * 0.88, h * 0.88, w * 0.28, h * 0.22);
  };

  p.windowResized = function () {
    p.resizeCanvas(canvasW(), canvasH());
  };
});
