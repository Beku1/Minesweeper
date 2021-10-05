var gBoard
var gHintInterval
var gIsHint = false
var gTimeInterval
var gButtonPressed
var gStartTime
const MINE = '💥'
const MARK = '🚩'

var gLevel = {
  SIZE: 4,
  MINES: 2,
}

var gGame = {
  markedCount: 0,
  shownCount: 0,
  secsPassed: 0,
  isOn: false,
  isFirstMove: true,
  livesCount: 2,
  hintsLeft: 3,
}

function init() {
  var elSmiley = document.querySelector('.smiley')
  elSmiley.innerText = '😀'
  restartGame()
  gBoard = buildBoard()
  renderBoard(gBoard)
}

function restartGame() {
  gGame.markedCount = 0
  gGame.shownCount = 0
  gGame.isFirstMove = true
  gGame.isOn = false
  if (gLevel.MINES > 3) gGame.livesCount = 100
  else gGame.livesCount = 2
  gGame.hintsLeft = 3

  clearInterval(gTimeInterval)
  var elLives = document.querySelector('.lives')
  elLives.innerText = gGame.livesCount
}

function setTimer() {
  var currTime = Date.now()
  var newTime = new Date(currTime - gStartTime)
  var elTimer = document.querySelector('.timer')
  var timer = newTime.getMinutes() + ' : ' + newTime.getSeconds()
  // console.log(printTime)
  elTimer.innerText = timer
}

function checkGameOver() {
  var elSmiley = document.querySelector('.smiley')
  var shownTarget = gLevel.SIZE ** 2 - gLevel.MINES
  if (gGame.markedCount === gLevel.MINES && gGame.shownCount === shownTarget) {
    clearInterval(gTimeInterval)
    gGame.isOn = false
    elSmiley.innerText = '😎'
    console.log('you WIN')
  } else if (gGame.livesCount === 0) {
    clearInterval(gTimeInterval)
    revealBoard()
    gGame.isOn = false
    elSmiley.innerText = '🤯'
    console.log('YOU LOST')
  }
}

function getHint() {
  if(gGame.hintsLeft>0){
  gIsHint = true
  
  }
}

function revealBoard() {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isMine) {
        renderCell(i, j, MINE)
      }
    }
  }
}

function diffuculty(size, mines) {
  gLevel.MINES = mines
  gLevel.SIZE = size
  init()
}
