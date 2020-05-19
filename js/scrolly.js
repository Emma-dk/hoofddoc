function handleStepEnter(res) {
  const stepName = res.element.dataset.step;
  console.log("STEP ENTER", stepName);

  gSketch.stepEnter(stepName);
}

function handleStepExit(res) {
  console.log("STEP EXIT", res);
}

function handleStepProgress(res) {
  const stepName = res.element.dataset.step;
  gSketch.stepProgress(stepName, res.progress);
}

const scroller = scrollama();

scroller
  .setup({
    container: ".container",
    step: "section",
    // debug: true,
    progress: true,
    offset: 0.5,
  })
  .onStepEnter(handleStepEnter)
  .onStepExit(handleStepExit)
  .onStepProgress(handleStepProgress);

window.addEventListener("resize", scroller.resize);

const een = function (p) {
  let x = 0;
  let y = 0;
  let bolletjes = [];
  let diabeet_midden;

  p.preload = function () {};

  p.setup = function () {
    p.createCanvas(window.innerWidth, window.innerHeight);
    diabeet_midden = p.createVector(p.width / 2, p.height / 2);

    for (let i = 0; i < 5000; i++) {
      const bol = {
        x: p.random(20, p.width - 20),
        y: p.random(20, p.height - 20),
        pos: p.createVector(
          p.random(20, p.width - 20),
          p.random(20, p.height - 20)
        ),
        color: "white",
        size: 20,
        stroke: 0,
        strokeWeight: 1,
        visible: true,
        growth: 0,
        smaller: 0,
        diabetes: false,
      };
      bolletjes.push(bol);
    }
    bolletjes.sort(
      (a, b) => a.pos.dist(diabeet_midden) - b.pos.dist(diabeet_midden)
    );
    bolletjes.slice(0, 1000 / 0.5).forEach((bol) => (bol.diabetes = true));
  };

  p.stepEnter = function (stepName) {
    if (stepName === "start") {
      for (const bol of bolletjes) {
        bol.size = 20;
        bol.stroke = 0;
        bol.color = "white";
        bol.visible = true;
        bol.growth = 0;
        if (bol.diabetes) {
          bol.color = "green";
        } else {
          bol.color = "white";
        }
      }
    } else if (stepName === "total") {
      for (const bol of bolletjes) {
        bol.stroke = 0;
        bol.color = "white";
        bol.visible = true;
        bol.growth = 0;
        bol.size = 20;
      }
    }
  };

  p.stepProgress = function (stepName, progress) {
    const drie = p.createVector(p.width / 3, p.height / 2);
    const twee = p.createVector(p.width / 1.5, p.height / 2);
    const een = p.createVector(p.width / 2, p.height / 1.5);
    const midden = p.createVector(p.width / 2, p.height / 2);

    if (stepName === "hypertension") {
      for (const bol of bolletjes) {
        const nr_twee = p.createVector(bol.x, bol.y).dist(twee);

        if (nr_twee < progress * 1500) {
          if (p.random() < 0.49) {
            bol.size = 20;
            bol.stroke = 250;
            bol.color = "black";
            //bol.growth = 3;
            // bol.smaller = -5;

            bol.visible = true;
          }
        } else {
          bol.stroke = 0;

          bol.color = "white";
        }
      }
    }
    if (stepName === "obese") {
      for (const bol of bolletjes) {
        const nr_drie = p.createVector(bol.x, bol.y).dist(drie);

        if (nr_drie < progress * 1100) {
          if (p.random() < 0.48) {
            bol.size = 20;
            bol.stroke = 250;
            bol.color = "red";
            bol.visible = true;
          }
        } else {
          bol.strokeWeight = 1;
          bol.growth = 0;
          bol.stroke = 0;
          bol.color = "white";
        }
      }
    }

    if (stepName === "diabetes") {
      for (const bol of bolletjes) {
        const nr_een = p.createVector(bol.x, bol.y).dist(een);
        if (nr_een < progress * 1200) {
          if (p.random() < 0.28) {
            bol.size = 20;
            bol.stroke = 250;
            bol.strokeWeight = 4;
            bol.stroke = "red";
            bol.color = "blue";
            bol.growth = 0;
            bol.visible = true;
          }
        } else {
          bol.stroke = 0;
          bol.strokeWeight = 1;
          bol.color = "white";
        }
      }
    }
  };

  p.draw = function () {
    p.background(255);
    p.fill(255);
    //.slice(0, 100) achter bolletjes --> deel
    for (const bol of bolletjes) {
      if (bol.visible) {
        p.strokeWeight(bol.strokeWeight);
        p.stroke(bol.stroke);
        p.fill(bol.color);
        p.ellipse(bol.pos.x, bol.pos.y, bol.size, bol.size);
      }
      bol.size = bol.size + bol.growth;
      // }
      bol.x = bol.x + p.random(-1.5, +1.5);
    }
  };
};

const gSketch = new p5(een);
