"use client";

import { Entrant } from "@custom-types/game-types";

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
  entrant: Entrant;
}

/**@todo Change values depending on dark mode or not */
ChartJS.defaults.color = "#010136";
ChartJS.defaults.borderColor = "#01013640";

export const Chart = ({ entrant }: Props) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
  const labels = entrant.predictionedPositions.map((_, index) => {
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
        label: entrant.name,
        data: entrant.predictionedPositions,
        borderColor: entrant.color,
        backgroundColor: entrant.color + "50",
      },
    ],
  };
  return <Line style={{ minHeight: "300px" }} options={options} data={data} />;
};
