import styled from "styled-components";
import { BaseButton } from "./BaseButton";

type ColorButtonProps = {
  pushed: boolean;
  rightPushed: boolean;
};

type Props = {
  pushed: boolean;
  rightPushed: boolean;
  val: number;
  bombed: boolean;
  onClick: () => void;
  onRightClick: () => void;
};

export const Button = (props: Props) => {
  const { val, pushed, onClick, bombed, rightPushed, onRightClick } = props;
  return (
    // todo: diplay bomb image
    <SColorButton
      rightPushed={rightPushed}
      disabled={bombed}
      pushed={pushed}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      {rightPushed ? "F" : !pushed ? "s" : val === -1 ? "●" : val}
    </SColorButton>
  );
};

const SColorButton = styled(BaseButton)`
  background-color: ${(props: ColorButtonProps) =>
    !props.pushed ? "#207a9e" : "#eceff0"};
  color: ${(props: ColorButtonProps) =>
    props.rightPushed ? "#eceff0" : "#207a9e"};
`;
