// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {

  function canvasW() { return Math.min(800, p.windowWidth); }
  function canvasH() { return Math.min(800, p.windowHeight); }

  p.setup = function () {
    p.createCanvas(canvasW(), canvasH());
    p.noStroke();

    // pace slider
    paceSlider = p.createSlider(3.0, 12.0, 7.75, 0.05);
    paceSlider.style('width', '220px');
  };

  p.draw = function () {
    const w = p.width;
    const h = p.height;
    
    // place slider
    paceSlider.position(20, 150);

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

    // face details
      // digital clock
      const hr = p.hour();
      const min = p.minute();
      const hr12 = (hr % 12 === 0) ? 12 : (hr % 12);
      const timeStr = `${hr12}:${min.toString().padStart(2, "0")}`;

      // pace from slider (min/mi)
      const paceMinPerMile = paceSlider.value();

      // format pace
      const paceMin = Math.floor(paceMinPerMile);
      const paceSec = Math.round((paceMinPerMile - paceMin) * 60);
      const paceStr = `${paceMin}:${paceSec.toString().padStart(2, "0")}`;

      // distance grows over time based on pace; resets on refresh because millis resets
      const runMinutes = (p.millis() / 1000) / 60;
      const distMiles = runMinutes / paceMinPerMile;

      // slider label
      p.fill(40);
      p.textAlign(p.LEFT, p.CENTER);
      p.textStyle(p.BOLD);
      p.textSize(16);
      p.text(`PACE: ${paceStr} /mi`, 20, 55);

      p.textAlign(p.CENTER, p.CENTER);

      // time
      const topY = cy - d * 0.25;
      p.fill(235);
      p.textStyle(p.BOLD);
      p.textSize(d * 0.18);
      p.text(timeStr, cx, topY);

      // pace
      const midY = cy;
      const leftX = cx - d * 0.22;
      const rightX = cx + d * 0.22;

      // labels
      p.fill(160);
      p.textStyle(p.NORMAL);
      p.textSize(d * 0.07);
      p.text("PACE", leftX, midY - d * 0.12);
      p.text("DIST", rightX, midY - d * 0.12);

      // values
      p.fill(235);
      p.textStyle(p.BOLD);
      p.textSize(d * 0.12);
      p.text(paceStr, leftX, midY);
      p.text(distMiles.toFixed(2), rightX, midY);

      // units
      p.fill(160);
      p.textStyle(p.NORMAL);
      p.textSize(d * 0.06);
      p.text("/mi", leftX, midY + d * 0.11);
      p.text("mi", rightX, midY + d * 0.11);

    // end face details
  };

  p.windowResized = function () {
    p.resizeCanvas(canvasW(), canvasH());
  };
});
