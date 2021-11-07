import React from "react";
import ReactDOM from "react-dom";
import { atom, RecoilRoot } from "recoil";
import App from "./App";

type sizeType = {
  height: number;
  width: number;
};

export const sizeState = atom<sizeType>({
  key: "sizeState",
  default: {
    height: 2,
    width: 2,
  },
});

ReactDOM.render(
  <RecoilRoot>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </RecoilRoot>,
  document.getElementById("root")
);
