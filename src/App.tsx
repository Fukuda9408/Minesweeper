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
  const [bombed, setBombed] = useState<boolean>(false);

  useEffect(() => {
    const bomb = createBomb(WIDTH, HEIGHT, 15);
    setAroundBomb(calculateAroudBomb(WIDTH, HEIGHT, bomb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickButton: (h: number, w: number) => void = (h, w) => {
    let newButtonPushedState: boolean[][] = []
    // Only the button not pushed
    if (!buttonPushedState[h][w]) {
      pushButton(h, w, HEIGHT, WIDTH, buttonPushedState, aroundBomb)
      for (let h = 0; h < HEIGHT; h++) {
        newButtonPushedState[h] = []
        for (let w = 0; w < WIDTH; w++) {
          newButtonPushedState[h][w] = buttonPushedState[h][w]
        }
      }
      setButtonPushedState(newButtonPushedState);
    }
      // After Click, whether bomb is exist in that clicked button
    if (aroundBomb[h][w] === -1) {
      setBombed(true);
      setTimeout(() => alert("Bann"), 100);
    }
  };

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
