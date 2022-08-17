export const defaults = {
  pathWidth: 15, //Width of the Maze Path
  wall: 8, //Width of the Walls between Paths
  outerWall: 8, //Width of the Outer most wall
  rings: 6, //Number of concentric rings surrounding center
  pointsFromCenter: 4, //How many paths diverge from center
  delay: 1, //Delay between algorithm cycles
  seed: Math.random()*100000|0, //Seed for random numbers
  wallColor: '#d24', //Color of the walls
  pathColor: '#222a33', //Color of the path
};
