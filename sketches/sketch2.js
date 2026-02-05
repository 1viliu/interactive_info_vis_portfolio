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

    
  };

  p.windowResized = function () {
    p.resizeCanvas(canvasW(), canvasH());
  };
});
