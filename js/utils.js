function renderBoard(board) {
  var strHTML = '<table border="1"><tbody>'

  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      // var cell = board[i][j]
      var className = 'cell cell' + i + '-' + j

      // if(cell.isMine)

      strHTML += `<td class="${className}" onmousedown="cellClicked(this,${i},${j},event.which)" oncontextmenu="event.preventDefault()"></td>`
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

function cellClicked(elCell, cellI, cellJ, ev = null) {
  if (!gGame.isOn && !gGame.isFirstMove) return
  if(gIsHint){
     giveHint(cellI,cellJ,elCell)
     return
  }
  if (
    (cellJ < 0 ||
      cellJ >= gBoard.length ||
      cellI < 0 ||
      cellI >= gBoard.length) &&
    !gGame.isFirstMove
  )
    return
  
  var elLives = document.querySelector('.lives')
  if (ev === 0 || ev === 2 || ev > 3) return
  if (ev === 3) var isRightClick = true
  if (ev === 1) var isRightClick = false

  if (isRightClick) {
   
    if (gGame.isFirstMove) {
      startGame(cellI, cellJ)
      cellMarked(elCell, cellI, cellJ)
    } else cellMarked(elCell, cellI, cellJ)

  } else if (!isRightClick && !gBoard[cellI][cellJ].isMarked) {
    
    if (gGame.isFirstMove) {
      startGame(cellI, cellJ)
      gBoard[cellI][cellJ].isShown = true
      if (gBoard[cellI][cellJ].minesAroundCount === 0) {
        expand(gBoard, cellI, cellJ, elCell)
        gGame.shownCount++
      } else {
        renderCell(cellI, cellJ, gBoard[cellI][cellJ].minesAroundCount,1)
        gBoard[cellI][cellJ].isShown = true
        gGame.shownCount++
      }
    } else if (
      !gBoard[cellI][cellJ].isMarked &&
      !gBoard[cellI][cellJ].isMine &&
      !gBoard[cellI][cellJ].isShown
    ) {
      if (gBoard[cellI][cellJ].minesAroundCount === 0) {
        expand(gBoard, cellI, cellJ, elCell)
      }
      renderCell(cellI, cellJ, gBoard[cellI][cellJ].minesAroundCount,1)
      checkGameOver()

      // gBoard[cellI][cellJ].isShown = true
    } else if (gBoard[cellI][cellJ].isMine&&!gBoard[cellI][cellJ].isShown) {
      gGame.livesCount--
      renderCell(cellI, cellJ, MINE,1)
      gLevel.MINES--
      gBoard[cellI][cellJ].isShown=true
      // gBoard[cellI][cellJ].isShown= true
      elLives.innerText = gGame.livesCount
      checkGameOver()
    }
  }
    
  
  // console.log('game lives:',gGame.livesCount)
  // console.log('gGame.shownCount', gGame.shownCount)
  // console.log('gGame.markedCount', gGame.markedCount)
  // console.table(gBoard)
  // console.log(gBoard[cellI][cellJ])
}

function cellMarked(elCell, cellI, cellJ) {
  if (gBoard[cellI][cellJ].isMarked) {
    gBoard[cellI][cellJ].isMarked = false
    renderCell(cellI, cellJ, '',3)

    if (gBoard[cellI][cellJ].isMine) gGame.markedCount--
  } else if (!gBoard[cellI][cellJ].isShown && !gBoard[cellI][cellJ].isMarked) {
    gBoard[cellI][cellJ].isMarked = true
    renderCell(cellI, cellJ, MARK,3)
    if (gBoard[cellI][cellJ].isMine) gGame.markedCount++
  }
  checkGameOver()
}

function startGame(cellI, cellJ) {
  generateMines(cellI, cellJ)
  gStartTime = Date.now()
  gTimeInterval = setInterval(setTimer, 1000)
  gGame.isOn = true
  gGame.isFirstMove = false
  setMinesNegsCount(gBoard)
}


function giveHint(cellI,cellJ,elCell){
 if(!gGame.isOn){
   startGame(cellI,cellJ)
 }
 var shownCells = []
 var shownCellIdx = 0
 for (var i = cellI - 1; i <= cellI + 1; i++) {
   if(i<0 || i >= gBoard.length) continue
  for (var j = cellJ - 1; j <= cellJ + 1; j++) {
    if (j < 0 || j >= gBoard.length) continue
    shownCellIdx++
      //  if(gBoard[i][j].isShown)shownCells.push(shownCellIdx)
      //  else{
         if(gBoard[i][j].isShown === false){
              setTimeout(renderHint,1000,i,j)
         }
         if(gBoard[i][j].isMine && !gBoard[i][j].isShown)
         renderCell(i,j,MINE)
         else renderCell(i,j,gBoard[i][j].minesAroundCount)
       }
     
      
}
gGame.hintsLeft--
gIsHint= false
} 
// setTimeout(closeHints,1000 , cellI,cellJ,elCell,shownCells)
// gIsHint = false
// }

// function closeHints(cellI,cellJ,elCell,idxCells){
//   var cellIdx = 0 
//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//     if(i<0 || i >= gBoard.length) continue
//    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
     
//      if (j < 0 || j >= gBoard.length) continue
//      cellIdx++

//      if(idxCells.includes(cellIdx))continue   
//      else {
//        gBoard[i][j].isShown = false
//        renderCell(cellI,cellJ,'')
//      }
// }
//   }
//   gIsHint = false
// }

function renderHint(cellI,cellJ){
  var elCell = document.querySelector(`.cell${cellI}-${cellJ}`)
     if(!gBoard[cellI][cellJ].isShown){
        elCell.innerHTML = ''
     }
}
  


function expand(board, cellI, cellJ, elCell) {
  // debugger
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j > board[cellI].length - 1) continue

      // cellClicked(elCell,i,j,1)
      //  if (gBoard[i][j].minesAroundCount === 0&&!gBoard[i][j].isShown){
      //    expand(board,i,j,elCell)
      //  }
      //  }
      // if(gBoard[i][j].minesAroundCount===0){
      //   expand(board,i,j,elCell)
      //   return
      // }
      if (gBoard[i][j].isMarked) continue
      if (gBoard[i][j].isMine) continue
      renderCell(i, j, gBoard[i][j].minesAroundCount,1)
    }
  }
}




