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
  // if(gIsManually){
  //   if(gManuallyMines===gLevel.MINES) return
  //   gBoard[cellI][cellJ]===MINE
  //   gManuallyMines++
  //   return
  // }
  if (!gGame.isOn && !gGame.isFirstMove) return
  if (gIsHint&&!gIsManually) {
    giveHint(cellI, cellJ, elCell)
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
   // This is doing the right click function
     if (isRightClick) {
    if (gGame.isFirstMove) {
      startGame(cellI, cellJ)
      cellMarked(elCell, cellI, cellJ)
    } else cellMarked(elCell, cellI, cellJ)
    // this is doing the left click function
  } else if (!isRightClick && !gBoard[cellI][cellJ].isMarked) {
    if (gGame.isFirstMove) {
      startGame(cellI, cellJ)
      gBoard[cellI][cellJ].isShown = true
      if (gBoard[cellI][cellJ].minesAroundCount === 0) {
        expand(gBoard, cellI, cellJ, elCell)
        gGame.shownCount++
      } else {
        renderCell(cellI, cellJ, gBoard[cellI][cellJ].minesAroundCount, 1)
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
      renderCell(cellI, cellJ, gBoard[cellI][cellJ].minesAroundCount, 1)
      checkGameOver()

      // gBoard[cellI][cellJ].isShown = true
    } else if (gBoard[cellI][cellJ].isMine && !gBoard[cellI][cellJ].isShown) {
      gGame.livesCount--
      renderCell(cellI, cellJ, MINE, 1)
      gLevel.MINES--
      gBoard[cellI][cellJ].isShown = true
      // gBoard[cellI][cellJ].isShown= true
      elLives.innerText = gGame.livesCount
      elTextUpdate()
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
    renderCell(cellI, cellJ, '', 3)

    if (gBoard[cellI][cellJ].isMine) gGame.markedCount--
  } else if (!gBoard[cellI][cellJ].isShown && !gBoard[cellI][cellJ].isMarked) {
    gBoard[cellI][cellJ].isMarked = true
    renderCell(cellI, cellJ, MARK, 3)
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

function giveHint(cellI, cellJ, elCell) {
  if (!gGame.isOn) {
    startGame(cellI, cellJ)
  }
  var shownCells = []
  var shownCellIdx = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard.length) continue
      shownCellIdx++
      //  if(gBoard[i][j].isShown)shownCells.push(shownCellIdx)
      //  else{
      if (gBoard[i][j].isShown === false) {
        setTimeout(renderHint, 1000, i, j)
      }
      if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
        renderCell(i, j, MINE)
        if (!gBoard[i][j].isShown) cleanClicked(i, j)
      } else {
        renderCell(i, j, gBoard[i][j].minesAroundCount)
        if (!gBoard[i][j].isShown) cleanClicked(i, j)
      }
    }
  }
  gGame.hintsLeft--
  elTextUpdate()
  gIsHint = false
}

function cleanClicked(i, j) {
  var elCellNew = document.querySelector(`.cell${i}-${j}`)
  elCellNew.classList.remove('clicked')
}



function renderHint(cellI, cellJ) {
  var elCell = document.querySelector(`.cell${cellI}-${cellJ}`)
  if (!gBoard[cellI][cellJ].isShown) {
    elCell.innerHTML = ''
  }
}

function elTextUpdate() {
  var livesText = ''
  if (gGame.livesCount === 0) livesText = '💀'
  for (var i = 0; i < gGame.livesCount; i++) {
    livesText += '❤️'
  }
  var hintsText = ''
  if (gGame.hintsLeft === 0) hintsText = ''
  for (var i = 0; i < gGame.hintsLeft; i++) {
    hintsText += '💡'
  }

  var safeText = `You have ${gGame.safeClicks} safe clicks left`

  var elSafeClick = document.querySelector('.safe-amount')
  elSafeClick.innerText = safeText
  var elHints = document.querySelector('.hints-counter')
  elHints.innerText = hintsText
  var elLives = document.querySelector('.lives')
  elLives.innerText = livesText
}

function expand(board, cellI, cellJ, elCell) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j > board[cellI].length - 1) continue
         
  
      if (gBoard[i][j].isMarked) continue
      if (gBoard[i][j].isMine) continue
      
        //recursion 
       if(gBoard[i][j].minesAroundCount===0&&!gBoard[i][j].isShown) {
        gBoard[i][j].isShown=true
        gGame.shownCount++
       expand(board,i,j, elCell) 
       }
       renderCell(i, j, gBoard[i][j].minesAroundCount, 1)
     
    }
  }
}

function findSafeCells() {
  var safeCells = []

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (!gBoard[i][j].isMine && !gBoard[i][j].isShown)
        safeCells.push({ i:i, j:j })
    }
  }
  return safeCells
}

function renderCell(cellI, cellJ, value, evKey) {
  var elCell = document.querySelector(`.cell${cellI}-${cellJ}`)
  if (
    // !gBoard[cellI][cellJ].isMine &&
    !gBoard[cellI][cellJ].isMarked &&
    !gBoard[cellI][cellJ].isShown &&
    evKey === 1
  ) {
    gGame.shownCount++
    console.log('shownCount', gGame.shownCount)
    if (!gBoard[cellI][cellJ].isMine && !gBoard[cellI][cellJ].isMarked)
      gBoard[cellI][cellJ].isShown = true
  }
  if (value === 0 && gIsHint === false) {
    value = ''
  }
  elCell.classList.add('clicked')
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
