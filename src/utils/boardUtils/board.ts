
export type board_cell = {
  id:  number,
  display: 'X'|'O'|'',
  isHighlighted: boolean,
}
export const getPlayerPosition = (id:number, cell_count_per_row: number) => {
    const rowIndex = Math.floor(id / cell_count_per_row)
    const columnIndex = Math.floor(id - rowIndex * cell_count_per_row)

    return{rowIndex, columnIndex}
  }

// TODO: make it more clean, try to use new Array(new Array)
  export const create_board = (board_width: number, board_heigth: number) => {
    const board = new Array
    let count = 0

    for (let i = 0; i < board_heigth; i++){
      const row = new Array

      for (let j = 0; j < board_width; j++){

        const cell: board_cell = {id: (j + count*board_width), display: '', isHighlighted: false}

        row.push(cell)
      }
      count++

      board.push(row)
    }
    return board
  }

export const checkIdsForWin = (idArr: number[], buttonValue: 'X'|'O', cell_count_per_row: number, step_count:number, board:board_cell[][]) => {
    //check that ids to check lengh is at least STEP count
    if (idArr.length < step_count)
      return []

    idArr.sort((a, b) => a - b)

    console.log(`sorted ids to check: ${idArr}`)

    const result: boolean[] = new Array(idArr.length).fill(false)
    let result_index = 0

    //will be used in case of a win
    const winningIds: number[] = new Array()

    const checkIdArray = () => {
      idArr.forEach((id) => {
        let row = getPlayerPosition(id, cell_count_per_row).rowIndex
        let column = getPlayerPosition(id, cell_count_per_row).columnIndex

        if (board[row][column].display !== buttonValue){
          result[result_index] = false
          result_index++
          return
        }

        result[result_index] = true
        result_index++

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

    console.log(`bool of sorted ids: ${result}`)
    console.log('--------------------------------------------------------------------')

    if (isWinner() !== true)
      return []
    
    return winningIds
  }

  export const didRowWin = (currentIdx:number, buttonValue: 'X'|'O', cell_count_per_row: number, step_count:number, board:board_cell[][]) => {
    const player = getPlayerPosition(currentIdx, cell_count_per_row)

    const currRow = player.rowIndex
    const currColumn = player.columnIndex

    if (board[currRow][currColumn].display !==  buttonValue)
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
    
    const winningIds = checkIdsForWin(idsToCheck, buttonValue, cell_count_per_row, step_count, board)
    
    if (winningIds.length === 0)
      return []

    return winningIds
  }
  
  
  export const didColumnWin = (currentIdx: number, buttonValue: 'X'|'O', cell_count_per_row: number, step_count: number, board:board_cell[][]) => {
    const player = getPlayerPosition(currentIdx, cell_count_per_row)

    const currRow = player.rowIndex
    const currColumn = player.columnIndex

    if (board[currRow][currColumn].display !==  buttonValue)
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

    const WinningIds = checkIdsForWin(idsToCheck, buttonValue, cell_count_per_row, step_count, board)
    
    if (WinningIds.length === 0)
      return []

    return WinningIds
  }

  export const didDiagWin = (
    currentIdx: number,
    value: 'X' | 'O',
    direction: 'bottomLeft->rightUp'|'leftUp->bottomRight',
    cell_count_per_row: number,
    step_count: number,
    board:board_cell[][]
  ) => {

    const currRow = getPlayerPosition(currentIdx, cell_count_per_row).rowIndex
    const currColumn = getPlayerPosition(currentIdx, cell_count_per_row).columnIndex

    if (board[currRow][currColumn].display !== value)
      return []

    const idMatrix: number[][] = board.map((row) => row.map((cell:board_cell) => cell.id))

    const idsToCheck: number[] = []

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

        // TODO here also too much nesting
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

   const WinningIds = checkIdsForWin(idsToCheck, value, cell_count_per_row, step_count, board)
  
   if (WinningIds.length === 0)
    return []

   return WinningIds
  }

  export type result = {
    winner: 'X' | 'O' | ''
    winningIds: number[]
  }

  //should return object :
  //win or no win
  //who won
  //tie or no tie
  export const checkWinner = (id:number, cell_count_per_row: number, step_count: number, board:board_cell[][]) => {

    let winningIds = new Array()

    winningIds = didRowWin(id,'X' ,cell_count_per_row, step_count, board)

    if (winningIds.length > 0)
      return {winner:'X', winningIds: winningIds}

    winningIds = didRowWin(id,'O' ,cell_count_per_row, step_count, board)

    if (winningIds.length > 0)
      return {winner:'O', winningIds: winningIds}

    winningIds = didColumnWin(id,'X' ,cell_count_per_row, step_count, board)

    if (winningIds.length > 0)
      return {winner:'X', winningIds: winningIds} 
    
    winningIds = didColumnWin(id,'O' ,cell_count_per_row, step_count, board)

    if (winningIds.length > 0)
      return {winner:'O', winningIds: winningIds} 

    winningIds = didDiagWin(id, 'X', 'bottomLeft->rightUp', cell_count_per_row, step_count, board)

    if (winningIds.length > 0)
      return {winner:'X', winningIds: winningIds} 

    winningIds = didDiagWin(id, 'X', 'leftUp->bottomRight', cell_count_per_row, step_count, board)

    if (winningIds.length > 0)
      return {winner:'X', winningIds: winningIds} 

    winningIds = didDiagWin(id, 'O', 'bottomLeft->rightUp', cell_count_per_row, step_count, board)

    if (winningIds.length > 0)
      return {winner:'O', winningIds: winningIds} 

    winningIds = didDiagWin(id, 'O', 'leftUp->bottomRight', cell_count_per_row, step_count, board)

    if (winningIds.length > 0)
      return {winner:'O', winningIds: winningIds} 

    return{winner:'', winningIds: []}
  }