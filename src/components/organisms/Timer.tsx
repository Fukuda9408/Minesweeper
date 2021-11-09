import { useEffect } from "react";
import { useStopwatch } from "react-timer-hook";
import { useRecoilValue } from "recoil";
import { sizeState } from "../..";

type Props = {
  timerStart: boolean;
  end: boolean;
};

export const Timer = (props: Props) => {
  const { seconds, minutes, isRunning, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const size = useRecoilValue(sizeState)
  const { timerStart, end } = props;

  useEffect(() => {
    if (timerStart) {
      start()
    }
  }, [timerStart])

  useEffect(() => {
    if (end) {
      pause()
    }
  }, [end])

  useEffect(() => {
    reset(new Date(), false)
  }, [size])

  return (
    <div>
      {("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}
    </div>
  );
};
