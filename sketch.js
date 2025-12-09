// ===== 공통 설정 =====
let font;
let centers = [];

// 텍스트 내용
let textContent = "A";

// 텍스트 레이아웃 컨트롤
let textSizeVal = 800;
let letterSpacingVal = 40;
let lineLeadingVal = 80;

// 레이아웃 모드
let layoutMode = "Block";
let layoutRadius = 250;
let arcSpanDeg = 180;

// Ripple 관련
let radiusMin = 13;
let radiusMax = 90;
let step = 20;
let spacing = 70;

let rippleProgress = 1;
let rippleSpeed = 0.02;
let easingMode = "Linear";
let rippleDirection = "Inside-Out";

// 애니메이션 모드
let animMode = "Manual";  // Manual / Loop / PingPong
let animating = false;
let pingForward = true;

// 스타일 관련
let strokeW = 1.5;
let colorPalette = "Black";
let perCharColor = false;
let shapeMode = "Circle";
let drawMode = "Stroke";

// 🔹 전체 컬러 오퍼시티
let rippleAlpha = 255; // 0~255

// 블렌딩 모드
let blendModeName = "Normal"; // Normal / Add / Multiply / Screen / Lightest / Darkest

// 배경색
let bgColor;
let bgPicker;

// 필터 옵션
let blurOn = false;
let noiseOn = false;
let blurCheckbox, noiseCheckbox;

// A~Z 테스트용
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let currentIndex = 0;
let canvas;

// ===== UI 요소 =====
let panelDiv;
let panelToggleBtn;
let panelVisible = true;

// 텍스트 입력
let textArea;
let exportButton;

// 레이아웃 UI
let layoutSelect;
let layoutRadiusRow;
let arcSpanRow;

// 슬라이더 Rows
let radiusMinRow, radiusMaxRow, stepRow, spacingRow;
let strokeWRow, speedRow;
let textSizeRow, letterSpacingRow, leadingRow;
let alphaRow;

// 기타 컨트롤
let paletteSelect;
let easingSelect;
let directionSelect;
let perCharCheckbox;
let animSelect;
let shapeSelect;
let drawModeSelect;
let blendModeSelect;
let timelineSlider;

