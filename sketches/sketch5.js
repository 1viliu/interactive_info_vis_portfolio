// HW 5
registerSketch('sk5', function (p) {
  function canvasW() { return Math.min(800, p.windowWidth); }
  function canvasH() { return Math.min(800, p.windowHeight); }

  let table, world;
  let points = [];

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

  p.preload = function () {
    table = p.loadTable("michelin-reviews-csv-attempt-1.csv", "csv", "header");
    world = p.loadJSON("countries.geojson");
  };

  p.setup = function () {
    p.createCanvas(canvasW(), canvasH());

    for (let r of table.getRows()) {
      const lat = Number(r.getString("Latitude"));
      const lon = Number(r.getString("Longitude"));
      if (!Number.isNaN(lat) && !Number.isNaN(lon)) points.push({ lat, lon });
    }
  };

  p.draw = function () {
    p.background(245);

    // countries
    drawGeoJSON(world);

    // restaurants
    p.noStroke();
    p.fill(0);
    for (let pt of points) {
      const pos = mercator(pt.lat, pt.lon);
      p.circle(pos.x, pos.y, 4);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(canvasW(), canvasH());
  };
});
