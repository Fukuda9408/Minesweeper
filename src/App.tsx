import { assert } from "console";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "./components/Button";
import { useCreateSomeDimensions } from "./hooks/useCreateSomeDimenseions";
import { usePushButton } from "./hooks/usePushButton";

const HEIGHT = 10;
const WIDTH = 10;
const width: number[] = [...Array(WIDTH)].map((_, i) => i);
const height: number[] = [...Array(HEIGHT)].map((_, i) => i);

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
  const [isRightButtonPushed, setIsRightButtonPushed] = useState<boolean[][]>(createAllFalse(WIDTH, HEIGHT))
  const [bombed, setBombed] = useState<boolean>(false);

  useEffect(() => {
    const bomb = createBomb(WIDTH, HEIGHT, 15);
    setAroundBomb(calculateAroudBomb(WIDTH, HEIGHT, bomb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickButton: (h: number, w: number) => void = (h, w) => {
    if (!isRightButtonPushed[h][w]) {
      let newButtonPushedState: boolean[][] = []
      // Only the button not pushed
      if (!buttonPushedState[h][w]) {
        pushButton(h, w, HEIGHT, WIDTH, buttonPushedState, aroundBomb, setBombed)
        for (let h = 0; h < HEIGHT; h++) {
          newButtonPushedState[h] = []
          for (let w = 0; w < WIDTH; w++) {
            newButtonPushedState[h][w] = buttonPushedState[h][w]
          }
        }
        setButtonPushedState(newButtonPushedState);
      }
    }
  };

  const clickRightButton: (height: number, width: number) => void = (height, width) => {
    if (!buttonPushedState[height][width]) {
      const newIsRighButtonPushed: boolean[][] = []
      for (let h = 0; h < HEIGHT; h++) {
        newIsRighButtonPushed[h] = []
        for (let w = 0; w < WIDTH; w++) {
          if (height === h && width === w) {
            newIsRighButtonPushed[h][w] = !isRightButtonPushed[h][w]
          } else {
            newIsRighButtonPushed[h][w] = isRightButtonPushed[h][w]
          }
        }
      }
      setIsRightButtonPushed(newIsRighButtonPushed)
    }
  }

  console.log(isRightButtonPushed)
  return (
    <div>
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
