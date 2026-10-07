# Emergence Sims

Two classic "simple rules → complex behavior" simulations in plain HTML + JavaScript.
No installs, no build step: just open `index.html` in a browser.

## How to work on it

1. Open the folder in VS Code.
2. Open `index.html` in your browser (double-click it, or use the "Live Server"
   VS Code extension so the page auto-refreshes when you save).
3. Press **F12** in the browser to open DevTools. The **Console** tab shows errors,
   and `console.log(...)` in your code prints there.

## Part 1: Game of Life (`game-of-life/life.js`)

- [ ] **TODO 1** `countNeighbors`: count the 8 surrounding live cells
- [ ] **TODO 2** `nextGeneration`: apply the 3 rules into a new grid
- [ ] Test: click **Glider**, then **Play**. It should walk diagonally forever.
- [ ] Test: draw 3 cells in a row. It should flip between horizontal and vertical (a "blinker").

**Stretch goals**
- Color cells by how many generations they've been alive
- Add a pattern library (Gosper glider gun, pulsar, spaceships)
- Try other rules: "HighLife" (B36/S23), "Seeds" (B2/S)
- Make the grid bigger and see when it gets slow. Why? How could you speed it up?

## Part 2: Boids (`boids/boids.js`)

Read `vector.js` first; it's short and everything uses it.

- [ ] **TODO 1** `alignment`: match neighbors' average velocity
- [ ] **TODO 2** `cohesion`: steer toward neighbors' center
- [ ] **TODO 3** `separation`: steer away from close neighbors
- [ ] Play with the sliders: set two rules to 0 and watch what each one does alone

**Stretch goals**
- Click to add a predator that boids flee from
- Make boids avoid the mouse cursor or obstacles
- Color boids by speed or by flock
- Bump `count` to 1000+. It gets slow because every boid checks every other boid
  (that's O(n²)). Fix it with a **spatial grid**: bucket boids by cell and only check nearby cells.
