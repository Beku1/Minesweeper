

var gBoard
var gTimeInterval
var gButtonPressed
var gStartTime
const MINE = '💣'
const MARK = '!'

var gLevel = {
  SIZE:4,
  MINES:2
}


var gGame = {
  markedCount: 0,
  shownCount: 0,
  secsPassed:0,
  isOn: false,
}

function init(){
  gBoard = buildBoard()
  renderBoard(gBoard)

}

function setTimer(){
  var currTime = Date.now()
  var newTime = new Date(currTime - gStartTime)
  var elTimer = document.querySelector('.timer')
  var timer = newTime.getMinutes() +' : ' +newTime.getSeconds()
  // console.log(printTime)
  elTimer.innerText = timer
}

function gameFinished() {
 
}

