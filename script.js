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
};

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
    const valuesHaveChanged = input.rings.value != rings ||
      input.pointsFromCenter.value != pointsFromCenter ||
      input.pathWidth.value != pathWidth ||
      input.wallWidth.value != wallWidth ||
      input.outerWallWidth.value != outerWallWidth ||
      input.pathColor.value != pathColor ||
      input.wallColor.value != wallColor ||
      input.delay.value != delay ||
      input.seed.value != seed;

    if (valuesHaveChanged) settings.update();
  },
  update: () => {
    clearTimeout(maze.timer);
    rings = parseFloat(input.rings.value)
    pointsFromCenter = parseFloat(input.pointsFromCenter.value)
    pathWidth = parseFloat(input.pathWidth.value)
    wallWidth = parseFloat(input.wallWidth.value)
    outerWallWidth = parseFloat(input.outerWallWidth.value)
    pathColor = input.pathColor.value
    wallColor = input.wallColor.value
    delay = parseFloat(input.delay.value)
    seed = parseFloat(input.seed.value)

    const updatedInput = {
      rings,
      pointsFromCenter,
      pathWidth,
      wallWidth,
      outerWallWidth,
      pathColor,
      wallColor,
      delay,
      seed,
    }

    maze = new MazeGenerator(updatedInput);
    maze.createMaze();
  },
}

input.buttonRandomSeed.addEventListener('click', () => {
  input.seed.value = Math.random() * 100000 | 0;
});

settings.display();
maze.createMaze();
setInterval(settings.check, 400);
