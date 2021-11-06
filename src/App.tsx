import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "./components/Button";
import { useCreateSomeDimensions } from "./hooks/useCreateSomeDimenseions";
import { usePushButton } from "./hooks/usePushButton";

const HEIGHT = 10;
const WIDTH = 10;
const width: number[] = [...Array(WIDTH)].map((_, i) => i);
const height: number[] = [...Array(HEIGHT)].map((_, i) => i);
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
];
function App() {
  const { createAllFalse, createBomb, createAllZero, calculateAroudBomb } =
    useCreateSomeDimensions();
  const { pushButton } = usePushButton();
  const [aroundBomb, setAroundBomb] = useState<number[][]>(
    createAllZero(WIDTH, HEIGHT)
  );
  const [buttonPushedState, setButtonPushedState] = useState<boolean[][]>(
    createAllFalse(WIDTH, HEIGHT)
  );
  const [isRightButtonPushed, setIsRightButtonPushed] = useState<boolean[][]>(
    createAllFalse(WIDTH, HEIGHT)
  );
  const [bombed, setBombed] = useState<boolean>(false);

  useEffect(() => {
    const bomb = createBomb(WIDTH, HEIGHT, 15);
    setAroundBomb(calculateAroudBomb(WIDTH, HEIGHT, bomb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickButton: (h: number, w: number) => void = (h, w) => {
    // Push Not Opend Button
    if (!isRightButtonPushed[h][w] && !buttonPushedState[h][w]) {
      pushButton(
        h,
        w,
        HEIGHT,
        WIDTH,
        buttonPushedState,
        aroundBomb,
        setBombed,
        isRightButtonPushed,
        false
      );
      setButtonPushedState(copyDimension(buttonPushedState, HEIGHT, WIDTH));
      // Push opend Button
    } else if (buttonPushedState[h][w]) {
      let aroundFlag = 0;
      for (let d = 0; d < directions.length; d++) {
        const d_w = w + directions[d][0];
        const d_h = h + directions[d][1];
        if (d_w >= 0 && d_w < WIDTH && d_h >= 0 && d_h < HEIGHT) {
          if (isRightButtonPushed[d_h][d_w]) {
            aroundFlag += 1;
          }
        }
      }
      if (aroundFlag === aroundBomb[h][w]) {
        pushButton(
          h,
          w,
          HEIGHT,
          WIDTH,
          buttonPushedState,
          aroundBomb,
          setBombed,
          isRightButtonPushed,
          true
        );
        setButtonPushedState(copyDimension(buttonPushedState, HEIGHT, WIDTH));
      }
    }
  };

  const clickRightButton: (height: number, width: number) => void = (
    height,
    width
  ) => {
    if (!buttonPushedState[height][width]) {
      const newIsRighButtonPushed: boolean[][] = [];
      for (let h = 0; h < HEIGHT; h++) {
        newIsRighButtonPushed[h] = [];
        for (let w = 0; w < WIDTH; w++) {
          if (height === h && width === w) {
            newIsRighButtonPushed[h][w] = !isRightButtonPushed[h][w];
          } else {
            newIsRighButtonPushed[h][w] = isRightButtonPushed[h][w];
          }
        }
      }
      setIsRightButtonPushed(newIsRighButtonPushed);
    }
  };

  return (
    <div onContextMenu={(e)=> e.preventDefault()}>
      {height.map((h) => (
        <tr>
          {width.map((w) => (
            <Std>
              <Button
                val={aroundBomb[h][w]}
                pushed={buttonPushedState[h][w]}
                onClick={() => clickButton(h, w)}
                onRightClick={() => clickRightButton(h, w)}
                rightPushed={isRightButtonPushed[h][w]}
                bombed={bombed}
              ></Button>
            </Std>
          ))}
        </tr>
      ))}
    </div>
  );
}

export default App;

const Std = styled.td`
  width: 50px;
  height: 50px;
`;

const copyDimension: (
  src: boolean[][],
  height: number,
  width: number
) => boolean[][] = (src, height, width) => {
  let dst: boolean[][] = [];
  for (let h = 0; h < height; h++) {
    dst[h] = [];
    for (let w = 0; w < width; w++) {
      dst[h][w] = src[h][w];
    }
  }
  return dst;
};