function preload() {
  font = loadFont('Montserrat-VariableFont_wght.ttf');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('display', 'block');

  bgColor = color(255);

  // ===== 패널 토글 버튼 =====
  panelToggleBtn = createButton("▼");
  panelToggleBtn.position(10, 10);
  panelToggleBtn.style("position", "absolute");
  panelToggleBtn.style("z-index", "20");
  panelToggleBtn.style("font-size", "11px");
  panelToggleBtn.style("padding", "3px 8px");
  panelToggleBtn.mousePressed(togglePanelVisibility);

  // ===== 패널 박스 =====
  panelDiv = createDiv();
  panelDiv.position(10, 40);
  panelDiv.size(260, windowHeight - 50);
  panelDiv.style("background", "#f7f7f7");
  panelDiv.style("border", "1px solid #ddd");
  panelDiv.style("padding", "12px");
  panelDiv.style("box-shadow", "0 2px 6px rgba(0,0,0,0.08)");
  panelDiv.style("font-family", "sans-serif");
  panelDiv.style("font-size", "12px");
  panelDiv.style("overflow-y", "auto");
  panelDiv.style("position", "absolute");
  panelDiv.style("z-index", "10");

  // ===== Save 버튼 =====
  let exportRow = createDiv();
  exportRow.parent(panelDiv);
  exportRow.style("margin-bottom", "8px");

  exportButton = createButton("Save");
  exportButton.parent(exportRow);
  exportButton.mousePressed(exportPNG);
  exportButton.style("font-size", "11px");
  exportButton.style("padding", "4px 8px");

  // ===================== TEXT SECTION =====================
  let layoutTitle = createDiv("Text");
  layoutTitle.parent(panelDiv);
  layoutTitle.style("margin-top", "10px");
  layoutTitle.style("padding", "4px 2px");
  layoutTitle.style("font-weight", "bold");
  layoutTitle.style("border-bottom", "1px solid #ddd");

  let layoutBodyDiv = createDiv();
  layoutBodyDiv.parent(panelDiv);
  layoutBodyDiv.style("margin-top", "8px");

  // 🔤 텍스트 입력창
  let textRow = createDiv();
  textRow.parent(layoutBodyDiv);
  textRow.style("margin-bottom", "8px");

  textArea = createElement('textarea', textContent);
  textArea.parent(textRow);
  textArea.style("width", "100%");
  textArea.style("height", "26px");
  textArea.style("font-size", "11px");
  textArea.style("resize", "vertical");

  textArea.input(() => {
    textContent = textArea.value();
    buildAllText();
  });

  // 사이즈 / 트래킹 / 리딩
  textSizeRow = createSliderRow(
    "Size",
    50, 800,
    textSizeVal,
    v => { textSizeVal = v; },
    layoutBodyDiv
  );

  letterSpacingRow = createSliderRow(
    "Tracking",
    -200, 200,
    letterSpacingVal,
    v => { letterSpacingVal = v; },
    layoutBodyDiv
  );

  leadingRow = createSliderRow(
    "Leading",
    0, 250,
    lineLeadingVal,
    v => { lineLeadingVal = v; },
    layoutBodyDiv
  );

  // 레이아웃 모드
  let lmRow = createDiv();
  lmRow.parent(layoutBodyDiv);
  lmRow.style("margin-top", "4px");

  let lmLabel = createSpan("Layout:");
  lmLabel.parent(lmRow);
  lmLabel.style("width", "70px");
  lmLabel.style("display", "inline-block");

  layoutSelect = createSelect();
  layoutSelect.parent(lmRow);
  layoutSelect.option("Block");
  layoutSelect.option("Circle");
  layoutSelect.option("Arc");
  layoutSelect.value(layoutMode);
  layoutSelect.changed(() => buildAllText());

  layoutRadiusRow = createSliderRow(
    "Radius",
    50, 600,
    layoutRadius,
    v => layoutRadius = v,
    layoutBodyDiv
  );

  arcSpanRow = createSliderRow(
    "ArcSpan",
    30, 330,
    arcSpanDeg,
    v => arcSpanDeg = v,
    layoutBodyDiv
  );

  // ===================== STYLE SECTION =====================
  let styleTitle = createDiv("Style");
  styleTitle.parent(panelDiv);
  styleTitle.style("margin-top", "10px");
  styleTitle.style("padding", "4px 2px");
  styleTitle.style("font-weight", "bold");
  styleTitle.style("border-bottom", "1px solid #ddd");

  let styleBodyDiv = createDiv();
  styleBodyDiv.parent(panelDiv);
  styleBodyDiv.style("margin-top", "8px");

  radiusMinRow = createSliderRow("Min", 1, 80, radiusMin, v => radiusMin = v, styleBodyDiv);
  radiusMaxRow = createSliderRow("Max", 10, 250, radiusMax, v => radiusMax = v, styleBodyDiv);
  stepRow      = createSliderRow("Step", 5, 80, step, v => step = v, styleBodyDiv);
  spacingRow   = createSliderRow("Point", 20, 200, spacing, v => spacing = v, styleBodyDiv);
  strokeWRow   = createSliderRow("Stroke", 0.5, 8, strokeW, v => strokeW = v, styleBodyDiv);

  // 🔹 Alpha 슬라이더
  alphaRow = createSliderRow(
    "Alpha",
    0, 255,
    rippleAlpha,
    v => rippleAlpha = v,
    styleBodyDiv
  );

  speedRow = createSliderRow(
    "Speed",
    0.005, 0.08,
    rippleSpeed,
    v => rippleSpeed = v,
    styleBodyDiv,
    0.001
  );

  // ===== Anim Mode =====
  let animRow = createDiv();
  animRow.parent(styleBodyDiv);
  animRow.style("margin-top", "6px");

  let animLabel = createSpan("Anim:");
  animLabel.parent(animRow);
  animLabel.style("width", "70px");
  animLabel.style("display", "inline-block");

  animSelect = createSelect();
  animSelect.parent(animRow);
  animSelect.option("Manual");
  animSelect.option("Loop");
  animSelect.option("PingPong");
  animSelect.value(animMode);
  animSelect.changed(() => {
    animMode = animSelect.value();
    animating = false;
    pingForward = true;
  });

  // ===== Timeline =====
  let tlRow = createDiv();
  tlRow.parent(styleBodyDiv);
  tlRow.style("margin-top", "6px");

  let tlLabel = createSpan("Timeline:");
  tlLabel.parent(tlRow);
  tlLabel.style("width", "70px");
  tlLabel.style("display", "inline-block");

  timelineSlider = createSlider(0, 1, rippleProgress, 0.001);
  timelineSlider.parent(tlRow);
  timelineSlider.style("width", "100px");
  timelineSlider.style("accent-color", "#555");
  timelineSlider.input(() => {
    rippleProgress = timelineSlider.value();
    animating = false;
    animMode = "Manual";
    animSelect.value("Manual");
  });

  // ===== Color Palette =====
  let paletteRow = createDiv();
  paletteRow.parent(styleBodyDiv);
  paletteRow.style("margin-top", "6px");

  let paletteLabel = createSpan("Color:");
  paletteLabel.parent(paletteRow);
  paletteLabel.style("width", "70px");
  paletteLabel.style("display", "inline-block");

  paletteSelect = createSelect();
  paletteSelect.parent(paletteRow);
  ["Black","Gray","Red","Blue","Rainbow","Neon","Candy","PastelGlow"].forEach(c => paletteSelect.option(c));
  paletteSelect.value(colorPalette);
  paletteSelect.changed(() => colorPalette = paletteSelect.value());

  // 🔘 Filter 체크 (Blur / Noise)
  let filterRow = createDiv();
  filterRow.parent(styleBodyDiv);
  filterRow.style("margin-top", "4px");

  let filterLabel = createSpan("Filter:");
  filterLabel.parent(filterRow);
  filterLabel.style("width", "70px");
  filterLabel.style("display", "inline-block");

  blurCheckbox = createCheckbox('Blur', blurOn);
  blurCheckbox.parent(filterRow);
  blurCheckbox.style("margin-right", "8px");
  blurCheckbox.changed(() => {
    blurOn = blurCheckbox.checked();
  });

  noiseCheckbox = createCheckbox('Noise', noiseOn);
  noiseCheckbox.parent(filterRow);
  noiseCheckbox.changed(() => {
    noiseOn = noiseCheckbox.checked();
  });

  // ===== Shape =====
  let shapeRow = createDiv();
  shapeRow.parent(styleBodyDiv);
  shapeRow.style("margin-top", "4px");

  let shapeLabel = createSpan("Shape:");
  shapeLabel.parent(shapeRow);
  shapeLabel.style("width", "70px");
  shapeLabel.style("display", "inline-block");

  shapeSelect = createSelect();
  shapeSelect.parent(shapeRow);
  ["Circle","LineX","LineY","Rect","Triangle","Dot"].forEach(s => shapeSelect.option(s));
  shapeSelect.value(shapeMode);
  shapeSelect.changed(() => shapeMode = shapeSelect.value());

  // ===== Draw Mode =====
  let drawRow = createDiv();
  drawRow.parent(styleBodyDiv);
  drawRow.style("margin-top", "4px");

  let drawLabel = createSpan("Draw:");
  drawLabel.parent(drawRow);
  drawLabel.style("width", "70px");
  drawLabel.style("display", "inline-block");

  drawModeSelect = createSelect();
  drawModeSelect.parent(drawRow);
  ["Stroke","Fill"].forEach(s => drawModeSelect.option(s));
  drawModeSelect.value(drawMode);
  drawModeSelect.changed(() => drawMode = drawModeSelect.value());

  // ===== Blend Mode =====
  let blendRow = createDiv();
  blendRow.parent(styleBodyDiv);
  blendRow.style("margin-top", "4px");

  let blendLabel = createSpan("Blend:");
  blendLabel.parent(blendRow);
  blendLabel.style("width", "70px");
  blendLabel.style("display", "inline-block");

  blendModeSelect = createSelect();
  blendModeSelect.parent(blendRow);
  ["Normal","Add","Multiply","Screen","Lightest","Darkest"].forEach(m => blendModeSelect.option(m));
  blendModeSelect.value(blendModeName);
  blendModeSelect.changed(() => {
    blendModeName = blendModeSelect.value();
  });

  // ===== BG Color =====
  let bgRow = createDiv();
  bgRow.parent(styleBodyDiv);
  bgRow.style("margin-top", "4px");

  let bgLabel = createSpan("BG:");
  bgLabel.parent(bgRow);
  bgLabel.style("width", "70px");
  bgLabel.style("display", "inline-block");

  bgPicker = createColorPicker("#ffffff");
  bgPicker.parent(bgRow);
  bgPicker.input(() => bgColor = bgPicker.color());

  // ===== Direction =====
  let dirRow = createDiv();
  dirRow.parent(styleBodyDiv);
  dirRow.style("margin-top", "4px");

  let dirLabel = createSpan("Direction:");
  dirLabel.parent(dirRow);
  dirLabel.style("width", "70px");
  dirLabel.style("display", "inline-block");

  directionSelect = createSelect();
  directionSelect.parent(dirRow);
  directionSelect.option("Inside-Out");
  directionSelect.option("Outside-In");
  directionSelect.value(rippleDirection);
  directionSelect.changed(() => rippleDirection = directionSelect.value());

  // ===== Per-char =====
  let perCharRow = createDiv();
  perCharRow.parent(styleBodyDiv);
  perCharRow.style("margin-top", "4px");

  let perCharLabel = createSpan("Per-char:");
  perCharLabel.parent(perCharRow);
  perCharLabel.style("width", "70px");
  perCharLabel.style("display", "inline-block");

  perCharCheckbox = createCheckbox("", perCharColor);
  perCharCheckbox.parent(perCharRow);
  perCharCheckbox.changed(() => perCharColor = perCharCheckbox.checked());

  // ===== Easing =====
  let easingRow = createDiv();
  easingRow.parent(styleBodyDiv);
  easingRow.style("margin-top", "4px");

  let easingLabel = createSpan("Easing:");
  easingLabel.parent(easingRow);
  easingLabel.style("width", "70px");
  easingLabel.style("display", "inline-block");

  easingSelect = createSelect();
  easingSelect.parent(easingRow);
  ["Linear","EaseInOutQuad","EaseOutCubic"].forEach(e => easingSelect.option(e));
  easingSelect.value(easingMode);
  easingSelect.changed(() => easingMode = easingSelect.value());

  // 초기 텍스트 빌드
  buildAllText();
}

