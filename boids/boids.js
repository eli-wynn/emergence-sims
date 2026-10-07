// =============================================================
//  Boids: flocking simulation (Craig Reynolds, 1986)
//
//  Each boid only sees neighbors within `perception` pixels and
//  follows three rules. Movement, drawing, sliders and the loop
//  already work. YOUR JOB: fill in the three TODO methods.
//
//  Right now every rule returns a zero vector, so the boids just
//  fly in straight lines. As you implement each rule you'll see
//  the flock come to life. Do them one at a time!
// =============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const settings = {
  count: 150,
  perception: 50,
  maxSpeed: 3,
  maxForce: 0.05, // how hard a boid can turn per frame
  separationWeight: 1.5,
  alignmentWeight: 1,
  cohesionWeight: 1,
  showVision: false,
};

// -------------------------------------------------------------
//  THE KEY IDEA: "steering"
//
//  A boid doesn't teleport to where it wants to be. Each rule
//  works out a DESIRED velocity, then returns a gentle nudge:
//
//      steering = desired - currentVelocity
//      steering.limit(settings.maxForce)
//
//  That nudge is added to acceleration, so the boid turns
//  smoothly instead of snapping. All three rules use this.
// -------------------------------------------------------------

class Boid {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.velocity = Vector.random().mult(1 + Math.random() * (settings.maxSpeed - 1));
    this.acceleration = new Vector();
  }

  getNeighbors(boids) {
    return boids.filter(
      (other) => other !== this && Vector.dist(this.position, other.position) < settings.perception
    );
  }

  // ===========================================================
  //  TODO 1: ALIGNMENT, steer toward neighbors' average heading
  // ===========================================================
  //  Start with this one; it's the easiest.
  //   1. If there are no neighbors, return new Vector().
  //   2. Add up all the neighbors' velocities into one vector.
  //   3. Divide by the number of neighbors -> average velocity.
  //   4. That's the direction we want; setMag(settings.maxSpeed).
  //   5. steering = desired - this.velocity, limit to maxForce.
  //  You'll see: boids start moving in streams.
  alignment(neighbors) {
    return new Vector();
  }

  // ===========================================================
  //  TODO 2: COHESION, steer toward neighbors' average position
  // ===========================================================
  //   1. Average the neighbors' POSITIONS (the flock's center).
  //   2. desired = center - this.position (arrow pointing at it)
  //      Use Vector.sub(a, b), which returns a new vector.
  //   3. setMag(maxSpeed), subtract velocity, limit to maxForce.
  //  You'll see: boids clump together (maybe too much!).
  cohesion(neighbors) {
    return new Vector();
  }

  // ===========================================================
  //  TODO 3: SEPARATION, steer away from neighbors who are too close
  // ===========================================================
  //   For each neighbor:
  //     - away = this.position - other.position (points AWAY)
  //     - Closer neighbors should push harder, so divide `away`
  //       by the distance (or distance squared for a sharper push).
  //     - Add it to a running total.
  //   Then average it, setMag(maxSpeed), subtract velocity, limit.
  //  Bonus: only consider neighbors closer than perception / 2.
  //  You'll see: boids keep personal space and the clumps relax.
  separation(neighbors) {
    return new Vector();
  }

  flock(boids) {
    const neighbors = this.getNeighbors(boids);

    const align = this.alignment(neighbors).mult(settings.alignmentWeight);
    const cohere = this.cohesion(neighbors).mult(settings.cohesionWeight);
    const separate = this.separation(neighbors).mult(settings.separationWeight);

    this.acceleration.add(align).add(cohere).add(separate);
  }

  update() {
    this.velocity.add(this.acceleration).limit(settings.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // forces are recalculated fresh every frame
  }

  // fly off one side, come back on the other
  wrapEdges() {
    if (this.position.x < 0) this.position.x += canvas.width;
    if (this.position.x > canvas.width) this.position.x -= canvas.width;
    if (this.position.y < 0) this.position.y += canvas.height;
    if (this.position.y > canvas.height) this.position.y -= canvas.height;
  }

  draw() {
    if (settings.showVision) {
      ctx.strokeStyle = "rgba(124, 196, 255, 0.12)";
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, settings.perception, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.velocity.heading());
    ctx.fillStyle = "#7cc4ff";
    ctx.beginPath();
    ctx.moveTo(8, 0); // nose
    ctx.lineTo(-5, 4);
    ctx.lineTo(-5, -4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// -------------------------------------------------------------
//  Simulation
// -------------------------------------------------------------

let flock = [];
let running = true;

function reset() {
  flock = Array.from(
    { length: settings.count },
    () => new Boid(Math.random() * canvas.width, Math.random() * canvas.height)
  );
}

function loop() {
  if (running) {
    // compute ALL steering forces before moving anyone,
    // so every boid reacts to the same snapshot of the world
    for (const boid of flock) boid.flock(flock);
    for (const boid of flock) {
      boid.update();
      boid.wrapEdges();
    }
  }

  // slightly transparent background = subtle motion trails
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const boid of flock) boid.draw();

  requestAnimationFrame(loop);
}

// -------------------------------------------------------------
//  Controls: every <input data-setting="..."> updates `settings`
// -------------------------------------------------------------

document.querySelectorAll("input[data-setting]").forEach((input) => {
  input.addEventListener("input", () => {
    settings[input.dataset.setting] = Number(input.value);
  });
});

document.getElementById("showVision").addEventListener("change", (e) => {
  settings.showVision = e.target.checked;
});

const playBtn = document.getElementById("playBtn");
playBtn.addEventListener("click", () => {
  running = !running;
  playBtn.textContent = running ? "Pause" : "Play";
});

document.getElementById("resetBtn").addEventListener("click", reset);

reset();
requestAnimationFrame(loop);
