import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register necessary components for Chart.js
Chart.register(...registerables);

interface MovieVotesGraphProps {
  votesData: { time: string; votes: number }[];
}

const VoteGraphExample: React.FC<MovieVotesGraphProps> = ({ votesData }) => {
  const data = {
    labels: votesData.map((dataPoint) => new Date(dataPoint.time)),
    datasets: [
      {
        label: 'Votes',
        data: votesData.map((dataPoint) => dataPoint.votes),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm:ss',
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default VoteGraphExample;
