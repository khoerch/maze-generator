import { degreesToRadians, getFactorsOfTwo, randomNumberGenerator } from './utils.js';

export class MazeGenerator {
  constructor(input = {}) {
    // Default values
    this.pointsFromCenter = input.pointsFromCenter;
    this.outerWall = input.outerWall;
    this.pathWidth = input.pathWidth;
    this.rings = input.rings;
    this.wallWidth = input.wallWidth;
    this.wallColor = input.wallColor;
    this.pathColor = input.pathColor;
    this.seed = input.seed;
    this.delay = input.delay;

    // Calculated values
    this.generateRandomNumber = randomNumberGenerator(this.seed);
    this.mazeDiameter = this.outerWall * 2
      + this.pathWidth
      + 2 * this.rings * (this.pathWidth + this.wallWidth);
    this.mazeRadius = this.mazeDiameter / 2;
    this.factorsOfTwo = getFactorsOfTwo(this.rings);

    // Maze element details
    this.canvas = this.defineCanvas();
    this.ctx = this.defineCanvasContext();
    this.matrix = this.defineMazeMatrix();

    // Maze movement details
    this.startingRing = 0;
    this.startingAngle = 0;
    this.route = [[this.startingRing, this.startingAngle]];
    this.timer = undefined;
  }

  defineCanvas() {
    const canvas = document.getElementById('maze');
    canvas.width = this.mazeDiameter;
    canvas.height = this.mazeDiameter;

    return canvas;
  }

