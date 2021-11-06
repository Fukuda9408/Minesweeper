import styled from "styled-components"
import { BaseButton } from "./BaseButton"

type ColorButtonProps = {
  pushed: boolean
}

type Props = {
  pushed: boolean
  val: string
  onClick: () => void
}

export const Button = (props: Props) => {
  const {val, pushed, onClick} = props
  return(
    <SColorButton pushed={pushed} onClick={onClick}>{!pushed ? "s" : val}</SColorButton>
  )
}

const SColorButton = styled(BaseButton)`
  background-color: ${(props: ColorButtonProps) =>!props.pushed ? "#207a9e" : "#eceff0"}
`