// ===== 메인 draw 루프 =====
function draw() {
  // 화면 렌더링
  renderScene(bgColor);

  // Blur / Noise 필터는 화면에만 적용
  if (blurOn) {
    filter(BLUR, 0.7);
  }
  if (noiseOn) {
    addNoiseOverlay();
  }

  // 애니메이션 업데이트
  updateAnimation();

  if (timelineSlider) {
    timelineSlider.value(rippleProgress);
  }
}

// ===== 실제 그리기 로직 =====
function renderScene(bgCol) {
  blendMode(BLEND);
  background(bgCol);

  let modeConst = BLEND;
  if (blendModeName === "Add")      modeConst = ADD;
  else if (blendModeName === "Multiply") modeConst = MULTIPLY;
  else if (blendModeName === "Screen")   modeConst = SCREEN;
  else if (blendModeName === "Lightest") modeConst = LIGHTEST;
  else if (blendModeName === "Darkest")  modeConst = DARKEST;
  blendMode(modeConst);

  let eased = applyEasing(rippleProgress, easingMode);

  for (let c of centers) {
    drawRipple(c, eased);
  }
}

// ===== 애니메이션 업데이트 =====
function updateAnimation() {
  if (animMode === "Manual") {
    if (animating) {
      rippleProgress += rippleSpeed;
      if (rippleProgress >= 1) {
        rippleProgress = 1;
        animating = false;
      }
    }
  } else if (animMode === "Loop") {
    rippleProgress = (rippleProgress + rippleSpeed) % 1;
  } else if (animMode === "PingPong") {
    if (pingForward) {
      rippleProgress += rippleSpeed;
      if (rippleProgress >= 1) {
        rippleProgress = 1;
        pingForward = false;
      }
    } else {
      rippleProgress -= rippleSpeed;
      if (rippleProgress <= 0) {
        rippleProgress = 0;
        pingForward = true;
      }
    }
  }
}

