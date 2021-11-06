import styled from "styled-components"
import { BaseButton } from "./BaseButton"

type ColorButtonProps = {
  pushed: boolean
}

type Props = {
  pushed: boolean
  val: number
  bombed: boolean
  onClick: () => void
}

export const Button = (props: Props) => {
  const {val, pushed, onClick, bombed} = props
  return(
    // todo: diplay bomb image
    <SColorButton disabled={bombed} pushed={pushed} onClick={onClick}>{!pushed ? "s" : val === -1 ? "●" : val}</SColorButton>
  )
}

const SColorButton = styled(BaseButton)`
  background-color: ${(props: ColorButtonProps) =>!props.pushed ? "#207a9e" : "#eceff0"}
`
