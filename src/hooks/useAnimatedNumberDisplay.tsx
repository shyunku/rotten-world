import { useEffect, useMemo, useRef, useState } from "react";

interface AnimatedNumberDisplayProps {
  value: number;
  asr?: number;
  useInt?: boolean;
  tolerance?: number;
  t: number;
}

/**
 * @param {Number} value - target value
 * @param {Number} asr - animation speed ratio
 */
const useAnimatedNumberDisplay = ({
  value,
  asr = 0.99,
  useInt = false,
  tolerance = 0.000001,
  t,
}: AnimatedNumberDisplayProps) => {
  const [current, setCurrent] = useState(value);
  const curTolerance = useMemo(() => {
    return useInt ? 1 : tolerance;
  }, [useInt, tolerance]);
  const [fixed, setFixed] = useState(false);

  const retVal = useMemo(() => {
    return useInt ? Math.floor(current) : current;
  }, [current, useInt]);

  const animate = () => {
    const nextValue = (value - current) * (1 - (1 - asr) ** t) + current;
    // console.log({
    //   value,
    //   current,
    //   nextValue,
    //   dt,
    // });
    if (Math.abs(nextValue - value) > curTolerance) {
      setCurrent(nextValue);
    } else {
      setCurrent(value);
      setFixed(true);
    }
  };

  useEffect(() => {
    animate();
    setFixed(false);
  }, [current, value, fixed]);

  return { value: retVal, fixed };
};

export default useAnimatedNumberDisplay;
