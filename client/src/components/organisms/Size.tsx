import { ChangeEvent, useState } from "react"
import { useRecoilState } from "recoil"
import { sizeState } from "../.."

export const Size = () => {
  const [size, setSize] = useRecoilState(sizeState)
  const defaultHeight = size.height
  const defaultWidth = size.width
  const [height, setHeight] = useState<number>(defaultHeight)
  const [width, setWidth] = useState<number>(defaultWidth)

  const changeHeight = (e: ChangeEvent<HTMLInputElement>) => {
    setHeight(parseInt(e.target.value))
  }
  const changeWidth = (e: ChangeEvent<HTMLInputElement>) => {
    setWidth(parseInt(e.target.value))
  }
  const changeSize = () => {
    setSize({...size, height: height, width: width})
  }
  return(
    <div>
      縦: <input type="number" value={height} onChange={changeHeight}></input>
      横: <input type="number" value={width} onChange={changeWidth}></input>
      <button onClick={changeSize}>反映</button>
    </div>
  )
}
