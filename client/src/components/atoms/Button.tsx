import styled from "styled-components";
import { BaseButton } from "./BaseButton";

type ColorButtonProps = {
  isOpened: boolean;
  isFlaged: boolean;
};

type Props = {
  isOpened: boolean;
  isFlaged: boolean;
  val: number;
  isFinished: boolean;
  onClick: () => void;
  onRightClick: () => void;
};

export const Button = (props: Props) => {
  const { val, isOpened, onClick, isFinished, isFlaged, onRightClick } = props;
  return (
    // todo: diplay bomb image
    <SColorButton
      isFlaged={isFlaged}
      disabled={isFinished}
      isOpened={isOpened}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      {isFlaged ? "F" : !isOpened ? "s" : val === -1 ? "●" : val}
    </SColorButton>
  );
};

const SColorButton = styled(BaseButton)`
  background-color: ${(props: ColorButtonProps) =>
    !props.isOpened ? "#207a9e" : "#eceff0"};
  color: ${(props: ColorButtonProps) =>
    props.isFlaged ? "#eceff0" : "#207a9e"};
`;
