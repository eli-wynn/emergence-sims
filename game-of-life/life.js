// =============================================================
//  Conway's Game of Life
//
//  The grid is a 2D array: grid[y][x] is 1 (alive) or 0 (dead).
//  Everything (drawing, controls, the loop) already works.
//  YOUR JOB: fill in the two TODO functions below.
// =============================================================

const CELL_SIZE = 10;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cols = Math.floor(canvas.width / CELL_SIZE);
const rows = Math.floor(canvas.height / CELL_SIZE);

let grid = createGrid();
let running = false;
let generation = 0;

// -------------------------------------------------------------
//  Grid helpers
// -------------------------------------------------------------

function createGrid() {
  return Array.from({ length: rows }, () => new Array(cols).fill(0));
}

function randomGrid() {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() < 0.25 ? 1 : 0))
  );
}

// =============================================================
//  TODO 1: count the live neighbors of the cell at (x, y)
// =============================================================
//
//  Each cell has 8 neighbors:
//
//      (x-1,y-1)  (x,y-1)  (x+1,y-1)
//      (x-1,y  )  [cell]   (x+1,y  )
//      (x-1,y+1)  (x,y+1)  (x+1,y+1)
//
function countNeighbors(grid, x, y) {
  let count = 0;

  // your code here
  
  for(let yTrack = y-1; yTrack<y+2; yTrack++){
    for(let xTrack = x-1; xTrack<x+2; xTrack++){
      if(yTrack==y && xTrack==x){
        continue;
      }
      else if (xTrack < 0 || xTrack >= cols || yTrack < 0 || yTrack >= rows) {
        continue;
      }
      else if(grid[yTrack][xTrack] == 1){
        count++;
      }
    }
  }

  return count;
}

// =============================================================
//  TODO 2: compute the next generation
// =============================================================
//
//  The rules:
//   1. A live cell with 2 or 3 live neighbors survives.
//   2. A dead cell with exactly 3 live neighbors becomes alive.
//   3. Every other cell is dead in the next generation.

function nextGeneration(grid) {
  const next = createGrid();
  for(let y = 0; y < rows; y++){
    for(let x = 0; x < cols; x++){
      let store = countNeighbors(grid, x, y);
      if(grid[y][x] == 1 && (store == 2 || store == 3)){
        next[y][x] = 1;
      }
      else if(grid[y][x] == 0 && store == 3){
        next[y][x] = 1;
      }
      else{
        next[y][x] = 0;
      }
    }
  }

  // your code here

  return next; // <-- placeholder so nothing changes yet. Return `next` when done!
}

// -------------------------------------------------------------
//  Drawing
// -------------------------------------------------------------

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // faint grid lines
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1;
  for (let x = 0; x <= cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL_SIZE + 0.5, 0);
    ctx.lineTo(x * CELL_SIZE + 0.5, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL_SIZE + 0.5);
    ctx.lineTo(canvas.width, y * CELL_SIZE + 0.5);
    ctx.stroke();
  }

  // live cells
  ctx.fillStyle = "#4ade80";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) {
        ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 1, CELL_SIZE - 1);
      }
    }
  }

  document.getElementById("genCount").textContent = generation;
}

// -------------------------------------------------------------
//  Simulation loop
// -------------------------------------------------------------

function step() {
  grid = nextGeneration(grid);
  generation++;
  draw();
}

let lastStepTime = 0;

function loop(timestamp) {
  const gensPerSecond = Number(document.getElementById("speedSlider").value);
  if (running && timestamp - lastStepTime >= 1000 / gensPerSecond) {
    step();
    lastStepTime = timestamp;
  }
  requestAnimationFrame(loop);
}

// -------------------------------------------------------------
//  Mouse drawing: click to toggle, drag to paint
// -------------------------------------------------------------

let painting = false;
let paintValue = 1;

function cellFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_SIZE);
  const y = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_SIZE);
  if (x < 0 || x >= cols || y < 0 || y >= rows) return null;
  return { x, y };
}

canvas.addEventListener("mousedown", (e) => {
  const cell = cellFromEvent(e);
  if (!cell) return;
  painting = true;
  paintValue = grid[cell.y][cell.x] ? 0 : 1; // first click decides draw vs erase
  grid[cell.y][cell.x] = paintValue;
  draw();
});

canvas.addEventListener("mousemove", (e) => {
  if (!painting) return;
  const cell = cellFromEvent(e);
  if (!cell) return;
  grid[cell.y][cell.x] = paintValue;
  draw();
});

window.addEventListener("mouseup", () => (painting = false));

// -------------------------------------------------------------
//  Buttons
// -------------------------------------------------------------

const playBtn = document.getElementById("playBtn");

playBtn.addEventListener("click", () => {
  running = !running;
  playBtn.textContent = running ? "Pause" : "Play";
});

document.getElementById("stepBtn").addEventListener("click", step);

document.getElementById("randomBtn").addEventListener("click", () => {
  grid = randomGrid();
  generation = 0;
  draw();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  grid = createGrid();
  generation = 0;
  draw();
});

// A glider is a great test: if your rules are right, it walks diagonally forever.
document.getElementById("gliderBtn").addEventListener("click", () => {
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  const glider = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1],
  ];
  glider.forEach((row, dy) =>
    row.forEach((v, dx) => {
      if (v) grid[cy + dy][cx + dx] = 1;
    })
  );
  draw();
});

draw();
requestAnimationFrame(loop);
