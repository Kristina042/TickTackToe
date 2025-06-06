
export type board_cell = {
  id:  number,
  display: 'X'|'O'|'',
  isHighlighted: boolean,
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

  export const didRowWin = (currentIdx:number, buttonValue: 'X'|'O', cell_count_per_row: number, step_count:number, board:board_cell[][]) => {
    const {rowIndex, columnIndex} = getPlayerPosition(currentIdx, cell_count_per_row)

    const currRow = rowIndex
    const currColumn = columnIndex

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
    
    if (!winningIds.length)
      return []

    return winningIds
  }
  
  
  export const didColumnWin = (currentIdx: number, buttonValue: 'X'|'O', cell_count_per_row: number, step_count: number, board:board_cell[][]) => {
    const {rowIndex, columnIndex} = getPlayerPosition(currentIdx, cell_count_per_row)

    const currRow = rowIndex
    const currColumn = columnIndex

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

    // wrong variable castin
    const winningIds = checkIdsForWin(idsToCheck, buttonValue, cell_count_per_row, step_count, board)
    
    if (winningIds.length === 0)
      return []

    return winningIds
  }

  type diagInfo = {
    currentIdx: number,
    value: 'X' | 'O',
    direction: 'bottomLeft->rightUp'|'leftUp->bottomRight',
    cell_count_per_row: number,
    step_count: number,
    board:board_cell[][]
  }

  export const didDiagWin = ({currentIdx, value, direction, cell_count_per_row, step_count, board}: diagInfo) => {
    const {rowIndex, columnIndex} = getPlayerPosition(currentIdx, cell_count_per_row)
    const currRow = rowIndex
    const currColumn = columnIndex

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

  export const checkWinner = (id:number, cell_count_per_row: number, step_count: number, board:board_cell[][]) => {

    let winningIds:number[] = []


    // const input = {id: 1, sign: 'X', cell_count_per_row, step_count, board}

    // const row = [didRowWin, didRowWin]
    // const col = [didColumnWin, didColumnWin]
    // const diag = [didDiagWin, didDiagWin, didDiagWin, didDiagWin]

    // const xd: ('X' | 'O')[] = ['X', 'O']


    // xd.map((sign) => {
    //   const row = didRowWin(id, sign, cell_count_per_row, step_count, board)
    //   const column = didColumnWin(id, sign, cell_count_per_row, step_count, board)

    //   if (row.length) return row
    //   if (column.length) return column
    // })


    // const result = {
    //   winner: 'X',
    //   winningIds: [1,2,3]
    // }

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

    winningIds = didDiagWin({currentIdx: id, value: 'X', direction: 'bottomLeft->rightUp', cell_count_per_row, step_count, board})

    if (winningIds.length > 0)
      return {winner:'X', winningIds: winningIds} 

    winningIds = didDiagWin({currentIdx: id, value: 'X', direction: 'leftUp->bottomRight', cell_count_per_row, step_count, board})

    if (winningIds.length > 0)
      return {winner:'X', winningIds: winningIds} 

    winningIds = didDiagWin({currentIdx:id, value:'O', direction: 'bottomLeft->rightUp', cell_count_per_row, step_count, board})

    if (winningIds.length > 0)
      return {winner:'O', winningIds: winningIds} 

    winningIds = didDiagWin({currentIdx: id, value: 'O', direction: 'leftUp->bottomRight', cell_count_per_row, step_count, board})

    if (winningIds.length > 0)
      return {winner:'O', winningIds: winningIds} 

    return{winner:'', winningIds: []}
  }