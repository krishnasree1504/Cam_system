import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ShelfAttractionChartProps = {
  attentionScores: Record<string, number>;
};

export const ShelfAttractionChart: React.FC<ShelfAttractionChartProps> = ({ attentionScores }) => {
  const sorted = Object.entries(attentionScores).sort((a, b) => Number(b[1]) - Number(a[1]));
  const labels = sorted.map(([shelf]) => shelf);
  const data = sorted.map(([, score]) => score);

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
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Shelf Attraction (Ranked)' },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};
