// credit for first puzzle example:
// https://codepen.io/GabbeV/pen/viAec

pathWidth = 20       //Width of the Maze Path
wall = 7             //Width of the Walls between Paths
outerWall = 7        //Width of the Outer most wall
width = 4           //Number paths fitted horisontally
height = 4          //Number paths fitted vertically
delay = 1            //Delay between algorithm cycles
x = width/2|0        //Horisontal starting position
y = height/2|0       //Vertical starting position
seed = Math.random()*100000|0//Seed for random numbers
wallColor = '#d24'   //Color of the walls
pathColor = '#222a33'//Color of the path
let xChange = height % 2 == 0 ? (pathWidth + wall) / 2 : 0
let yChange = width % 2 == 0 ? (pathWidth + wall) / 2 : 0

randomGen = function(seed){
	if(seed===undefined)var seed=performance.now()
	return function(){
    seed = (seed * 9301 + 49297) % 233280
		return seed/233280
	}
}

init = function(){
  offset = pathWidth/2+outerWall
  map = []
  canvas = document.getElementById('depthFirstSearch')
  ctx = canvas.getContext('2d')
  canvas.width = outerWall*2+width*(pathWidth+wall)-wall
  canvas.height = outerWall*2+height*(pathWidth+wall)-wall
  ctx.fillStyle = wallColor
  ctx.fillRect(0,0,canvas.width,canvas.height)
  // Until you change the seed (through page refresh or button), mazes recreated with same height and width will be the same
  random = randomGen(seed)
  ctx.strokeStyle = pathColor
  ctx.lineCap = 'square'
  ctx.lineWidth = pathWidth
  ctx.beginPath()
  for(var i=0;i<height*2;i++){
    map[i] = []
    for(var j=0;j<width*2;j++){
      map[i][j] = false
    }
  }
  map[y*2][x*2] = true
  route = [[x,y]]
  ctx.moveTo(x*(pathWidth+wall)+offset,
             y*(pathWidth+wall)+offset)
}
init()

inputWidth = document.getElementById('width')
inputHeight = document.getElementById('height')
inputPathWidth = document.getElementById('pathwidth')
inputWallWidth = document.getElementById('wallwidth')
inputOuterWidth = document.getElementById('outerwidth')
inputPathColor = document.getElementById('pathcolor')
inputWallColor = document.getElementById('wallcolor')
inputSeed = document.getElementById('seed')
buttonRandomSeed = document.getElementById('randomseed')

settings = {
  display: function(){
    inputWidth.value = width
    inputHeight.value = height
    inputPathWidth.value = pathWidth
    inputWallWidth.value = wall
    inputOuterWidth.value = outerWall
    inputPathColor.value = pathColor
    inputWallColor.value = wallColor
    inputSeed.value = seed
  },
  check: function(){
    if(inputWidth.value != width||
       inputHeight.value != height||
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
    width = parseFloat(inputWidth.value)
    height = parseFloat(inputHeight.value)
    pathWidth = parseFloat(inputPathWidth.value)
    wall = parseFloat(inputWallWidth.value)
    outerWall = parseFloat(inputOuterWidth.value)
    pathColor = inputPathColor.value
    wallColor = inputWallColor.value
    seed = parseFloat(inputSeed.value)
    x = width/2|0
    y = height/2|0
    init()
    loop()
  }
}

// Adjust map position if width or height have even rows/columns
const adjustCanvas = () => {
  const posLeft = document.getElementById('depthFirstSearch').offsetLeft;
  const posTop = document.getElementById('depthFirstSearch').offsetTop;

  document.getElementById('depthFirstSearch').style.top  = (posTop-yChange)+"px";
  document.getElementById('depthFirstSearch').style.left  = (posLeft-xChange)+"px";
}

adjustCanvas()

buttonRandomSeed.addEventListener('click',function(){
  inputSeed.value = Math.random()*100000|0
})

// Example of a depth first search maze algorithm
// How or is it different from a recursive backtracking algorithm?
loop = function(){
  x = route[route.length-1][0]|0
  y = route[route.length-1][1]|0
  
  var directions = [[1,0],[-1,0],[0,1],[0,-1]],
      alternatives = []
  
  for(var i=0;i<directions.length;i++){
    if(map[(directions[i][1]+y)*2]!=undefined&&
       map[(directions[i][1]+y)*2][(directions[i][0]+x)*2]===false){
      alternatives.push(directions[i])
    }
  }
  
  if(alternatives.length===0){
    route.pop()
    if(route.length>0){
      ctx.moveTo(route[route.length-1][0]*(pathWidth+wall)+offset,
                 route[route.length-1][1]*(pathWidth+wall)+offset)
      timer = setTimeout(loop,delay)
    }
    return;
  }
  direction = alternatives[random()*alternatives.length|0]
  route.push([direction[0]+x,direction[1]+y])
  ctx.lineTo((direction[0]+x)*(pathWidth+wall)+offset,
             (direction[1]+y)*(pathWidth+wall)+offset)
  map[(direction[1]+y)*2][(direction[0]+x)*2] = true
  map[direction[1]+y*2][direction[0]+x*2] = true
  ctx.stroke()
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
const detectKey = (e) => {
  const posLeft = document.getElementById('depthFirstSearch').offsetLeft;
  const posTop = document.getElementById('depthFirstSearch').offsetTop;
  const screenX = document.getElementById('depthFirstSearch').clientWidth / 2 + xChange
  const screenY = document.getElementById('depthFirstSearch').clientHeight / 2 + yChange
  const moveDist = pathWidth + wall

  const checkUp = ctx.isPointInStroke(screenX, screenY - moveDist/2)
  const checkDown = ctx.isPointInStroke(screenX, screenY + moveDist/2)
  const checkLeft = ctx.isPointInStroke(screenX - moveDist/2, screenY)
  const checkRight = ctx.isPointInStroke(screenX + moveDist/2, screenY)

  e = e || window.event;
  if (e.keyCode == '38' && checkUp) {
    // up arrow
    yChange -= moveDist
    document.getElementById('depthFirstSearch').style.top  = (posTop+moveDist)+"px";
  } else if (e.keyCode == '40' && checkDown) {
    // down arrow
    yChange += moveDist
    document.getElementById('depthFirstSearch').style.top  = (posTop-moveDist)+"px";
  } else if (e.keyCode == '37' && checkLeft) {
    // left arrow
    xChange -= moveDist
    document.getElementById('depthFirstSearch').style.left  = (posLeft+moveDist)+"px";
  } else if (e.keyCode == '39' && checkRight) {
    // right arrow
    xChange += moveDist
    document.getElementById('depthFirstSearch').style.left  = (posLeft-moveDist)+"px";
  }
}

document.onkeydown = detectKey