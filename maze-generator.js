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
    this.timer = undefined;
    this.delay = defaults.delay;

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
    this.matrix = this.defineMazeMatrix();

    // Maze movement details
    this.startingRing = 0;
    this.startingAngle = 0;
    this.route = [[this.startingRing, this.startingAngle]];
  }

  createMaze = () => {
    let ring = this.route[this.route.length - 1][0] | 0;
    let theta = this.route[this.route.length - 1][1] | 0;
    let directions = [];
    const alternatives = [];

    // Define the possible directions from a given point in the maze
    if (this.route.length === 1) {
      // First condition when starting from center
      for (let i = 0; i < this.pointsFromCenter; i += 1) {
        directions.push([1, i]);
      }
    } else if (this.factorsOfTwo.includes(ring + 1)) {
      // Condition for last ring before the cells in the next ring double in number
      directions = [[1, 1], [1, -1], [-1, 0], [0, 1], [0, -1]];
    } else {
      // Condition where rings above and below current ring have the same number of cells
      directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    }

    // Define adjacent cells that have not been visited
    for (let i = 0; i < directions.length; i += 1) {
      const ringMovement = directions[i][0] + ring;
      let angleMovement = directions[i][1] + theta;
      const isOutsideMaze = this.matrix[ringMovement] === undefined;
      if (isOutsideMaze) continue;
      
      // Account for new angles when cells in a ring double
      let angularOptions = this.matrix[ringMovement].length;
      let mapAdjAngle;
      if (angularOptions === angleMovement) mapAdjAngle = 0;
      else if (angleMovement === -1) mapAdjAngle = angularOptions - 1;
      else mapAdjAngle = angleMovement;

      let visited = false;
      if (this.matrix[ringMovement].length === 1) {
        // Condition when in center of maze
        visited = true;
      } else if (directions[i][0] === 1 && this.factorsOfTwo.includes(ring + 1)) {
        // Condition if the next ring away from center doubles in size
        const angleModifier = directions[i][1] > 0 ? 1 : 0;
        angleMovement = 2 * theta + angleModifier;
        if (angularOptions === angleMovement) mapAdjAngle = 0;
        else if (angleMovement === -1) mapAdjAngle = angularOptions - 1;
        else mapAdjAngle = angleMovement;

        visited = this.matrix[ringMovement][mapAdjAngle].visited;
      } else if (directions[i][0] === -1 && this.factorsOfTwo.includes(ring)) {
        // Condition where current ring has doubled cells than the one before it
        mapAdjAngle = Math.floor(theta / 2);
        visited = this.matrix[ringMovement][mapAdjAngle].visited;
      } else {
        visited = this.matrix[ringMovement][mapAdjAngle].visited;
      }

      if (!visited) {
        alternatives.push([directions[i][0], mapAdjAngle]);
      }
    }

    // If there are no unvisited adjacent cells, move back along the route until an unvisited cell is found
    if (alternatives.length === 0) {
      this.route.pop();

      // If the remaining route length is 0 there are no unvisited cells and the map is complete
      if (this.route.length === 0) return;

      const newRing = this.route[this.route.length - 1][0];
      const newAngle = this.route[this.route.length - 1][1];
      const radiusLength = newRing * (this.pathWidth + this.wall);
      const degreeInRadians = degreesToRadians(this.matrix[newRing][newAngle].angle);

      const xCoordinate = radiusLength * Math.cos(newAngle) + this.mazeRadius;
      const yCoordinate = radiusLength * Math.cos(newAngle) + this.mazeRadius;
      this.ctx.moveTo(xCoordinate, yCoordinate);
      this.timer = setTimeout(this.createMaze, this.delay);
    }

    const direction = alternatives[this.generateRandomNumber() * alternatives.length | 0];
    const ringDirection = direction[0];
    const angleDirection = direction[1];
    this.route.push([ringDirection + ring, angleDirection]);
  
    let moveOnSameRing = ringDirection === 0;
    let lastAngle = degreesToRadians(this.matrix[ring][theta].angle);
    let currentAngle = degreesToRadians(this.matrix[ringDirection + ring][angleDirection].angle);
    let oldRadius = ring * (this.pathWidth + this.wall);
    let radius = (ringDirection + ring) * (this.pathWidth + this.wall);
    let arcThenLine = this.factorsOfTwo.includes(ringDirection + ring) && ringDirection > 0;
    let lineThenArc = this.factorsOfTwo.includes(ring) && ringDirection < 0;
    let angleOffset = currentAngle - lastAngle
    // TODO: Need to clean up this logic
    let counterClockwise = angleOffset < 0 || (theta === 0 && angleDirection !== 1);
    if (angleDirection === 0 && theta !== 1) {
      counterClockwise = false
    }
  
    if (moveOnSameRing) {
      this.ctx.arc(this.mazeRadius, this.mazeRadius, radius, lastAngle, currentAngle, counterClockwise);
      this.ctx.stroke();
    } else if (arcThenLine) {
      // Going from ring with x cells to ring with 2x cells
      let newX = radius * Math.cos(currentAngle) + this.mazeRadius / 2;
      let newY = radius * Math.sin(currentAngle) + this.mazeRadius / 2;
      this.ctx.arc(this.mazeRadius, this.mazeRadius, oldRadius, lastAngle, currentAngle, counterClockwise);
      this.ctx.lineTo(newX, newY);
      this.ctx.stroke();
    } else if (lineThenArc) {
      // Going from ring with x cells to ring with x/2 cells
      let newX = radius * Math.cos(lastAngle) + this.mazeRadius;
      let newY = radius * Math.sin(lastAngle) + this.mazeRadius;
      this.ctx.lineTo(newX, newY);
      this.ctx.arc(this.mazeRadius, this.mazeRadius, radius, lastAngle, currentAngle, counterClockwise);
      this.ctx.stroke();
    } else {
      let newX = radius * Math.cos(currentAngle) + this.mazeRadius;
      let newY = radius * Math.sin(currentAngle) + this.mazeRadius;
      this.ctx.lineTo(newX, newY);
      this.ctx.stroke();
    }
  
    this.matrix[ringDirection + ring][angleDirection].visited = true;
    this.timer = setTimeout(this.createMaze, this.delay)
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