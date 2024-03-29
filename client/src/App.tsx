import { useRef, useState } from "react";
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
  console.log("Start Rendering")
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
  const aroundBomb = useRef<number[][]>(createAllZero(WIDTH, HEIGHT));
  const [isOpenedButton, setIsOpenedButton] = useState<boolean[][]>(
    createAllFalse(WIDTH, HEIGHT)
  );
  const [isFlagedButton, setIsFlagedButton] = useState<boolean[][]>(
    createAllFalse(WIDTH, HEIGHT)
  );
  const [flagNum, setFlagNum] = useState<number>(0);

  // In `clickButton`, oepnedButtonNum is changed.
  // After that, the chaned `openedButtonNum` has to be used
  // in ordet to determing that the game has been suceeded.
  const openedButtonNumRef = useRef(0);
  const failedRef = useRef<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false);
  const [firstClick, setFirstClick] = useState<boolean>(true);

  // After changing the `size`, variables are initialized.
  const reset: (width: number, height: number) => void = (width, height) => {
    console.log("reset")
    setIsOpenedButton(createAllFalse(width, height));
    setIsFlagedButton(createAllFalse(width, height));
    aroundBomb.current = createAllZero(width, height)
    setFlagNum(0);
    openedButtonNumRef.current = 0;
    failedRef.current = false
    setSuccess(false)
    setFirstClick(true);
    console.log(isOpenedButton)
  }

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
        failedRef,
        isFlagedButton,
        false,
        openedButtonNumRef
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
          failedRef,
          isFlagedButton,
          true,
          openedButtonNumRef
        );
        setIsOpenedButton(copyDimension(isOpenedButton, HEIGHT, WIDTH));
      }
    }

    // Failed decition
    if (failedRef.current) {
      setTimeout(() => {
        alert("Failed.....")
      }, 100)
    }

    // Success decision
    if (openedButtonNumRef.current === WIDTH * HEIGHT - BOMB_NUM) {
      if (!failedRef.current) {
        setSuccess(true)
        setTimeout(() => {
          alert("Success")
        }, 100)
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

  console.log("Before Rendering")
  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <Size reset={reset}/>
      {height.map((h) => {
        console.log("isOpnedButton", isOpenedButton)
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
                    isFinished={failedRef.current || success}
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
      <Timer timerStart={!firstClick} end={failedRef.current} />
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
  return dst;
};
