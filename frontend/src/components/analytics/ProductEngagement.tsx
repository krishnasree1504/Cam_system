import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ProductEngagementProps = {
  productDensity: Record<string, number>;
};

export const ProductEngagement: React.FC<ProductEngagementProps> = ({ productDensity }) => {
  const labels = Object.keys(productDensity);
  const data = Object.values(productDensity);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Product Density per Shelf',
        data,
        backgroundColor: 'rgba(0, 150, 255, 0.6)',
        borderColor: 'rgba(0, 150, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Product Engagement (Density)' },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};
