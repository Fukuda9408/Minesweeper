import { useRecoilValue } from "recoil";
import { sizeState } from "..";

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
export const useOpenButton = () => {
  const size = useRecoilValue(sizeState);
  const openButton: (
    h: number,
    w: number,
    isOpenedButton: boolean[][],
    aroundBomb: number[][],
    setFailed: React.Dispatch<React.SetStateAction<boolean>>,
    isFlagedButton: boolean[][],
    isAlreadyOpened: boolean,
    openedButtonNum: number
  ) => void = (
    h,
    w,
    isOpenedButton,
    aroundBomb,
    setFailed,
    isFlagedButton,
    isAlreadyOpened,
    opendButtonNum
  ) => {
    if ((!isOpenedButton[h][w] && !isFlagedButton[h][w]) || isAlreadyOpened) {
      isOpenedButton[h][w] = true;
      if (!isAlreadyOpened) opendButtonNum += 1;
      if (aroundBomb[h][w] === -1) {
        setFailed(true)
        // can push around
      } else if (aroundBomb[h][w] === 0 || isAlreadyOpened) {
        for (let d = 0; d < directions.length; d++) {
          const d_w = w + directions[d][0];
          const d_h = h + directions[d][1];
          if (d_w >= 0 && d_w < size.width && d_h >= 0 && d_h < size.height) {
            openButton(
              d_h,
              d_w,
              isOpenedButton,
              aroundBomb,
              setFailed,
              isFlagedButton,
              false,
              opendButtonNum
            );
          }
        }
      }
    }
  };
  return { openButton };
};