  defineCanvasContext() {
    const ctx = this.canvas.getContext('2d');
    ctx.arc(this.mazeRadius, this.mazeRadius, this.mazeRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.wallColor;
    ctx.fill();
    ctx.strokeStyle = this.pathColor;
    ctx.lineCap = 'round';
    ctx.lineWidth = this.pathWidth;
    ctx.beginPath();
    ctx.moveTo(this.mazeRadius, this.mazeRadius);

    return ctx;
  }

  defineMazeMatrix() {
    // Define all possible locations in the maze per input or default values
    const matrix = [];
    let numberOfCellsInRing = this.pointsFromCenter;

    // Predefined details for the very center of the maze
    matrix[0] = [{
      angle: 0,
      visited: true,
    }];

    for (let i = 1; i <= this.rings; i += 1) {
      matrix[i] = [];
      let angle = 0;
      if (this.factorsOfTwo.includes(i)) {
        numberOfCellsInRing *= 2;
      }

      for (let j = 0; j < numberOfCellsInRing; j += 1) {
        angle = j * (360 / numberOfCellsInRing);
        matrix[i][j] = {
          angle: angle,
          visited: false,
        };
      }
    }

    return matrix;
  }

  // Maze looping logic

  createMaze = () => {
    let r = this.route[this.route.length-1][0] | 0;
    let t = this.route[this.route.length-1][1] | 0;
  
    const directions = this.getMazeDirections(r);
    const openAdjacentCells = this.getOpenAdjacentCells(directions, r, t);
    
    if (openAdjacentCells.length === 0) {
      this.route.pop();
      if (this.route.length > 0) {
        let radius = this.route[this.route.length-1][0] * (this.pathWidth + this.wallWidth);
        let theta = degreesToRadians(this.matrix[this.route[this.route.length-1][0]][this.route[this.route.length-1][1]].angle);
        let lastX = radius * Math.cos(theta) + this.canvas.width / 2;
        let lastY = radius * Math.sin(theta) + this.canvas.width / 2;
        this.ctx.moveTo(lastX, lastY);
        this.timer = setTimeout(this.createMaze,this.delay);
      }
      return;
    }
  
    const direction = openAdjacentCells[this.generateRandomNumber()*openAdjacentCells.length|0];
    this.route.push([direction[0] + r, direction[1]]);
  
    let isArc = direction[0] === 0;
    let lastAngle = degreesToRadians(this.matrix[r][t].angle);
    let theta = degreesToRadians(this.matrix[direction[0] + r][direction[1]].angle);
    let oldRadius = r * (this.pathWidth + this.wallWidth);
    let radius = (direction[0] + r) * (this.pathWidth + this.wallWidth);
    let arcThenLine = this.factorsOfTwo.includes(direction[0] + r) && direction[0] > 0;
    let lineThenArc = this.factorsOfTwo.includes(r) && direction[0] < 0;
    let angleOffset = theta - lastAngle;
    // TODO: Need to clean up this logic
    let counterClockwise = angleOffset < 0 || (t === 0 && direction[1] !== 1);
    if (direction[1] === 0 && t !== 1) {
      counterClockwise = false;
    }
  
    if (isArc) {
      this.ctx.arc(this.canvas.width/2, this.canvas.width/2, radius, lastAngle, theta, counterClockwise);
      this.ctx.stroke();
    } else if (arcThenLine) {
      // Going from ring with x cells to ring with 2x cells
      let newX = radius * Math.cos(theta) + this.canvas.width / 2;
      let newY = radius * Math.sin(theta) + this.canvas.width / 2;
      this.ctx.arc(this.canvas.width/2, this.canvas.width/2, oldRadius, lastAngle, theta, counterClockwise);
      this.ctx.lineTo(newX, newY);
      this.ctx.stroke();
  
    } else if (lineThenArc) {
      // Going from ring with x cells to ring with x/2 cells
      let newX = radius * Math.cos(lastAngle) + this.canvas.width / 2;
      let newY = radius * Math.sin(lastAngle) + this.canvas.width / 2;
      this.ctx.lineTo(newX, newY);
      this.ctx.arc(this.canvas.width/2, this.canvas.width/2, radius, lastAngle, theta, counterClockwise);
      this.ctx.stroke();
    } else {
      let newX = radius * Math.cos(theta) + this.canvas.width / 2;
      let newY = radius * Math.sin(theta) + this.canvas.width / 2;
      this.ctx.lineTo(newX, newY);
      this.ctx.stroke();
    }
  
    this.matrix[direction[0] + r][direction[1]].visited = true;
    this.timer = setTimeout(this.createMaze, this.delay);
  }

  getMazeDirections(ring) {
    let directions = [];

    if (this.route.length === 1) {
      // First condition when starting from the center
      for (let i = 0; i < this.pointsFromCenter; i += 1) {
        directions.push([1, i]);
      }
    } else if (this.factorsOfTwo.includes(ring + 1)) {
      // Last ring from center with same number of cells. Extra direction option when jumping to next ring
      directions = [[1, 1], [1, -1], [-1, 0], [0, 1], [0, -1]];
    } else {
      // Rings above and below have equal number of cells
      directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    }

    return directions;
  }

  getOpenAdjacentCells(directions, ring, angle) {
    const openAdjacentCells = [];
    for (let i = 0; i < directions.length; i += 1) {
      let visited = false;
      const ringMovement = directions[i][0];
      const angularMovement = directions[i][1];
      const directedRing = ringMovement + ring;

      const cellIsOutsideMaze = this.matrix[directedRing] === undefined;
      if (cellIsOutsideMaze) continue;

      // Ring angles are determined based on the number of cells in the ring.
      // We account for reverting the number of cells back to 0 as the route moves around the ring
      const angularOptions = this.matrix[directedRing].length;
      let adjustedAngle;
  
      if (this.matrix[directedRing].length === 1) {
        visited = true;
      } else if (ringMovement === 1 && this.factorsOfTwo.includes(ring + 1)) {
        // Checking the right cells in case the next ring doubles in size
        const halfAdjuster = angularMovement > 0 ? 1 : 0;
        const directedAngle = 2 * angle + halfAdjuster;
        if (angularOptions === directedAngle) adjustedAngle = 0;
        else if (directedAngle === -1) adjustedAngle = angularOptions - 1;
        else adjustedAngle = directedAngle;

        visited = this.matrix[directedRing][adjustedAngle].visited;
      } else if (ringMovement === -1 && this.factorsOfTwo.includes(ring)) {
        // Checking the right cells when going down to a ring with half cells
        adjustedAngle = Math.floor(angle / 2);

        visited = this.matrix[directedRing][adjustedAngle].visited;
      } else {
        const directedAngle = angularMovement + angle;
        if (angularOptions === directedAngle) adjustedAngle = 0;
        else if (directedAngle === -1) adjustedAngle = angularOptions - 1;
        else adjustedAngle = directedAngle;

        visited = this.matrix[directedRing][adjustedAngle].visited;
      }
  
      if (!visited) {
        const adjustedDirection = [ringMovement, adjustedAngle];
        openAdjacentCells.push(adjustedDirection);
      }
    }

    return openAdjacentCells;
  }
}