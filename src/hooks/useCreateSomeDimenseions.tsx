export const useCreateSomeDimensions = () => {
  const createAllFalse: (width: number, height: number) => boolean[][] = (
    width,
    height
  ) => {
    let arr: boolean[][] = [];
    for (let h = 0; h < height; h++) {
      arr[h] = [];
      for (let w = 0; w < width; w++) {
        arr[h][w] = false;
      }
    }
    return arr;
  };

  const createAllZero: (width: number, height: number) => number[][] = (
    width,
    height
  ) => {
    let arr: number[][] = [];
    for (let h = 0; h < height; h++) {
      arr[h] = [];
      for (let w = 0; w < width; w++) {
        arr[h][w] = 0;
      }
    }
    return arr;
  };
  const createBomb: (width: number, height: number, baombCount: number) => boolean[][] = (
    width,
    height,
    bombCount
  ) => {
    let bomb: boolean[][] = [];
    for (let h = 0; h < height; h++) {
      bomb[h] = [];
      for (let w = 0; w < width; w++) {
        bomb[h][w] = false;
      }
    }

    let count = bombCount
    while (count > 0) {
      // create 0 ~ height - 1
      const h_random = Math.floor(Math.random() * height)
      // create 0 ~ width - 1
      const w_random = Math.floor(Math.random() * width)

      if (!bomb[h_random][w_random]) {
        bomb[h_random][w_random] = true
        count -= 1
      }
    }

    return bomb;
  }

  // Count of the place that bomb is in is set to -1
  const calculateAroudBomb: (width: number, height: number, bomb: boolean[][]) => number[][] = (width, height, bomb) => {
    const bombCount = createAllZero(width, height)
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
    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        if (bomb[h][w]) {
          bombCount[h][w] = -1
          continue
        }
        for (let d = 0; d < 8; d++) {
          const d_w = w + directions[d][0]
          const d_h = h + directions[d][1]
          if (d_w >= 0 && d_w < width && d_h >= 0 && d_h < height) {
            if (bomb[d_h][d_w]) {
              bombCount[h][w] += 1
            }
          }
        }
      }
    }
    return bombCount
  }

  return {createAllFalse, createBomb, createAllZero, calculateAroudBomb};

};
