import { defaults } from './defaults.js';
import { MazeGenerator } from './maze-generator.js';

let { pathWidth, wall, outerWall, rings, pointsFromCenter, delay, seed, wallColor, pathColor } = defaults;

let r = 0 //Radial starting position from center
let t = 0 //Angular starting position from center

let maze = new MazeGenerator(defaults);

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
  display: function(){
    inputRings.value = rings
    inputPathsFromCenter.value = pointsFromCenter
    inputPathWidth.value = pathWidth
    inputWallWidth.value = wall
    inputOuterWidth.value = outerWall
    inputPathColor.value = pathColor
    inputWallColor.value = wallColor
    inputDelay.value = delay
    inputSeed.value = seed
  },
  check: function(){
    if(inputRings.value != rings||
      inputPathsFromCenter.value != pointsFromCenter||
       inputPathWidth.value != pathWidth||
       inputWallWidth.value != wall||
       inputOuterWidth.value != outerWall||
       inputPathColor.value != pathColor||
       inputWallColor.value != wallColor||
       inputSeed.value != seed){
      settings.update()
    }
  },
  update: function(){
    clearTimeout(timer)
    rings = parseFloat(inputRings.value)
    pointsFromCenter = parseFloat(inputPathsFromCenter.value)
    pathWidth = parseFloat(inputPathWidth.value)
    wall = parseFloat(inputWallWidth.value)
    outerWall = parseFloat(inputOuterWidth.value)
    pathColor = inputPathColor.value
    wallColor = inputWallColor.value
    seed = parseFloat(inputSeed.value)
    r = 0
    t = 0
    maze = new MazeGenerator();
    maze.createMaze();
  }
}

buttonRandomSeed.addEventListener('click', () => {
  inputSeed.value = Math.random()*100000|0
});

settings.display();
maze.createMaze();
setInterval(settings.check, 400);
