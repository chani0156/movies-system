import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface VoteGraphProps {
  data: { time: string; votes: number }[];
}

const MovieGraph: React.FC<VoteGraphProps> = ({ data }) => {
  debugger
  const chartData = {
    labels: data.map(item => item.time),
    datasets: [
      {
        label: 'Votes',
        data: data.map(item => item.votes),
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Votes' } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default MovieGraph;
