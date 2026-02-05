// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {

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
    p.background(200, 230, 240);

    // distant trees
    p.fill(95, 155, 105);
    p.ellipse(w * 0.2, h * 0.45, w * 0.5, h * 0.3);
    p.ellipse(w * 0.6, h * 0.42, w * 0.6, h * 0.35);
    p.ellipse(w * 0.85, h * 0.46, w * 0.4, h * 0.25);

    // ground
    p.fill(175, 170, 160);
    p.rect(0, h * 0.55, w, h * 0.45);

    // --- arm (simple band across screen) ---
    p.fill(215, 180, 150);
    p.rect(0, h * 0.35, w * 0.85, h * 0.30);

    // --- watch band ---
    p.fill(40);
    p.rect(w * 0.42, h * 0.42, w * 0.16, h * 0.25, w * 0.03);
    p.rect(w * 0.42, h * 0.33, w * 0.16, h * 0.25, w * 0.03);

    // --- watch body (circle only) ---
    const cx = w * 0.5;
    const cy = h * 0.5;
    const d = w * 0.30;

    // outer case
    p.fill(35);
    p.ellipse(cx, cy, d * 1.08, d * 1.08);

    // inner face placeholder
    p.fill(15);
    p.ellipse(cx, cy, d, d);

    // watch time
      const hr = p.hour();
      const min = p.minute();
      const sec = p.second();

      // format as digital
      const hr12 = (hr % 12 === 0) ? 12 : (hr % 12);
      const timeStr = `${hr12}:${min.toString().padStart(2, "0")}`;

      // top quadrant position
      const topY = cy - d * 0.25;

      // time text
      p.fill(235);
      p.textAlign(p.CENTER, p.CENTER);
      p.textStyle(p.BOLD);
      p.textSize(d * 0.18);
      p.text(timeStr, cx, topY);

      // optional small seconds (comment out if you don't want it)
      p.fill(170);
      p.textStyle(p.NORMAL);
      p.textSize(d * 0.08);
      p.text(sec.toString().padStart(2, "0"), cx + d * 0.28, topY);

  };

  p.windowResized = function () {
    p.resizeCanvas(canvasW(), canvasH());
  };
});
