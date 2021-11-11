import { useEffect } from "react";
import { useStopwatch } from "react-timer-hook";
import { useRecoilValue } from "recoil";
import { sizeState } from "../..";

type Props = {
  timerStart: boolean;
  end: boolean;
};

export const Timer = (props: Props) => {
  const { seconds, minutes, start, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const size = useRecoilValue(sizeState)
  const { timerStart, end } = props;

  useEffect(() => {
    if (timerStart) {
      start()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerStart])

  useEffect(() => {
    if (end) {
      pause()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end])

  useEffect(() => {
    reset(new Date(), false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size])

  return (
    <div>
      {("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}
    </div>
  );
};
