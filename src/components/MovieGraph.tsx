// MovieGraph.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';

interface MovieGraphProps {
  votes: { time: string; count: number }[];
}

const MovieGraph: React.FC<MovieGraphProps> = ({ votes }) => {
  const data = {
    labels: votes.map((vote) => vote.time),
    datasets: [
      {
        label: 'Votes received',
        data: votes.map((vote) => vote.count),
        fill: false,
        borderColor: 'blue',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default MovieGraph;
