import { useState } from "react";
import styled from "styled-components";
import { Button } from "./components/Button";

const HEIGHT = 10;
const WIDTH = 10;
const width: number[] = [...Array(WIDTH)].map((_, i) => i);
const height: number[] = [...Array(HEIGHT)].map((_, i) => i);

function App() {
  const [buttonPushed, setButtonPushed] = useState<boolean[][]>(createTwoDimensions());

  const clickButton: (h: number, w: number) => void = (h, w) => {
    let newClickButton: boolean[][] = []
    if (!buttonPushed[h][w]) {
      for (let height = 0; height < HEIGHT; height++) {
        newClickButton[height] = []
        for (let width = 0; width < WIDTH; width++) {
          if (height === h && width === w) {
            newClickButton[height][width] = true
          } else {
            newClickButton[height][width] = buttonPushed[height][width]
          }
        }
      }
      setButtonPushed(newClickButton)
    }
  }

  return (
    <div>
      {height.map((h) => (
        <tr>
          {width.map((w) => (
            <Std>
              <Button
                val="Num"
                pushed={buttonPushed[h][w]}
                onClick={() => clickButton(h, w)}
              ></Button>
            </Std>
          ))}
        </tr>
      ))}
    </div>
  );
}

export default App;

function createTwoDimensions(): boolean[][] {
  let arr: boolean[][] = [];
  for (let h = 0; h < HEIGHT; h++) {
    arr[h] = [];
    for (let w = 0; w < WIDTH; w++) {
      arr[h][w] = false;
    }
  }
  return arr;
}

const Std = styled.td`
  width: 50px;
  height: 50px;
`;
