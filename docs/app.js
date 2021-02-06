  
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10;
  let score = 0;
  let nextRandom = 0
  let timerId
  const colors = [
    '#bf4146',
    '#4941bf',
    '#fa0707',
    '#6b6b6b',
    '#902b92'
  ]
  
    //tetriminoes
  const lTetromino = [
      [1,width+1,width*2+1,2],
      [width,width+1,width+2,width*2+2],
      [1,width+1,width*2+1,width*2],
      [width,width*2,width*2+1,width*2+2]
    ]

  const zTetromino = [
    [0,width,width+1, width*2+1],
    [width+1,width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1,width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
let currentPosition = 4
let currentRotation = 0

//select a random tetromino
let random = Math.floor(Math.random() * theTetrominoes.length)
let current = theTetrominoes[random][currentRotation]

//draw the tetromino
function draw(){
current.forEach( index => { 
  squares[currentPosition + index].classList.add('tetromino')
  squares[currentPosition + index].style.backgroundColor = colors[random]
  })
}


//to undraw the tetromino
function unDraw(){
  current.forEach( index => { 
    squares[currentPosition + index].classList.remove('tetromino')
    squares[currentPosition + index].style.backgroundColor = ''
  })
}

//to make the tetromino move down every second
//timerId = setInterval( moveDown, 500 )

//assign functions to keyCodes
function control(e) {
  if (e.keyCode === 37) {
    //move left
    moveLeft()
  } else if (e.keyCode === 38) {
    //rotate
    rotate()
  } else if (e.keyCode === 39) {
    //move right
    moveRight()
  } else if(e.keyCode === 40) {
    //move down
    moveDown()
  }
}

document.addEventListener('keyup',control)

//moveDown Function
function moveDown(){
  unDraw()
  currentPosition += width
  draw()
  freeze()
}

//freeze function
function freeze() {
    if (current.some( index => squares[currentPosition + index + width].classList.contains('taken'))) {
          current.forEach( index => squares[currentPosition + index].classList.add('taken'))
          random = nextRandom
          nextRandom = Math.floor(Math.random() * theTetrominoes.length)
          current = theTetrominoes[random][currentRotation]
          currentPosition = 4
          draw()
          displayShape()
          addScore()
          gameOver()
          unDraw()
    } 
}

//to move tetromino left, unless its at the edge
function moveLeft() {
  unDraw()
  const isAtLeftEdge = current.some( index => (currentPosition + index) % width === 0)

  if (!isAtLeftEdge) {
     currentPosition -= 1
  }

  if (current.some( index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
  }
  draw()
}


function moveRight() {
  unDraw()
  const isAtRightEdge = current.some( index => (currentPosition + index) % width === width - 1)

  if (!isAtRightEdge) {
    currentPosition +=1
  }

  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -=1
  }
  draw()
}

function rotate() {
  unDraw()
  currentRotation++
  if (currentRotation === current.length) {//this will make the rotation go back to 0 after rotating 4 times
    currentRotation = 0
  }
  current = theTetrominoes[random][currentRotation]
  draw
}

//to show the next tetromino on the mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0

const upNextTetrominoes = [

[1, displayWidth+1, displayWidth*2+1,2],//lTetromino
[0, displayWidth, displayWidth+1, displayWidth*2+1],//zTetromino
[1, displayWidth, displayWidth+1, displayWidth+2],//tTetromino
[0, 1, displayWidth, displayWidth+1],//oTetromino
[1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]//iTetromino

]

//to display the next shape on the mini-grid
function displayShape() {
  //first remove any shape from the grid
  displaySquares.forEach(square => {
    square.classList.remove('tetromino')
    square.style.backgroundColor = ''
  })
  upNextTetrominoes[nextRandom].forEach( index => {
    displaySquares[ displayIndex + index ].classList.add('tetromino')
    displaySquares[ displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
}


//add functionality to the start button
startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 500)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
})

function addScore(){
  for(let i=0; i<199; i+=width ){
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
  
  if (row.every(index => squares[index].classList.contains('taken'))) {
    score += 10
    scoreDisplay.innerHTML = score
    row.forEach( index => {
      squares[index].classList.remove('taken')
      squares[index].classList.remove('tetromino')
      squares[index].style.backgroundColor = ''
    })
    const squaresRemoved = squares.splice(i, width)
    squares = squaresRemoved.concat(squares)
    squares.forEach(cell => grid.appendChild(cell)) 
    }
  }
}

//gameOver function
function gameOver() {
  if (current.some( index => squares[currentPosition + index].classList.contains('taken'))) {
     alert('Game Over')
      clearInterval(timerId)
  }
}










})
