
export type board_cell = {
  id:  number,
  display: 'X'|'O'|'',
  isHighlighted: boolean,
}

type checkWinnerInfo = {
  currentIdx: number,
  value: 'X' | 'O',
  cell_count_per_row: number,
  step_count: number,
  board:board_cell[][]
}


export const getPlayerPosition = (id:number, cell_count_per_row: number) => {
    const rowIndex = Math.floor(id / cell_count_per_row)
    const columnIndex = Math.floor(id - rowIndex * cell_count_per_row)

    return { rowIndex, columnIndex }
}

export const create_board = (board_width: number, board_height: number): board_cell[][] =>
  Array.from({ length: board_height }, (_, row) =>
    Array.from({ length: board_width }, (_, col) => ({
      id: row * board_width + col,
      display: '',
      isHighlighted: false
    }))
  );

export const checkIdsForWin = (idArr: number[], buttonValue: 'X'|'O', cell_count_per_row: number, step_count:number, board:board_cell[][]) => {
    const isArrayTooLong = idArr.length < step_count
    if (isArrayTooLong)
      return []

    idArr.sort((a, b) => a - b)

    const result: boolean[] = new Array(idArr.length).fill(false)
    const winningIds: number[] = []

    const checkIdArray = () => {
      idArr.forEach((id, index) => {

        const {rowIndex, columnIndex} = getPlayerPosition(id, cell_count_per_row)

        if (board[rowIndex][columnIndex].display !== buttonValue){
          result[index] = false
          return
        }
        result[index] = true
        winningIds.push(id)
      })
    }

     const isWinner = () => {
      let count = 0

      for (let i = 0; i < result.length; i++){
        if (result[i] !== true){ 
          count = 0
          continue
        }
        
        count++
        if (count === (step_count))  return true
      }

      return false
    }

    checkIdArray()

    if (isWinner() !== true) return []
    
    return winningIds
  }

  export const didRowWin = ({currentIdx, value, cell_count_per_row, step_count, board}: checkWinnerInfo) => {
    const {rowIndex, columnIndex} = getPlayerPosition(currentIdx, cell_count_per_row)

    const currRow = rowIndex
    const currColumn = columnIndex

    if (board[currRow][currColumn].display !==  value)
      return []

    const idsToCheck: number[] = []
    idsToCheck.push(currentIdx)

    const checkCellsRight = () => {
      let column = currColumn
      let id = currentIdx

      for(let i = 0; i < (step_count - 1); i++){
        column++; id++;

        if (column <= (cell_count_per_row - 1))
          idsToCheck.push(id)
      }
    }

    const checkCellsLeft = () => {
      let column = currColumn
      let id = currentIdx
      
      for (let i = 0; i < (step_count - 1); i++){
        column--; id--;

        if (column >= 0)
          idsToCheck.push(id)
      }
    }

    checkCellsRight()
    checkCellsLeft()
    
    const winningIds = checkIdsForWin(idsToCheck, value, cell_count_per_row, step_count, board)
    
    if (!winningIds.length)
      return []

    return winningIds
  }
  
  
  export const didColumnWin = ({currentIdx, value, cell_count_per_row, step_count, board}: checkWinnerInfo) => {
    const {rowIndex, columnIndex} = getPlayerPosition(currentIdx, cell_count_per_row)

    const currRow = rowIndex
    const currColumn = columnIndex

    if (board[currRow][currColumn].display !==  value)
      return []

    const idsToCheck: number[] = []
    idsToCheck.push(currentIdx)

    const checkCellsUp = () => {
      let row = currRow
      let id = currentIdx

      for (let i = 0; i < (step_count - 1); i++){
        row--
        id = id - cell_count_per_row

        if (row >= 0)
          idsToCheck.push(id)
      }
    }

    const checkCellsDown = () =>{
      let row = currRow
      let id = currentIdx

      for (let i = 0; i < (step_count - 1); i++){
        row++
        id = id + cell_count_per_row

        if (row <= (cell_count_per_row - 1))
          idsToCheck.push(id)
      }
    }

    checkCellsUp()
    checkCellsDown()

    // CR whats wrong here?
    // answear here ->probably the name checkIdsForWin doesnt correspond very well to the functions return value which is an array of winning ids
    //maybe it should be like const winningIs = getWinningIds(bla bla)
    const winningIds = checkIdsForWin(idsToCheck, value, cell_count_per_row, step_count, board)
    
    if (winningIds.length === 0)
      return []

    return winningIds
  }

  export const didDiagWin = ({currentIdx, value, cell_count_per_row, step_count, board}: checkWinnerInfo) => {
    const {rowIndex, columnIndex} = getPlayerPosition(currentIdx, cell_count_per_row)
    const currRow = rowIndex
    const currColumn = columnIndex
    let direction = 'bottomLeft->rightUp'

    if (board[currRow][currColumn].display !== value)
      return []

    const idMatrix: number[][] = board.map((row) => row.map((cell:board_cell) => cell.id))

    let idsToCheck: number[] = []

    idsToCheck.push(currentIdx)

    const checkCellsUp = () => {
      let row = currRow
      let column  = currColumn
        for (let i = 0; i < (step_count - 1); i++){

          if (direction === 'bottomLeft->rightUp') { 
            row--; column++

            if ((row >= 0) && (column <= (cell_count_per_row - 1)))
              idsToCheck.push(idMatrix[row][column])
          }
          else{
            row --; column --

            if ((row >= 0) && (column >= 0))
              idsToCheck.push(idMatrix[row][column])
          }
        }
      }
    
    const checkCellsDown = () => {
     let row = currRow
     let column = currColumn
      for (let i = 0; i < (step_count - 1); i++){

        if (direction === 'bottomLeft->rightUp'){
          row++; column--

          if ((row <= (cell_count_per_row - 1)) && (column >= 0))
            idsToCheck.push(idMatrix[row][column])
        }
        else{
          row++; column++

          if ((row <= (cell_count_per_row - 1)) && (column<= (cell_count_per_row - 1)))
          idsToCheck.push(idMatrix[row][column])
        }
      }
    }
  
    checkCellsUp()
    checkCellsDown()

   let WinningIds = checkIdsForWin(idsToCheck, value, cell_count_per_row, step_count, board)
  
   //check for a win in the 2d direction if the 1st won is non-winning
   if (WinningIds.length === 0)
   {
      direction = "leftUp->bottomRight"
      idsToCheck = []
      idsToCheck.push(currentIdx)

      checkCellsUp()
      checkCellsDown()

      WinningIds = checkIdsForWin(idsToCheck, value, cell_count_per_row, step_count, board)

      if (WinningIds.length === 0)
      return []
   }

   return WinningIds
  }

  export type result = {
    winner: 'X' | 'O' | ''
    winningIds: number[]
  }

  export const checkWinner = (id:number, cell_count_per_row: number, step_count: number, board:board_cell[][]) => {

    let winningIds:number[] = []
    const players: any[] = ['X', 'O']
    const winChecks = [didRowWin, didColumnWin, didDiagWin]

    // CR make it in loop, reach Damian if u dont know how
    //i wanted to use foreach but when you return from inside forEach i think it returns from inner function and i want to return form outer function checkwinner 
    for (let i = 0; i < players.length; i++){
      let info:checkWinnerInfo = {
        currentIdx: id,
        value: players[i],
        cell_count_per_row: cell_count_per_row,
        step_count: step_count,
        board:board
      }

      for (let j = 0; j < winChecks.length; j++){
        winningIds = winChecks[j](info)
        if (winningIds.length > 0)  return {winner: players[i], winningIds: winningIds}
      }
    }

    return{winner:'', winningIds: []}
  }