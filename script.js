import { defaults } from './defaults.js';
import { MazeGenerator } from './maze-generator.js';

let { pathWidth, wallWidth, outerWall, rings, pointsFromCenter, delay, seed, wallColor, pathColor } = defaults;

let r = 0 //Radial starting position from center
let t = 0 //Angular starting position from center

let maze = new MazeGenerator(defaults);

const input = {
  rings: document.getElementById('rings'),
  pathsFromCenter: document.getElementById('pathsFromCenter'),
  pathWidth: document.getElementById('pathwidth'),
  wallWidth: document.getElementById('wallwidth'),
  outerWallWidth: document.getElementById('outerwidth'),
  pathColor: document.getElementById('pathcolor'),
  wallColor: document.getElementById('wallcolor'),
  delay: document.getElementById('delay'),
  seed: document.getElementById('seed'),
  buttonRandomSeed: document.getElementById('randomseed'),
}

const inputRings = document.getElementById('rings');
const inputPathsFromCenter = document.getElementById('pathsFromCenter');
const inputPathWidth = document.getElementById('pathwidth');
const inputWallWidth = document.getElementById('wallwidth');
const inputOuterWidth = document.getElementById('outerwidth');
const inputPathColor = document.getElementById('pathcolor');
const inputWallColor = document.getElementById('wallcolor');
const inputDelay = document.getElementById('delay');
const inputSeed = document.getElementById('seed');
const buttonRandomSeed = document.getElementById('randomseed');

const settings = {
  display: () => {
    input.rings.value = rings;
    input.pathsFromCenter.value = pointsFromCenter;
    input.pathWidth.value = pathWidth;
    input.wallWidth.value = wallWidth;
    input.outerWallWidth.value = outerWall;
    input.pathColor.value = pathColor;
    input.wallColor.value = wallColor;
    input.delay.value = delay;
    input.seed.value = seed;
  },
  check: () => {
    if (
      inputRings.value != rings||
      inputPathsFromCenter.value != pointsFromCenter||
      inputPathWidth.value != pathWidth||
      inputWallWidth.value != wallWidth||
      inputOuterWidth.value != outerWall||
      inputPathColor.value != pathColor||
      inputWallColor.value != wallColor||
      inputSeed.value != seed
    ){
      settings.update()
    }
  },
  update: function(){
    clearTimeout(maze.timer)
    rings = parseFloat(inputRings.value)
    pointsFromCenter = parseFloat(inputPathsFromCenter.value)
    pathWidth = parseFloat(inputPathWidth.value)
    wallWidth = parseFloat(inputWallWidth.value)
    outerWall = parseFloat(inputOuterWidth.value)
    pathColor = inputPathColor.value
    wallColor = inputWallColor.value
    seed = parseFloat(inputSeed.value)
    r = 0
    t = 0
    maze = new MazeGenerator(defaults);
    maze.createMaze();
  }
}

buttonRandomSeed.addEventListener('click', () => {
  inputSeed.value = Math.random()*100000|0
});

settings.display();
maze.createMaze();
setInterval(settings.check, 400);
