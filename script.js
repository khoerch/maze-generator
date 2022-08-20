import { defaults } from './defaults.js';
import { MazeGenerator } from './maze-generator.js';

let { pathWidth, wallWidth, outerWallWidth, rings, pointsFromCenter, delay, seed, wallColor, pathColor } = defaults;

let maze = new MazeGenerator(defaults);

const input = {
  rings: document.getElementById('rings'),
  pointsFromCenter: document.getElementById('pointsFromCenter'),
  pathWidth: document.getElementById('pathwidth'),
  wallWidth: document.getElementById('wallwidth'),
  outerWallWidth: document.getElementById('outerWallWidth'),
  pathColor: document.getElementById('pathcolor'),
  wallColor: document.getElementById('wallcolor'),
  delay: document.getElementById('delay'),
  seed: document.getElementById('seed'),
  buttonRandomSeed: document.getElementById('randomseed'),
}

const inputRings = document.getElementById('rings');
const inputPointsFromCenter = document.getElementById('pointsFromCenter');
const inputPathWidth = document.getElementById('pathwidth');
const inputWallWidth = document.getElementById('wallwidth');
const inputOuterWallWidth = document.getElementById('outerWallWidth');
const inputPathColor = document.getElementById('pathcolor');
const inputWallColor = document.getElementById('wallcolor');
const inputDelay = document.getElementById('delay');
const inputSeed = document.getElementById('seed');
const buttonRandomSeed = document.getElementById('randomseed');

const settings = {
  display: () => {
    input.rings.value = rings;
    input.pointsFromCenter.value = pointsFromCenter;
    input.pathWidth.value = pathWidth;
    input.wallWidth.value = wallWidth;
    input.outerWallWidth.value = outerWallWidth;
    input.pathColor.value = pathColor;
    input.wallColor.value = wallColor;
    input.delay.value = delay;
    input.seed.value = seed;
  },
  check: () => {
    if (
      input.rings.value != rings ||
      input.pointsFromCenter.value != pointsFromCenter ||
      input.pathWidth.value != pathWidth ||
      input.wallWidth.value != wallWidth ||
      input.outerWallWidth.value != outerWallWidth ||
      input.pathColor.value != pathColor ||
      input.wallColor.value != wallColor ||
      input.seed.value != seed
    ){
      settings.update()
    }
  },
  update: () => {
    clearTimeout(maze.timer)
    rings = parseFloat(inputRings.value)
    pointsFromCenter = parseFloat(inputPointsFromCenter.value)
    pathWidth = parseFloat(inputPathWidth.value)
    wallWidth = parseFloat(inputWallWidth.value)
    outerWallWidth = parseFloat(inputOuterWallWidth.value)
    pathColor = inputPathColor.value
    wallColor = inputWallColor.value
    seed = parseFloat(inputSeed.value)

    maze = new MazeGenerator(defaults);
    maze.createMaze();
  },
}

buttonRandomSeed.addEventListener('click', () => {
  inputSeed.value = Math.random()*100000|0
});

settings.display();
maze.createMaze();
setInterval(settings.check, 400);