// ===== 노이즈 오버레이 =====
function addNoiseOverlay() {
  push();
  blendMode(BLEND);
  noFill();
  strokeWeight(1);

  let grainCount = (width * height) / 40;
  grainCount = constrain(grainCount, 15000, 60000);

  for (let i = 0; i < grainCount; i++) {
    let x = random(width);
    let y = random(height);
    let v = random(40, 220);
    stroke(v, 45);
    point(x, y);
  }

  pop();
}

// ===== 패널 토글 =====
function togglePanelVisibility() {
  panelVisible = !panelVisible;
  panelDiv.style("display", panelVisible ? "block" : "none");
  panelToggleBtn.html(panelVisible ? "▼" : "▲");
}

// ===== 슬라이더 + 숫자 인풋 =====
function createSliderRow(labelText, min, max, initialValue, onChange, parentDiv, stepOverride) {
  let row = createDiv();
  row.parent(parentDiv);
  row.style("margin-bottom", "8px");

  let label = createSpan(labelText);
  label.parent(row);
  label.style("display", "inline-block");
  label.style("width", "70px");

  let slider = createSlider(min, max, initialValue, stepOverride || 0.5);
  slider.parent(row);
  slider.style("width", "100px");
  slider.style("margin", "0 6px");
  slider.elt.style.accentColor = "#555555";

  let numberInput = createInput(initialValue.toString());
  numberInput.parent(row);
  numberInput.size(40);
  numberInput.attribute("type", "number");
  numberInput.style("font-size", "11px");

  slider.input(() => {
    let v = slider.value();
    numberInput.value(v);
    onChange(v);
    buildAllText();
  });

  numberInput.input(() => {
    let v = parseFloat(numberInput.value());
    if (isNaN(v)) return;
    v = constrain(v, min, max);
    slider.value(v);
    onChange(v);
    buildAllText();
  });

  return { slider, numberInput };
}

