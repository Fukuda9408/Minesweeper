const directions = [
  // w, h
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]
export const usePushButton = () => {
  const pushButton: (h: number, w: number, height: number, width: number, buttonPushedState: boolean[][], bombCount: number[][], setBomb: React.Dispatch<React.SetStateAction<boolean>>) => void = (h, w, height, width, buttonPushedState, bombCount, setBomb) => {
    if (!buttonPushedState[h][w]) {
      buttonPushedState[h][w] = true
      // bomb
      if (bombCount[h][w] === -1) {
        setTimeout(() => {
          setBomb(true)
          alert("Baaa")
        }, 100)
        return
      // can push around
      } else if (bombCount[h][w] === 0) {
        for (let d = 0; d < directions.length; d++) {
          const d_w = w + directions[d][0]
          const d_h = h + directions[d][1]
          if (d_w >= 0 && d_w < width && d_h >= 0 && d_h < height) {
            pushButton(d_h, d_w, width, height, buttonPushedState, bombCount, setBomb)
          }
        }
      }
    }
  }
  return {pushButton}
}
