import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { sizeState } from ".";
import { Button } from "./components/Button";
import { Size } from "./components/Size";
import { useCreateSomeDimensions } from "./hooks/useCreateSomeDimenseions";
import { usePushButton } from "./hooks/usePushButton";

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
  const size = useRecoilValue(sizeState);
  const HEIGHT = size.height;
  const WIDTH = size.width;
  const BOMB_NUM = Math.floor(HEIGHT * WIDTH * 0.20);
  const width: number[] = [...Array(WIDTH)].map((_, i) => i);
  const height: number[] = [...Array(HEIGHT)].map((_, i) => i);

  const { createAllFalse, createBomb, createAllZero, calculateAroudBomb } =
    useCreateSomeDimensions();
  const { pushButton } = usePushButton();
  const aroundBomb = useRef<number[][]>(createAllZero(WIDTH, HEIGHT + 100));
  const [buttonPushedState, setButtonPushedState] = useState<boolean[][]>(
    createAllFalse(WIDTH, HEIGHT + 100)
  );
  const [isRightButtonPushed, setIsRightButtonPushed] = useState<boolean[][]>(
    createAllFalse(WIDTH, HEIGHT + 100)
  );
  const [flagNum, setFlagNum] = useState<number>(0);
  const openedButtonNumRef = useRef(0);
  const [bombed, setBombed] = useState<boolean>(false);
  const [firstClick, setFirstClick] = useState<boolean>(true);

  useEffect(() => {
    setButtonPushedState(createAllFalse(WIDTH, HEIGHT + 100));
    setIsRightButtonPushed(createAllFalse(WIDTH, HEIGHT + 100));
    setFlagNum(0);
    openedButtonNumRef.current = 0;
    setBombed(false);
    setFirstClick(true);
  }, [size]);

  const clickButton: (h: number, w: number) => void = (h, w) => {
    if (firstClick) {
      const bomb = createBomb(w, h, WIDTH, HEIGHT, BOMB_NUM);
      aroundBomb.current = calculateAroudBomb(WIDTH, HEIGHT, bomb);
      setFirstClick(false);
    }
    // Push Not Opend Button
    if (!isRightButtonPushed[h][w] && !buttonPushedState[h][w]) {
      pushButton(
        h,
        w,
        HEIGHT,
        WIDTH,
        buttonPushedState,
        aroundBomb.current,
        setBombed,
        isRightButtonPushed,
        false,
        openedButtonNumRef
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
      if (aroundFlag === aroundBomb.current[h][w]) {
        pushButton(
          h,
          w,
          HEIGHT,
          WIDTH,
          buttonPushedState,
          aroundBomb.current,
          setBombed,
          isRightButtonPushed,
          true,
          openedButtonNumRef
        );
        setButtonPushedState(copyDimension(buttonPushedState, HEIGHT, WIDTH));
      }
    }

    if (openedButtonNumRef.current === WIDTH * HEIGHT - BOMB_NUM) {
      if (!bombed) {
        setTimeout(() => {
          setBombed(true);
          alert("Success");
        }, 100);
      }
    }
  };

  const clickRightButton: (height: number, width: number) => void = (
    height,
    width
  ) => {
    if (!buttonPushedState[height][width]) {
      if (!isRightButtonPushed[height][width]) {
        setFlagNum((prevFlagNum) => prevFlagNum + 1);
      } else {
        setFlagNum((prevFlagNum) => prevFlagNum - 1);
      }
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
    <div onContextMenu={(e) => e.preventDefault()}>
      <Size />
      {height.map((h) => {
        return (
          <tr key={h}>
            {width.map((w) => {
              return (
                <Std>
                  <Button
                    val={aroundBomb.current[h][w]}
                    pushed={buttonPushedState[h][w]}
                    onClick={() => clickButton(h, w)}
                    onRightClick={() => clickRightButton(h, w)}
                    rightPushed={isRightButtonPushed[h][w]}
                    bombed={bombed}
                  ></Button>
                </Std>
              );
            })}
          </tr>
        );
      })}
      残りの爆弾数: {BOMB_NUM - flagNum}
      <br />
      開けた数: {openedButtonNumRef.current}
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
  for (let h = height; h < height + 100; h++) {
    dst[h] = [];
  }
  return dst;
};