// ===== 텍스트 빌드 =====
function buildAllText() {
  centers = [];
  if (layoutMode === "Block") buildBlockText();
  else buildRadialText();
  centerAlignCenters();
}

// 🔧 블록 레이아웃 (글자별 로컬 그리드)
function buildBlockText() {
  let fontSize = textSizeVal;
  let lines = textContent.toUpperCase().split("\n");
  let allCenters = [];
  let glyphCounter = 0;

  for (let li = 0; li < lines.length; li++) {
    let line = lines[li];
    let cursorX = 0;
    let cursorY = li * (fontSize + lineLeadingVal);

    for (let i = 0; i < line.length; i++) {
      let ch = line[i];

      if (ch === " ") {
        cursorX += fontSize * 0.35 + letterSpacingVal;
        continue;
      }

      let info = getGlyphPoints(ch, fontSize);
      if (!info) continue;

      // 이 글자의 로컬 기준점
      let originX = cursorX;
      let originY = cursorY;

      for (let p of info.pts) {
        let gx = p.x + cursorX;
        let gy = p.y + cursorY;

        addSnappedPoint(allCenters, gx, gy, glyphCounter, originX, originY);
      }

      cursorX += info.width + letterSpacingVal;
      glyphCounter++;
    }
  }

  centers = allCenters;
}

