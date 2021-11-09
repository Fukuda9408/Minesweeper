import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { sizeState } from ".";
import { Button } from "./components/atoms/Button";
import { Information } from "./components/organisms/Information";
import { Size } from "./components/organisms/Size";
import { Timer } from "./components/organisms/Timer";
import { useCreateSomeDimensions } from "./hooks/useCreateSomeDimenseions";
import { useOpenButton } from "./hooks/usePushButton";

function App() {
  const size = useRecoilValue(sizeState);
  const HEIGHT = size.height;
  const WIDTH = size.width;
  const BOMB_NUM = Math.floor(HEIGHT * WIDTH * 0.2);
  const width: number[] = [...Array(WIDTH)].map((_, i) => i);
  const height: number[] = [...Array(HEIGHT)].map((_, i) => i);

  const { createAllFalse, createBomb, createAllZero, calculateAroudBomb } =
    useCreateSomeDimensions();
  const { openButton } = useOpenButton();

  // After opening the button, `aroundBom` is changed.]
  // After that I have to use that chened value, so useRef, not useState
  const aroundBomb = useRef<number[][]>(createAllZero(WIDTH, HEIGHT + 100));
  const [isOpenedButton, setIsOpenedButton] = useState<boolean[][]>(
    createAllFalse(WIDTH, HEIGHT + 100)
  );
  const [isFlagedButton, setIsFlagedButton] = useState<boolean[][]>(
    createAllFalse(WIDTH, HEIGHT + 100)
  );
  const [flagNum, setFlagNum] = useState<number>(0);

  // In `clickButton`, oepnedButtonNum is changed.
  // After that, the chaned `openedButtonNum` has to be used
  // in ordet to determing that the game has been suceeded.
  const openedButtonNumRef = useRef(0);
  const [failed, setFailed] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [firstClick, setFirstClick] = useState<boolean>(true);

  // After changing the `size`, variables are initialized.
  useEffect(() => {
    setIsOpenedButton(createAllFalse(WIDTH, HEIGHT + 100));
    setIsFlagedButton(createAllFalse(WIDTH, HEIGHT + 100));
    setFlagNum(0);
    openedButtonNumRef.current = 0;
    setFailed(false);
    setSuccess(false)
    setFirstClick(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const countAroundFlag: (h: number, w: number) => number = (h, w) => {
    let res = 0
    for (let d = 0; d < directions.length; d++) {
      const d_w = w + directions[d][0];
      const d_h = h + directions[d][1];
      if (d_w >= 0 && d_w < WIDTH && d_h >= 0 && d_h < HEIGHT) {
        if (isFlagedButton[d_h][d_w]) {
          res += 1;
        }
      }
    }
    return res
  }

  const clickButton: (h: number, w: number) => void = (h, w) => {
    // After open a button, create bomb
    if (firstClick) {
      const bomb = createBomb(w, h, WIDTH, HEIGHT, BOMB_NUM);
      aroundBomb.current = calculateAroudBomb(WIDTH, HEIGHT, bomb);
      setFirstClick(false);
    }
    // Not Opend Button
    if (!isFlagedButton[h][w] && !isOpenedButton[h][w]) {
      openButton(
        h,
        w,
        isOpenedButton,
        aroundBomb.current,
        setFailed,
        isFlagedButton,
        false,
        openedButtonNumRef.current
      );
      setIsOpenedButton(copyDimension(isOpenedButton, HEIGHT, WIDTH));
    // Opend Button
    } else if (isOpenedButton[h][w]) {
      let aroundFlag = countAroundFlag(h, w)
      if (aroundFlag === aroundBomb.current[h][w]) {
        openButton(
          h,
          w,
          isOpenedButton,
          aroundBomb.current,
          setFailed,
          isFlagedButton,
          true,
          openedButtonNumRef.current
        );
        setIsOpenedButton(copyDimension(isOpenedButton, HEIGHT, WIDTH));
      }
    }

    if (openedButtonNumRef.current === WIDTH * HEIGHT - BOMB_NUM) {
      if (!failed) {
        setTimeout(() => {
          setFailed(true);
          alert("Success");
        }, 100);
      }
    }
  };

  const standFlag: (height: number, width: number) => void = (
    height,
    width
  ) => {
    if (!isOpenedButton[height][width]) {
      if (!isFlagedButton[height][width]) {
        setFlagNum((prevFlagNum) => prevFlagNum + 1);
      } else {
        setFlagNum((prevFlagNum) => prevFlagNum - 1);
      }
      const newIsRighButton: boolean[][] = [];
      for (let h = 0; h < HEIGHT; h++) {
        newIsRighButton[h] = [];
        for (let w = 0; w < WIDTH; w++) {
          if (height === h && width === w) {
            newIsRighButton[h][w] = !isFlagedButton[h][w];
          } else {
            newIsRighButton[h][w] = isFlagedButton[h][w];
          }
        }
      }
      setIsFlagedButton(newIsRighButton);
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
                    isOpened={isOpenedButton[h][w]}
                    onClick={() => clickButton(h, w)}
                    onRightClick={() => standFlag(h, w)}
                    isFlaged={isFlagedButton[h][w]}
                    isFinished={failed || success}
                  ></Button>
                </Std>
              );
            })}
          </tr>
        );
      })}
      <Information
        remainBomb={BOMB_NUM - flagNum}
        openedButtonNum={openedButtonNumRef.current}
      />
      <Timer timerStart={!firstClick} end={failed} />
    </div>
  );
}

export default App;

const Std = styled.td`
  width: 50px;
  height: 50px;
`;

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
