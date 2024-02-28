"use client";

import { Entrants } from "@custom-types/game-types";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  entrants: Entrants;
}

/**@todo Change values depending on dark mode or not */
ChartJS.defaults.color = "#010136";
ChartJS.defaults.borderColor = "#01013640";

export const EntrantPredictions = ({ entrants }: Props) => {
  const options = {
    responsive: true,
    scales: {
      x: {
        title: { text: "Predicted Position", display: true },
      },
      y: {
        title: { text: "% of People", display: true },
        ticks: {
          callback: (value: string | number) => {
            return value + "%";
          },
        },
      },
    },
  };
  const labels = entrants["ver"].predictionedPositions.map((_, index) => {
    const pos = index + 1;
    const lastNumberOfPos = pos.toString().slice(-1);
    return (
      pos +
      (lastNumberOfPos === "1"
        ? "st"
        : lastNumberOfPos === "2"
        ? "nd"
        : lastNumberOfPos === "3"
        ? "rd"
        : "th")
    );
  });
  const data = {
    labels,
    datasets: [
      {
        label: entrants["ver"].name,
        data: entrants["ver"].predictionedPositions,
        borderColor: entrants["ver"].color,
        backgroundColor: entrants["ver"].color + "50",
      },
    ],
  };
  return <Line options={options} data={data} />;
};
