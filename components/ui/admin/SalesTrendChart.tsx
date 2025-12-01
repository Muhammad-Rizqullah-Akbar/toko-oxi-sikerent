// components/admin/charts/SalesTrendChart.tsx

'use client'; 
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Mendaftarkan komponen Chart.js yang dibutuhkan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Data Mock untuk Grafik Tren
const data: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    {
      label: 'Revenue (Juta Rp)',
      data: [10, 12, 9, 15, 18, 16, 20, 22, 25, 28, 30, 32], // Data placeholder
      borderColor: 'rgb(79, 70, 229)', // Indigo-600
      backgroundColor: 'rgba(79, 70, 229, 0.5)',
      tension: 0.4, // Membuat garis sedikit melengkung
    },
    {
      label: 'Target (Juta Rp)',
      data: [15, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 28], // Data placeholder
      borderColor: 'rgb(220, 38, 38)', // Red-600
      backgroundColor: 'rgba(220, 38, 38, 0.5)',
      tension: 0.4,
      borderDash: [5, 5],
      pointRadius: 0,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Revenue (Juta Rp)'
      }
    }
  }
};

const SalesTrendChart: React.FC = () => {
  return (
    <div className="h-96"> {/* Kontrol tinggi di sini */}
        <Line options={options} data={data} />
    </div>
  );
};

export default SalesTrendChart;