// 🔧 원형 / 아치 레이아웃 (글자별 로컬 그리드)
function buildRadialText() {
  let fontSize = textSizeVal;
  let textFlat = textContent.toUpperCase().replace(/\n/g, " ");
  if (!textFlat.length) {
    centers = [];
    return;
  }

  let chars = textFlat.split("");
  let total = chars.length;
  let allCenters = [];
  let glyphCounter = 0;

  let startAngle, endAngle;
  if (layoutMode === "Circle") {
    startAngle = 0;
    endAngle = TWO_PI;
  } else {
    let spanRad = radians(arcSpanDeg);
    startAngle = -spanRad / 2;
    endAngle = spanRad / 2;
  }

  for (let i = 0; i < total; i++) {
    let ch = chars[i];
    let angle = (total === 1)
      ? (startAngle + endAngle) / 2
      : map(i, 0, total - 1, startAngle, endAngle);

    let baseX = layoutRadius * cos(angle);
    let baseY = layoutRadius * sin(angle);

    if (ch === " ") {
      glyphCounter++;
      continue;
    }

    let info = getGlyphPoints(ch, fontSize);
    if (!info) {
      glyphCounter++;
      continue;
    }

    // 이 글자의 로컬 기준점
    let originX = baseX;
    let originY = baseY;

    for (let p of info.pts) {
      let gx = baseX + p.x;
      let gy = baseY + p.y;

      addSnappedPoint(allCenters, gx, gy, glyphCounter, originX, originY);
    }

    glyphCounter++;
  }

  centers = allCenters;
}

// 🔧 스냅 + 중복 제거 + gIndex 지정 (글자별 로컬 그리드)
function addSnappedPoint(allCenters, gx, gy, gIndex, originX, originY) {
  // 1) 글자 기준 좌표계로 변환
  let localX = gx - originX;
  let localY = gy - originY;

  // 2) 로컬 좌표에서 스냅
  let snappedLocalX = Math.round(localX / spacing) * spacing;
  let snappedLocalY = Math.round(localY / spacing) * spacing;

  // 3) 다시 월드 좌표로 되돌리기
  let sx = snappedLocalX + originX;
  let sy = snappedLocalY + originY;

  // 같은 글자 안에서만 중복 제거
  for (let q of allCenters) {
    if (q.gIndex === gIndex && dist(sx, sy, q.x, q.y) < spacing * 0.4) {
      return;
    }
  }

  let v = createVector(sx, sy);
  v.gIndex = gIndex;
  allCenters.push(v);
}

// 글자 하나의 점들 가져오기 (p5 font)
function getGlyphPoints(ch, fontSize) {
  let bounds = font.textBounds(ch, 0, 0, fontSize);
  if (!bounds) return null;

  let x0 = -bounds.w / 2 - bounds.x;
  let y0 = bounds.h / 2 - bounds.y;

  let pts = font.textToPoints(ch, x0, y0, fontSize, {
    sampleFactor: 0.6
  });

  return { pts, width: bounds.w };
}

// 전체 centers를 캔버스 중앙으로 이동
function centerAlignCenters() {
  if (!centers.length) return;

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (let c of centers) {
    minX = min(minX, c.x);
    minY = min(minY, c.y);
    maxX = max(maxX, c.x);
    maxY = max(maxY, c.y);
  }

  let dx = width / 2 - (minX + maxX) / 2;
  let dy = height / 2 - (minY + maxY) / 2;

  for (let c of centers) {
    c.x += dx;
    c.y += dy;
  }
}

// ===== Ripple 그리기 =====
function drawRipple(pt, progress) {
  let cx = pt.x;
  let cy = pt.y;
  let gIndex = pt.gIndex || 0;

  for (let r = radiusMin; r <= radiusMax; r += step) {
    let t = (r - radiusMin) / (radiusMax - radiusMin);

    let visible = (rippleDirection === "Inside-Out")
      ? t <= progress
      : t >= 1 - progress;
    if (!visible) continue;

    let col = getColorForRipple(t, r, gIndex);
    let alpha = rippleAlpha;

    let forceStroke = (shapeMode === "LineX" || shapeMode === "LineY");

    if (drawMode === "Fill" && !forceStroke) {
      noStroke();
      fill(col[0], col[1], col[2], alpha);
    } else {
      noFill();
      stroke(col[0], col[1], col[2], alpha);
      strokeWeight(strokeW);
    }

    if (shapeMode === "Circle") {
      ellipse(cx, cy, r * 2, r * 2);
    } else if (shapeMode === "LineX") {
      line(cx - r, cy, cx + r, cy);
    } else if (shapeMode === "LineY") {
      line(cx, cy - r, cx, cy + r);
    } else if (shapeMode === "Rect") {
      rectMode(CENTER);
      rect(cx, cy, r * 2, r * 2);
    } else if (shapeMode === "Triangle") {
      triangle(cx, cy - r, cx - r, cy + r, cx + r, cy + r);
    } else if (shapeMode === "Dot") {
      let dotSize = step * 0.4;
      ellipse(cx + r * 0.3, cy, dotSize, dotSize);
    }
  }
}

