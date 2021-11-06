import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "./components/Button";
import { useCreateSomeDimensions } from "./hooks/useCreateSomeDimenseions";

const HEIGHT = 10;
const WIDTH = 10;
const width: number[] = [...Array(WIDTH)].map((_, i) => i);
const height: number[] = [...Array(HEIGHT)].map((_, i) => i);

function App() {
  const { createAllFalse, createBomb, createAllZero, calculateAroudBomb } =
    useCreateSomeDimensions();
  const [aroundBomb, setAroundBomb] = useState<number[][]>(
    createAllZero(WIDTH, HEIGHT)
  );
  const [buttonPushed, setButtonPushed] = useState<boolean[][]>(
    createAllFalse(WIDTH, HEIGHT)
  );
  const [bombed, setBombed] = useState<boolean>(false);

  useEffect(() => {
    const bomb = createBomb(WIDTH, HEIGHT, 10);
    setAroundBomb(calculateAroudBomb(WIDTH, HEIGHT, bomb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickButton: (h: number, w: number) => void = (h, w) => {
    let newClickButton: boolean[][] = [];

    // Only the button not pushed
    if (!buttonPushed[h][w]) {
      for (let height = 0; height < HEIGHT; height++) {
        newClickButton[height] = [];
        for (let width = 0; width < WIDTH; width++) {
          if (height === h && width === w) {
            newClickButton[height][width] = true;
          } else {
            newClickButton[height][width] = buttonPushed[height][width];
          }
        }
      }
      setButtonPushed(newClickButton);
      // After Click, whether bomb is exist in that clicked button
      if (aroundBomb[h][w] === -1) {
        setBombed(true)
        alert("Baaan");
      }
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
                pushed={buttonPushed[h][w]}
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
