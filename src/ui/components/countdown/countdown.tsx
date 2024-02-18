"use client";

import { useEffect, useState } from "react";

import styles from "./countdown.module.scss";

interface Props {
  deadline: Date;
}

const GetTime = (deadline: Date) => {
  // Time until deadline in seconds
  const [time, setTime] = useState(
    Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000))
  );

  const decrement = () =>
    setTime((prevTime) => {
      return prevTime === 0 ? 0 : prevTime - 1;
    });

  useEffect(() => {
    const id = setInterval(decrement, 1000);
    return () => clearInterval(id);
  }, []);

  const format = (num: number): string => {
    return num < 10 ? "0" + num : num.toString();
  };

  return {
    days: format(Math.floor(time / (3600 * 24))),
    hours: format(Math.floor((time / 3600) % 24)),
    minutes: format(Math.floor((time / 60) % 60)),
    seconds: format(time % 60),
  };
};

export const Countdown = ({ deadline }: Props) => {
  const time = GetTime(deadline);
  return (
    <div className={styles.con}>
      <div className={styles.unit_con}>
        <div className={styles.unit}>{time.days}</div>
        Days
      </div>
      <div className={styles.unit_con}>
        <div className={styles.unit}>{time.hours}</div>
        Hours
      </div>
      <div className={styles.unit_con}>
        <div className={styles.unit}>{time.minutes}</div>
        Min<span>ute</span>s
      </div>
      <div className={`${styles.unit_con} ${styles.seconds}`}>
        <div className={styles.unit}>{time.seconds}</div>
        Sec<span>ond</span>s
      </div>
    </div>
  );
};
