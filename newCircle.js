// credit for first puzzle example. adapted for a circular (theta) maze:
// https://codepen.io/GabbeV/pen/viAec

pathWidth = 15       //Width of the Maze Path
wall = 8            //Width of the Walls between Paths
outerWall = 8        //Width of the Outer most wall
rings = 8          //Number of concentric rings surrounding center
pointsFromCenter = 4          //How many paths diverge from center
delay = 1            //Delay between algorithm cycles
let r = 0        //Radial starting position from center
let t = 0       //Angular starting position from center
seed = Math.random()*100000|0//Seed for random numbers
wallColor = '#d24'   //Color of the walls
pathColor = '#222a33'//Color of the path
const mazeDiameter = outerWall*2 + pathWidth + 2*rings*(pathWidth+wall)
const map = []
let rChange = 0
let tChange = 0

const factorsOfTwo = (rings) => {
  let array = [2]
  let x = 0
  while (array[x] <= rings) {
    x++
    array.push(Math.pow(2, x+1))
  }
  return array
}
const doubleSets = factorsOfTwo(rings)

const degreesToRadians = (angleInDegrees) => {
  return (Math.PI * angleInDegrees) / 180;
}

randomGen = function(seed){
	if(seed===undefined)var seed=performance.now()
	return function(){
    seed = (seed * 9301 + 49297) % 233280
		return seed/233280
	}
}

init = function(){
  canvas = document.getElementById('circles')
  canvas.width = mazeDiameter
  canvas.height = mazeDiameter
  ctx = canvas.getContext('2d')

  ctx.arc(mazeDiameter/2, mazeDiameter/2, mazeDiameter/2, 0, Math.PI * 2, false);
  ctx.fillStyle = wallColor
  ctx.fill()
  // Until you change the seed (through page refresh or button), mazes recreated with same height and width will be the same
  random = randomGen(seed)
  ctx.strokeStyle = pathColor
  ctx.lineCap = 'round'
  ctx.lineWidth = pathWidth
  ctx.beginPath()

  let ringCells = pointsFromCenter
  for (let i=0; i<=rings;i++) {
    let angle = 0
    map[i] = []
    if (i === 0) {
      // Starting point in center of the rings
      map[i][i] = {
        angle: 0,
        visited: true
      }
    } else {
      if (doubleSets.includes(i)) {
        // Gradually double the number of cells in a ring 
        ringCells = ringCells * 2
      }
  
      for (let j=0; j<ringCells; j++) {
        angle = j * (360 / ringCells)
        map[i][j] = {
          angle: angle,
          visited: false
        }
      }
    }
  }

  route = [[r,t]]
  ctx.moveTo(mazeDiameter/2, mazeDiameter/2)
}
init()

inputRings = document.getElementById('rings')
inputPathsFromCenter = document.getElementById('pathsFromCenter')
inputPathWidth = document.getElementById('pathwidth')
inputWallWidth = document.getElementById('wallwidth')
inputOuterWidth = document.getElementById('outerwidth')
inputPathColor = document.getElementById('pathcolor')
inputWallColor = document.getElementById('wallcolor')
inputSeed = document.getElementById('seed')
buttonRandomSeed = document.getElementById('randomseed')

settings = {
  display: function(){
    inputRings.value = rings
    inputPathsFromCenter.value = pointsFromCenter
    inputPathWidth.value = pathWidth
    inputWallWidth.value = wall
    inputOuterWidth.value = outerWall
    inputPathColor.value = pathColor
    inputWallColor.value = wallColor
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
    init()
    loop()
  }
}

buttonRandomSeed.addEventListener('click',function(){
  inputSeed.value = Math.random()*100000|0
})

