import { defaults } from './defaults.js';
import { degreesToRadians, getFactorsOfTwo, randomNumberGenerator } from './utils.js';

export class MazeGenerator {
  constructor() {
    // Default values
    this.pointsFromCenter = defaults.pointsFromCenter;
    this.outerWall = defaults.outerWall;
    this.pathWidth = defaults.pathWidth;
    this.rings = defaults.rings;
    this.wall = defaults.wall;
    this.wallColor = defaults.wallColor;
    this.pathColor = defaults.pathColor;
    this.seed = defaults.seed;

    // Calculated values
    this.generateRandomNumber = randomNumberGenerator(this.seed);
    this.mazeDiameter = this.outerWall * 2
      + this.pathWidth
      + 2 * this.rings * (this.pathWidth + this.wall);
    this.mazeRadius = this.mazeDiameter / 2;
    this.factorsOfTwo = getFactorsOfTwo(this.rings);

    // Maze element details
    this.canvas = this.defineCanvas();
    this.ctx = this.defineCanvasContext();
    this.matrix = defineMazeMatrix();
  }

  createMaze() {
    // Define starting position
    let ring = 0;
    let theta = 0;
    const route = [[ring, theta]];
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
}