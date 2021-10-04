
gAllCells= document.querySelectorAll(`.cell`)
gAllCells.forEach(element => {
  element.addEventListener('click', e =>{
    console.log(e)
  })
});

function renderBoard(board) {
 
  var strHTML = '<table border="1"><tbody>'

  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      // var cell = board[i][j]
      var className = 'cell cell' + i + '-' + j
      
      // if(cell.isMine)
      
      strHTML += `<td class="${className}" onmousedown="cellClicked(${i},${j},event)" oncontextmenu="event.preventDefault()"></td>`
      // else {
        // setMinesNegsCount(gBoard,i,j)
        // strHTML += `<td data-i="${i}" data-j="${j}" class="${className}" onclick="cellClicked(${i},${j})"></td>`
      // }
      
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'
  var elContainer = document.querySelector('.board-container')
  elContainer.innerHTML = strHTML

}



function cellClicked(cellI,cellJ,ev){
  console.log(ev)
  if(ev.which===3){
    if(!gGame.isOn){
      generateMines(cellI,cellJ) 
  gStartTime = Date.now()
  gTimeInterval = setInterval(setTimer, 1000)
  gGame.isOn = true
  gBoard[cellI][cellJ].isMarked = true
  renderCell(cellI,cellJ,MARK)
    }
    else if(!gBoard[cellI][cellJ].isShown){
      if(gBoard[cellI][cellJ].isMarked){
        gBoard[cellI][cellJ].isMarked = false
        renderCell(cellI,cellJ,'')
      }
      else{

      gBoard[cellI][cellJ].isMarked = true
  renderCell(cellI,cellJ,MARK)
      }
    }
  }

  
 if(ev.which===1 && !gBoard[cellI][cellJ].isMarked){
if(!gGame.isOn){
  generateMines(cellI,cellJ) 
  gStartTime = Date.now()
  gTimeInterval = setInterval(setTimer, 1000)
  gGame.isOn = true
  gBoard[cellI][cellJ].isShown = true
  setMinesNegsCount(gBoard,cellI,cellJ)
  renderCell(cellI,cellJ,gBoard[cellI][cellJ].minesAroundCount)
}
else if(gBoard[cellI][cellJ].isMine){
   gBoard[cellI][cellJ].isShown = true
   renderCell(cellI,cellJ,MINE)
}

else if(!gBoard[cellI][cellJ].isMine && !gBoard[cellI][cellJ].isShown){
  gBoard[cellI][cellJ].isShown = true
  setMinesNegsCount(gBoard,cellI,cellJ)
  renderCell(cellI,cellJ,gBoard[cellI][cellJ].minesAroundCount)
}

}
}



function renderCell(cellI,cellJ,value) {
  var elCell = document.querySelector(`.cell${cellI}-${cellJ}`)
  elCell.innerHTML = value
}

// function getEmptyCells(board) {
//   var emptyCells = []
//   for (var i = 0; i < board.length; i++) {
//     for (var j = 0; j < board[0].length; j++) {
//       if (board[i][j] === EMPTY) {
//         emptyCells.push({ i, j })
//       }
//     }
//   }
//   return emptyCells
// }

function getRandomIntInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function buildBoard(){
  var board = []
  
  for (var i = 0; i < gLevel.SIZE ; i++) {
    board.push([])
    for (var j = 0; j < gLevel.SIZE ; j++) {
      board[i][j] = {
        minesAroundCount:0,
        isShown:false,
        isMine:false,
        isMarked:false
      }
    }
    }

    return board
  }


function setMinesNegsCount(board,cellI,cellJ){

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue
      if (j < 0 || j >= board[i].length) continue
      if (board[i][j].isMine)  board[cellI][cellJ].minesAroundCount++
    }
  }
}

function  generateMines(cellI,cellJ){
  var minesCount = 0
 while(minesCount<gLevel.MINES){
  var randomCellI = getRandomIntInt(0,gBoard.length-1)
  var randomCellJ = getRandomIntInt(0,gBoard.length-1)
     if( randomCellI === cellI && randomCellJ === cellJ) {
      continue
     }
    if(gBoard[randomCellI][randomCellJ].isMine) continue
     
    gBoard[randomCellI][randomCellJ].isMine = true
    minesCount++
    
  }
}


function getRandomIntInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}