// Example of a depth first search maze algorithm
// How or is it different from a recursive backtracking algorithm?
let counter = 0
loop = function(){
  r = route[route.length-1][0]|0
  t = route[route.length-1][1]|0

  let directions = []
  const alternatives = []

  if (route.length === 1) {
    // First condition when starting from the center
    for (let i=0; i<pointsFromCenter; i++) {
      directions.push([1,i])
    }
  } else if (doubleSets.includes(r+1)) {
    // Last ring from center with same number of cells. Extra direction option when jumping to next ring
    directions = [[1,1],[1,-1],[-1,0],[0,1],[0,-1]]
  } else {
    // Rings above and below have equal number of cells
    directions = [[1,0],[-1,0],[0,1],[0,-1]]
  }
  
  for (var i=0; i<directions.length; i++) {
    const outsideMaze = map[directions[i][0] + r] === undefined
    if (outsideMaze) continue
    let visited = false
    // Since we're using rings, need to account for route going back around to beginning
    let angularOptions = map[directions[i][0] + r].length
    let directedAngle = directions[i][1] + t
    let mapAdjAngle = angularOptions === directedAngle ? 0 : (directedAngle === -1 ? angularOptions - 1 : directedAngle)

    if (map[directions[i][0] + r].length === 1) {
      visited = true
    } else if (directions[i][0] === 1 && doubleSets.includes(r+1)) {
      // Checking the right cells in case the next ring doubles in size
      let halfAdjuster = directions[i][1] > 0 ? 1 : 0
      directedAngle = 2 * t + halfAdjuster
      mapAdjAngle = angularOptions === directedAngle ? 0 : (directedAngle === -1 ? angularOptions - 1 : directedAngle)
      visited = map[directions[i][0] + r][mapAdjAngle].visited
    } else if (directions[i][0] === -1 && doubleSets.includes(r)) {
      // Checking the right cells when going down to a ring with half cells
      mapAdjAngle = Math.floor(t/2)
      visited = map[directions[i][0] + r][mapAdjAngle].visited
    } else {
      visited = map[directions[i][0] + r][mapAdjAngle].visited
    }

    if (!visited) {
      const mapAdjDirection = [directions[i][0], mapAdjAngle]
      alternatives.push(mapAdjDirection)
    }
  }
  
  if (alternatives.length === 0) {
    route.pop()
    if (route.length>0) {
      let radius = route[route.length-1][0] * (pathWidth+wall)
      let theta = degreesToRadians(map[route[route.length-1][0]][route[route.length-1][1]].angle)
      let lastX = radius * Math.cos(theta) + mazeDiameter / 2
      let lastY = radius * Math.sin(theta) + mazeDiameter / 2
      ctx.moveTo(lastX, lastY)
      timer = setTimeout(loop,delay)
    }
    return;
  }

  direction = alternatives[random()*alternatives.length|0]
  route.push([direction[0]+r, direction[1]])

  let isArc = direction[0] === 0
  let lastAngle = degreesToRadians(map[r][t].angle)
  let theta = degreesToRadians(map[direction[0] + r][direction[1]].angle)
  let oldRadius = r * (pathWidth + wall)
  let radius = (direction[0] + r) * (pathWidth + wall)
  let arcThenLine = doubleSets.includes(direction[0] + r) && direction[0] > 0
  let lineThenArc = doubleSets.includes(r) && direction[0] < 0
  let angleOffset = theta - lastAngle
  // TODO: Need to clean up this logic
  let counterClockwise = angleOffset < 0 || (t === 0 && direction[1] !== 1)
  if (direction[1] === 0 && t !== 1) {
    counterClockwise = false
  }

  if (isArc) {
    ctx.arc(mazeDiameter/2, mazeDiameter/2, radius, lastAngle, theta, counterClockwise)
    ctx.stroke()
  } else if (arcThenLine) {
    // Going from ring with x cells to ring with 2x cells
    let newX = radius * Math.cos(theta) + mazeDiameter / 2
    let newY = radius * Math.sin(theta) + mazeDiameter / 2
    ctx.arc(mazeDiameter/2, mazeDiameter/2, oldRadius, lastAngle, theta, counterClockwise)
    ctx.lineTo(newX, newY)
    ctx.stroke()

  } else if (lineThenArc) {
    // Going from ring with x cells to ring with x/2 cells
    let newX = radius * Math.cos(lastAngle) + mazeDiameter / 2
    let newY = radius * Math.sin(lastAngle) + mazeDiameter / 2
    ctx.lineTo(newX, newY)
    ctx.arc(mazeDiameter/2, mazeDiameter/2, radius, lastAngle, theta, counterClockwise)
    ctx.stroke()
  } else {
    let newX = radius * Math.cos(theta) + mazeDiameter / 2
    let newY = radius * Math.sin(theta) + mazeDiameter / 2
    ctx.lineTo(newX, newY)
    ctx.stroke()
  }

  map[direction[0]+r][direction[1]].visited = true
  timer = setTimeout(loop,delay)
}
settings.display()
loop()
setInterval(settings.check,400)

// Listen for mouse moves
canvas.addEventListener('mousemove', function(event) {
  result.innerText = ctx.isPointInStroke(event.offsetX, event.offsetY)
  xPos.innerText = event.clientX + ", " + event.offsetX
  yPos.innerText = event.clientY + ", " + event.offsetY
});

// Listen for arrow keys
let currentRing = 0
let currentAngle = 0
const detectKey = (e) => {
  const posTop = document.getElementById('circles').offsetTop;
  const screenX = document.getElementById('circles').clientWidth / 2 + rChange
  const screenY = document.getElementById('circles').clientHeight / 2 + tChange
  const moveDist = pathWidth + wall

  const checkUp = ctx.isPointInStroke(screenX, screenY - moveDist/2)
  const checkDown = ctx.isPointInStroke(screenX, screenY + moveDist/2)
  let angleOptions = 360 / map[currentRing+1].length
  console.log('hello', angleOptions)

  e = e || window.event;
  if (e.keyCode == '38' && checkUp) {
    // up arrow
    tChange -= moveDist
    document.getElementById('circles').style.top  = (posTop+moveDist)+"px";
  } else if (e.keyCode == '40' && checkDown) {
    // down arrow
    tChange += moveDist
    document.getElementById('circles').style.top  = (posTop-moveDist)+"px";
  } else if (e.keyCode == '37') {
    // left arrow
    currentAngle -= angleOptions
    document.getElementById('circles').style.transform  = `rotate(${currentAngle}deg)`;
  } else if (e.keyCode == '39') {
    // right arrow
    currentAngle += angleOptions
    document.getElementById('circles').style.transform  = `rotate(${currentAngle}deg)`;
  }
}

document.onkeydown = detectKey