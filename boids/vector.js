// =============================================================
//  A tiny 2D vector class.
//
//  A vector is just an (x, y) pair. We use it for three things:
//    position     - where a boid is
//    velocity     - which way it's moving, and how fast
//    acceleration - the "steering force" pushing it this frame
//
//  Methods like add/sub/mult MODIFY the vector and return `this`,
//  so you can chain them:  v.add(other).mult(2).limit(5)
//  Use .copy() first if you don't want to change the original!
// =============================================================

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static random() {
    const angle = Math.random() * Math.PI * 2;
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

  // returns a NEW vector a - b (the arrow pointing from b to a)
  static sub(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
  }

  static dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mult(n) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  div(n) {
    if (n !== 0) {
      this.x /= n;
      this.y /= n;
    }
    return this;
  }

  // length of the arrow
  mag() {
    return Math.hypot(this.x, this.y);
  }

  // keep the direction, change the length
  setMag(n) {
    const m = this.mag();
    if (m > 0) this.mult(n / m);
    return this;
  }

  // shrink the vector if it's longer than max
  limit(max) {
    if (this.mag() > max) this.setMag(max);
    return this;
  }

  // direction in radians (used for drawing the boid pointing the right way)
  heading() {
    return Math.atan2(this.y, this.x);
  }
}
