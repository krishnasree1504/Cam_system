import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ConsumerAttentionProps = {
  attentionScores: Record<string, number>;
};

export const ConsumerAttention: React.FC<ConsumerAttentionProps> = ({ attentionScores }) => {
  const labels = Object.keys(attentionScores);
  const data = Object.values(attentionScores);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Shelf Attention Score',
        data,
        backgroundColor: 'rgba(0, 230, 118, 0.6)',
        borderColor: 'rgba(0, 230, 118, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Consumer Attention per Shelf' },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};
