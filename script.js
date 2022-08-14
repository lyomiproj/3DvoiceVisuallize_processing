// 変数
let mic;
let fft;
let spectrum;
let posZ = [];
let acceraZ = [];
let volume;
let volumeToggle;
let colors = [];
let colList = [[255, 0, 0], [255, 127, 0], [255, 255, 0], [127, 255, 0], [0, 255, 0], [0, 255, 127], [0, 255, 255], [0, 127, 255], [0, 0, 255], [127, 0, 255], [255, 0, 255], [255, 0, 127]];
let colIndex = 0;
let rotX = 0;
let rotY = 0;
let rightArrowPressing = false;
let leftArrowPressing = false;
let upArrowPressing = false;
let downArrowPressing = false;
let shiftPressed = false;
let slider;

// 全体の初期化（最初に一回だけ呼ばれる）
function setup() {
  // キャンバスをつくる
  createCanvas(700, 700, WEBGL);

  mic = new p5.AudioIn();

  mic.start();

  // 周波数;を解析(滑らかに動かすための値、配列の長さ)
  fft = new p5.FFT(0.8, 256);

  fft.setInput(mic);
  userStartAudio();

  // 輪郭（りんかく）を消す
  noStroke();

  angleMode(DEGREES);

  for (let i = 0; i < 50; i++) {
    posZ[i] = -1.234;
    acceraZ[i] = 0;
    colors[i] = [0, 0, 0];
  }

  slider = createSlider(0.5, 10, 3, 0.5);
  slider.position(width - 250, 60);

  // スライダーの横幅
  slider.style('width', '200px');
}


// 計算と表示
function draw() {
  // 背景をぬりつぶす
  if (rightArrowPressing) rotY -= 2.5;
  if (leftArrowPressing) rotY += 2.5;
  if (upArrowPressing) rotX -= 2.5;
  if (downArrowPressing) rotX += 2.5;
  rotateX(rotX);
  rotateY(rotY);

  // orbitControl();
  background(240);

  volume = mic.getLevel();

  // 振幅値を計算する（0〜255）
  spectrum = fft.analyze();

  noStroke();
  let rectWidth = 700 / (64);

  // ぬりつぶす
  fill(0, 200, 255);
  push();
  translate(-350, -350);
  for (let i = 0; i < 64; i++) {
    let rectHeight = spectrum[i] * 1.5;

    // 四角形を描く
    rect(i * rectWidth, height, rectWidth - 2, -rectHeight);
  }

  pop();
  stroke(0);

  let kijun = slider.value() / 100;

  if (volume >= kijun) {
    volumeToggle = true;
  } else {
    volumeToggle = false;
  }

  for (let j = 0; j < 500; j += 10) {
    if (posZ[j / 10] <= 200) {
      colors[j / 10] = [0, 0, 0];
    } else if (colors[j / 10][0] == 0 && colors[j / 10][1] == 0 && colors[j / 10][2] == 0) {
      // console.log(colList.length);
      // let ran = floor(random(0, colList.length - 1));
      // colors[j / 10] = colList[ran];
      colors[j / 10] = [colList[colIndex][0], colList[colIndex][1], colList[colIndex][2]];
      colIndex++;
      if (colIndex >= colList.length) {
        colIndex = 0;
      }
    }

    beginShape(POINTS);

    stroke(colors[j / 10])

    for (let i = 0; i < 360; i += 2) {

      // X座標
      let x = sin(i);
      // Y座標
      let y = cos(i);
      // Z座標
      let defaultZ = j - 600;

      // stroke(colors[j/10][0],colors[j/10][1],colors[j/10][2]);
      if (posZ[j / 10] == -1.234) {
        posZ[j / 10] = j - 600
      }

      let spec = spectrum[j / 10];
      if (volumeToggle) {
        if (posZ[j / 10] >= -110) {
          vertex(x * spec, y * spec, posZ[j / 10]);
        }
      } else {
        if (posZ[j / 10] >= -110) {
          if (j != 490) {
            vertex(x * spec, y * spec, posZ[j / 10]);
          } else {
            vertex(x * 60, y * 60, posZ[j / 10]);
          }
        } else if (posZ[j / 10] <= defaultZ) {
          posZ[j / 10] = defaultZ;
          acceraZ[j / 10] = 0;
        }
      }
    }
    endShape();
    if (volumeToggle) {
      if (acceraZ[j / 10] >= 1) {
        acceraZ[j / 10] = 4;
      } else {
        acceraZ[j / 10] = 1;
      }
      if (Math.abs(acceraZ[j - 10]) > 4) {
        acceraZ[j / 10] = 4;
      }

    } else {
      if (acceraZ[j / 10] > 0) {
        acceraZ[j / 10] = -1;
      }
      if (acceraZ[j / 10] != 0) {
        acceraZ[j / 10] = -4;
      }
      if (Math.abs(acceraZ[j - 10]) > 4) {
        acceraZ[j / 10] = -4;
      }

    }
    posZ[j / 10] += acceraZ[j / 10];
  }

}

function keyPressed() {
  console.log("press", key, keyCode);
  if (shiftPressed) {
    console.log("shift true");
    if (key == "ArrowRight" || key == "RIGHT_ARROW" || keyCode == 39) {
      rightArrowPressing = true;
    }
    if (key == "ArrowLeft" || key == "LEFT_ARROW" || keyCode == 37) {
      leftArrowPressing = true;
    }
    if (key == "ArrowUp" || key == "UP_ARROW" || keyCode == 38) {
      upArrowPressing = true;
    }
    if (key == "ArrowDown" || key == "DOWN_ARROW" || keyCode == 40) {
      downArrowPressing = true;
    }
  } else {
    console.log("shift false");
    if (key == "ArrowRight" || key == "RIGHT_ARROW" || keyCode == 39) {
      console.log("press right");
      rotY -= 85;
    }
    if (key == "ArrowLeft" || key == "LEFT_ARROW" || keyCode == 37) {
      rotY += 85;
    }
    if (key == "ArrowUp" || key == "UP_ARROW" || keyCode == 38) {
      rotX -= 85;
    }
    if (key == "ArrowDown" || key == "DOWN_ARROW" || keyCode == 40) {
      rotX += 85;
    }
  }
  if (key == "Enter") {
    rotX = 0;
    rotY = 0;
  }
  if (key == "Shift") {
    shiftPressed = true;
  }
  if (key == "c") {
    for (let i = 0; i < 50; i++) {
      posZ[i] = -1.234;
      acceraZ[i] = 0;
      colors[i] = [0, 0, 0];
    }
  }
}

function keyReleased() {
  if (key == "ArrowRight" || key == "RIGHT_ARROW" || keyCode == 39) {
    rightArrowPressing = false;
  }
  if (key == "ArrowLeft" || key == "LEFT_ARROW" || keyCode == 37) {
    leftArrowPressing = false;
  }
  if (key == "ArrowUp" || key == "UP_ARROW" || keyCode == 38) {
    upArrowPressing = false;
  }
  if (key == "ArrowDown" || key == "DOWN_ARROW" || keyCode == 40) {
    downArrowPressing = false;
  }
  if (key == "Shift") {
    shiftPressed = false;
  }
}