function renderCell(cellI, cellJ, value , evKey) {
  var elCell = document.querySelector(`.cell${cellI}-${cellJ}`)
  if (
    // !gBoard[cellI][cellJ].isMine &&
    !gBoard[cellI][cellJ].isMarked &&
    !gBoard[cellI][cellJ].isShown && evKey === 1
  ) {
    gGame.shownCount++
    console.log('shownCount',gGame.shownCount)
    if (!gBoard[cellI][cellJ].isMine && !gBoard[cellI][cellJ].isMarked)
      gBoard[cellI][cellJ].isShown = true
  }
  elCell.innerHTML = value
}

function buildBoard() {
  var board = []

  for (var i = 0; i < gLevel.SIZE; i++) {
    board.push([])
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }

  return board
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (!board[i][j].isMine) {
        var negsCount = countNeighbors(board, i, j)
        board[i][j].minesAroundCount = negsCount
      }
    }
  }
  return board
}

// function setMinesNegsCount(board, cellI, cellJ) {

//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//     if (i < 0 || i >= board.length) continue
//     for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//       if (i === cellI && j === cellJ) continue
//       if (j < 0 || j >= board[i].length) continue
//       if (board[i][j].isMine) board[cellI][cellJ].minesAroundCount++
//     }
//   }
// }

function generateMines(cellI, cellJ) {
  var minesCount = 0
  while (minesCount < gLevel.MINES) {
    var randomCellI = getRandomIntInt(0, gBoard.length)
    var randomCellJ = getRandomIntInt(0, gBoard.length)
    if (randomCellI === cellI && randomCellJ === cellJ) continue
    if (gBoard[randomCellI][randomCellJ].isMine) continue

    gBoard[randomCellI][randomCellJ].isMine = true
    minesCount++
  }
}

function getRandomIntInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

function countNeighbors(board, cellI, cellJ) {
  var neighborsSum = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue
      if (j < 0 || j >= board[i].length) continue
      if (board[i][j].isMine) {
        neighborsSum++
      }
    }
  }
  return neighborsSum
}

// function cellClicked(elCell, cellI, cellJ, ev = null) {
//   if (ev === 0 || ev === 2 || ev > 3) return
//   if (ev === 3) var isRightClick = true
//   if (ev === 1) var isRightClick = false

//   if (isRightClick) {
//     if (!gGame.isOn) {
//       generateMines(cellI, cellJ)
//       gStartTime = Date.now()
//       gTimeInterval = setInterval(setTimer, 1000)
//       gGame.isOn = true
//       gBoard[cellI][cellJ].isMarked = true
//       renderCell(cellI, cellJ, MARK)
//     } else if (!gBoard[cellI][cellJ].isShown) {
//       if (gBoard[cellI][cellJ].isMarked) {
//         gBoard[cellI][cellJ].isMarked = false

//         gGame.markedCount--
//         renderCell(cellI, cellJ, '')
//       } else {
//         gGame.markedCount++
//         gBoard[cellI][cellJ].isMarked = true
//         renderCell(cellI, cellJ, MARK)
//       }
//     }
//   }