// 팔레트별 색상
function getColorForRipple(t, r, gIndex) {
  if (perCharColor) return getPerCharColor(gIndex);

  if (colorPalette === "Black") return [0, 0, 0];
  if (colorPalette === "Gray")  return [80, 80, 80];
  if (colorPalette === "Red")   return [220, 80, 80];
  if (colorPalette === "Blue")  return [40, 80, 200];

  if (colorPalette === "Rainbow") {
    return [
      map(r, radiusMin, radiusMax, 60, 255),
      map(r, radiusMin, radiusMax, 200, 60),
      map(r, radiusMin, radiusMax, 255, 120)
    ];
  }

  if (colorPalette === "Neon") {
    let tt = constrain(t, 0, 1);
    return [
      lerp(80, 255, tt),
      lerp(255, 40, tt),
      lerp(200, 180, tt)
    ];
  }

  if (colorPalette === "Candy") {
    let tt = constrain(t, 0, 1);
    return [
      lerp(255, 255, tt),
      lerp(150, 210, tt),
      lerp(190, 150, tt)
    ];
  }

  if (colorPalette === "PastelGlow") {
    let tt = constrain(t, 0, 1);
    return [
      lerp(180, 240, tt),
      lerp(200, 255, tt),
      lerp(220, 255, tt)
    ];
  }

  return [0, 0, 0];
}

function getPerCharColor(i) {
  let colors = [
    [220, 80, 80],
    [40, 120, 220],
    [60, 160, 120],
    [180, 140, 40],
    [140, 60, 180],
    [30, 30, 30]
  ];
  return colors[i % colors.length];
}

// ===== Easing =====
function applyEasing(t, mode) {
  t = constrain(t, 0, 1);
  if (mode === "EaseInOutQuad") {
    return t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2;
  }
  if (mode === "EaseOutCubic") {
    return 1 - pow(1 - t, 3);
  }
  return t;
}

// ===== 인터랙션 =====
function mousePressed() {
  if (animMode === "Manual") {
    rippleProgress = 0;
    animating = true;
  } else if (animMode === "Loop") {
    rippleProgress = 0;
  } else if (animMode === "PingPong") {
    rippleProgress = 0;
    pingForward = true;
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    currentIndex = (currentIndex + 1) % letters.length;
    textContent = letters[currentIndex];
    textArea.value(textContent);
    buildAllText();
  } else if (keyCode === LEFT_ARROW) {
    currentIndex = (currentIndex - 1 + letters.length) % letters.length;
    textContent = letters[currentIndex];
    textArea.value(textContent);
    buildAllText();
  } else if (key === ' ') {
    currentIndex = (currentIndex + 1) % letters.length;
    textContent = letters[currentIndex];
    textArea.value(textContent);
    buildAllText();
  }
}

// ===== Export (투명 배경으로 타입만) =====
function exportPNG() {
  let prevBg = bgColor;

  clear();

  let modeConst = BLEND;
  if (blendModeName === "Add")      modeConst = ADD;
  else if (blendModeName === "Multiply") modeConst = MULTIPLY;
  else if (blendModeName === "Screen")   modeConst = SCREEN;
  else if (blendModeName === "Lightest") modeConst = LIGHTEST;
  else if (blendModeName === "Darkest")  modeConst = DARKEST;
  blendMode(modeConst);

  let eased = applyEasing(rippleProgress, easingMode);
  for (let c of centers) {
    drawRipple(c, eased);
  }

  if (blurOn) {
    filter(BLUR, 0.7);
  }
  if (noiseOn) {
    addNoiseOverlay();
  }

  saveCanvas(canvas, "type_ripple", "png");

  // 화면 복구
  renderScene(prevBg);
}