// HW 5
registerSketch('sk5', function (p) {
  function canvasW() { return Math.min(1080, p.windowWidth); }
  function canvasH() { return Math.min(1080, p.windowHeight); }

  let table, world;
  let points = [];

  // UI
  let priceSelect;
  let selectedPriceLen = 0; // 0 = All
  let starSelect;
  let selectedStars = 0; // 0 = All

  // Camera
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  p.mousePressed = function () {
    const pad = 20;
    const uiX = p.width - 180 - pad;
    const uiYTop = p.height - 140 - pad; // top dropdown

    // If clicking in UI zone, don't drag map
    if (p.mouseX >= uiX && p.mouseY >= uiYTop) return;

    dragging = true;
    lastX = p.mouseX;
    lastY = p.mouseY;
  };

  p.mouseReleased = function () {
    dragging = false;
  };

  p.mouseDragged = function () {
    if (!dragging) return;

    panX += (p.mouseX - lastX);
    panY += (p.mouseY - lastY);

    lastX = p.mouseX;
    lastY = p.mouseY;
  };

  p.mouseWheel = function (event) {
    const zoomFactor = event.delta > 0 ? 0.9 : 1.1;

    // world coords under mouse before zoom
    const wx = (p.mouseX - panX) / zoom;
    const wy = (p.mouseY - panY) / zoom;

    zoom = p.constrain(zoom * zoomFactor, 0.5, 20);

    // keep the same world point under the mouse after zoom
    panX = p.mouseX - wx * zoom;
    panY = p.mouseY - wy * zoom;

    return false; // prevent page scroll
  };

  function worldToScreen(wx, wy) {
    return { x: wx * zoom + panX, y: wy * zoom + panY };
  }

  function drawTooltip(px, py, title, body) {
    const pad = 8;
    p.textSize(12);
    p.textAlign(p.LEFT, p.TOP);

    const lines = [title, ...body.split("\n")];

    let maxW = 0;
    for (let line of lines) {
      maxW = Math.max(maxW, p.textWidth(line));
    }

    const lineHeight = 14;
    const w = maxW + pad * 2;
    const h = lines.length * lineHeight + pad * 2;

    let x = px + 12;
    let y = py + 12;
    x = p.constrain(x, 0, p.width - w);
    y = p.constrain(y, 0, p.height - h);

    p.fill(255, 245);
    p.stroke(0);
    p.rect(x, y, w, h, 8);

    p.noStroke();
    p.fill(0);

    for (let i = 0; i < lines.length; i++) {
      p.text(lines[i], x + pad, y + pad + i * lineHeight);
    }
  }

  function mercator(lat, lon) {
    lat = p.constrain(lat, -85, 85);
    const x = (lon + 180) / 360 * p.width;

    const latRad = lat * Math.PI / 180;
    const y = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * p.height;

    return { x, y };
  }

  function drawGeoJSON(g) {
    // g: parsed GeoJSON
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);

    for (const feature of g.features) {
      const geom = feature.geometry;
      if (!geom) continue;

      if (geom.type === "Polygon") drawPolygon(geom.coordinates);
      else if (geom.type === "MultiPolygon") {
        for (const poly of geom.coordinates) drawPolygon(poly);
      }
    }
  }

  function drawPolygon(rings) {
    // rings: [ [ [lon,lat], ... ] , [hole], ... ]
    for (const ring of rings) {
      p.beginShape();
      for (const coord of ring) {
        const lon = coord[0];
        const lat = coord[1];
        const pos = mercator(lat, lon);
        p.vertex(pos.x, pos.y);
      }
      p.endShape(p.CLOSE);
    }
  }

  // Convert any "$$$" / "€€" / etc -> length (1..4). Returns 0 if missing.
  function priceLen(priceStr) {
    if (!priceStr) return 0;
    const s = String(priceStr).trim();
    if (!s) return 0;
    return p.constrain(s.length, 0, 4);
  }

  p.preload = function () {
    table = p.loadTable("michelin-reviews-csv-attempt-1.csv", "csv", "header");
    world = p.loadJSON("countries.geojson");
  };

  p.setup = function () {
    p.createCanvas(canvasW(), canvasH());

    // Build points once
    for (let r of table.getRows()) {
      const lat = Number(r.getString("Latitude"));
      const lon = Number(r.getString("Longitude"));
      const name = r.getString("Name") || r.getString("Restaurant Name") || "";
      const address = r.getString("Address") || "";
      if (Number.isNaN(lat) || Number.isNaN(lon)) continue;

      const pRaw = r.getString("Price");
      const pLen = priceLen(pRaw);

      const award = r.getString("Award") || "";
      let stars = 0;
      if (award.includes("3")) stars = 3;
      else if (award.includes("2")) stars = 2;
      else if (award.includes("1")) stars = 1;

      points.push({
        lat,
        lon,
        priceLen: pLen,
        stars,
        name,
        address,
        priceRaw: pRaw
      });
    }

    // Price dropdown
    priceSelect = p.createSelect();
    priceSelect.option("All", "0");
    priceSelect.option("$", "1");
    priceSelect.option("$$", "2");
    priceSelect.option("$$$", "3");
    priceSelect.option("$$$$", "4");
    priceSelect.style("font-size", "20px");
    priceSelect.style("padding", "10px");
    priceSelect.style("border-radius", "10px");
    priceSelect.style("border", "3px solid #333");
    priceSelect.style("background", "#ffffff");
    priceSelect.style("cursor", "pointer");
    priceSelect.changed(() => {
      selectedPriceLen = Number(priceSelect.value());
    });

    // Stars dropdown
    starSelect = p.createSelect();
    starSelect.option("All", "0");
    starSelect.option("1 ★", "1");
    starSelect.option("2 ★", "2");
    starSelect.option("3 ★", "3");
    starSelect.style("font-size", "20px");
    starSelect.style("padding", "10px");
    starSelect.style("border-radius", "10px");
    starSelect.style("border", "3px solid #333");
    starSelect.style("background", "#ffffff");
    starSelect.style("cursor", "pointer");
    starSelect.changed(() => {
      selectedStars = Number(starSelect.value());
    });

    selectedPriceLen = 0;
    selectedStars = 0;
  };

  p.draw = function () {
    p.background(245);

    // Title background strip
    p.fill(255, 240);
    p.noStroke();
    p.rect(0, 0, p.width, 70);

    // Title text
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(28);
    p.textStyle(p.BOLD);
    p.text("Michelin Star Restaurants Around the World", p.width / 2, 35);

    p.push();
    p.translate(panX, panY);
    p.scale(zoom);

    // countries + points get drawn inside the camera transform
    drawGeoJSON(world);

    // restaurants
    let hovered = null;

    for (let pt of points) {
      if (selectedPriceLen !== 0 && pt.priceLen !== selectedPriceLen) continue;
      if (selectedStars !== 0 && pt.stars !== selectedStars) continue;

      const m = mercator(pt.lat, pt.lon);
      const s = worldToScreen(m.x, m.y);

      const hoverRadius = 10; // bigger hover area
      const isHover = p.dist(p.mouseX, p.mouseY, s.x, s.y) < hoverRadius;

      if (isHover) hovered = { pt, sX: s.x, sY: s.y };
    }

    p.noStroke();
    p.fill(0);

    for (let pt of points) {
      if (selectedPriceLen !== 0 && pt.priceLen !== selectedPriceLen) continue;
      if (selectedStars !== 0 && pt.stars !== selectedStars) continue;

      const m = mercator(pt.lat, pt.lon);

      // convert to screen space for hover detection
      const s = worldToScreen(m.x, m.y);

      const r = 6; // hover radius in pixels
      const isHover = p.dist(p.mouseX, p.mouseY, s.x, s.y) < r;

      if (isHover) hovered = { pt, sX: s.x, sY: s.y };

      // draw dot in world space (still inside your push/translate/scale)
      p.circle(m.x, m.y, 4 / zoom);
    }

    p.pop();

    for (let pt of points) {
      if (selectedPriceLen !== 0 && pt.priceLen !== selectedPriceLen) continue;
      if (selectedStars !== 0 && pt.stars !== selectedStars) continue;

      const m = mercator(pt.lat, pt.lon);
      const s = worldToScreen(m.x, m.y);

      p.noStroke();
      p.fill(30, 144, 255); // nice blue
      p.circle(s.x, s.y, 14); // fixed size, always 14px
    }

    if (hovered) {
      // highlight ring
      p.noFill();
      p.stroke(0);
      p.circle(hovered.sX, hovered.sY, 12);
      const starText = hovered.pt.stars > 0 ? "⭐".repeat(hovered.pt.stars) : "";
      const priceText = hovered.pt.priceRaw || "";

      // tooltip
      drawTooltip(
        hovered.sX,
        hovered.sY,
        hovered.pt.name,
        `${hovered.pt.address}
      ${starText}   ${priceText}`
      );    
    }

    const pad = 20;
    starSelect.position(p.width - 180 - pad, p.height - 70 - pad);
    priceSelect.position(p.width - 180 - pad, p.height - 140 - pad);
  };

  p.windowResized = function () {
    p.resizeCanvas(canvasW(), canvasH());
  };
});
