export const getPlayerPosition = (id:number, cell_count_per_row: number) => {
    const rowIndex = Math.floor(id / cell_count_per_row)
    const columnIndex = Math.floor(id - rowIndex * cell_count_per_row)

    return{rowIndex, columnIndex}
  }


  