var gBoard
var gHintInterval
var gIsHint = false
var gTimeInterval
var gButtonPressed
var gStartTime
var gIsManually = false
var gManuallyMines = 0
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
  safeClicks:3 ,
  
}

function init() {
  if(gLevel.SIZE===4)fixedDiff(4,2)
  if(gLevel.SIZE===8)fixedDiff(8,12)
  if(gLevel.SIZE===12)fixedDiff(12,30)
  var elScore = document.querySelector(".modal-bestscore")
  elScore.innerText = ''
  var elSmiley = document.querySelector('.smiley')
  elSmiley.innerText = '😀'
  restartGame()
  gBoard = buildBoard()
  renderBoard(gBoard)
  
}

function restartGame() {
  // var elScore = document.querySelector(".modal-bestscore")
  gGame.markedCount = 0
  gGame.shownCount = 0
  gGame.isFirstMove = true
  gGame.isOn = false
  if (gLevel.MINES > 3) gGame.livesCount = 3
  else gGame.livesCount = 2
  gGame.hintsLeft = 3
  gGame.secsPassed = 0
  gGame.safeClicks=3
  // elScore.innerText = 'great '
  clearInterval(gTimeInterval)
  elTextUpdate()

}


function setTimer() {
  var currTime = Date.now()
  var newTime = new Date(currTime - gStartTime)
  var elTimer = document.querySelector('.timer')
  var timer = newTime.getMinutes() + ' : ' + newTime.getSeconds()
  gGame.secsPassed++
  elTimer.innerText = timer
}

function checkGameOver() {
  
  var elSmiley = document.querySelector('.smiley')
  var shownTarget = gLevel.SIZE ** 2 - gLevel.MINES
  if (gGame.markedCount === gLevel.MINES && gGame.shownCount === shownTarget) {
    clearInterval(gTimeInterval)
    gGame.isOn = false
    elSmiley.innerText = '😎'
    bestScore(gGame.secsPassed)
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

function manually(){
if(!gGame.isOn) gIsManually = true
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

function fixedDiff(size, mines) {
  gLevel.MINES = mines
  gLevel.SIZE = size
  
}

function diffuculty(size, mines) {
  gLevel.MINES = mines
  gLevel.SIZE = size
  init()
}

function safeClick(){
  if(gGame.safeClicks>0){
  var safeCells = findSafeCells()
  var randomIdx = getRandomIntInt(0,safeCells.length-1)
  var safeCellI = safeCells[randomIdx].i
  var safeCellJ = safeCells[randomIdx].j
  
  var elCellNew = document.querySelector(`.cell${safeCellI}-${safeCellJ}`)
 
  elCellNew.classList.add('safe-cell')
  
  setTimeout(function(){elCellNew.classList.remove('safe-cell')} ,3000)
  gGame.safeClicks--
  }
  elTextUpdate()


}



function bestScore(timeSec){
  var elScore = document.querySelector(".modal-bestscore")
  localStorage.setItem(`Best time (Level ${gLevel.SIZE/4})`,  timeSec);
  
  elScore.innerText ='Great job!! You finnished in :'+timeSec +' second!! ';
}
