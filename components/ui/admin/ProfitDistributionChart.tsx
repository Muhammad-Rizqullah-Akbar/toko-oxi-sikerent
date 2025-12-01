// components/admin/charts/ProfitDistributionChart.tsx

'use client'; 
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Mendaftarkan komponen Chart.js yang dibutuhkan untuk Donut/Doughnut Chart
ChartJS.register(ArcElement, Tooltip, Legend);

// Data Mock untuk Distribusi Laba Kotor (Contoh data)
const data: ChartData<'doughnut'> = {
  labels: ['Laba Kotor (45%)', 'Harga Pokok Penjualan (55%)'],
  datasets: [
    {
      label: '% Distribusi',
      data: [45, 55], // 45% Laba Kotor, 55% HPP
      backgroundColor: [
        'rgba(79, 70, 229, 0.8)', // Indigo (Laba Kotor)
        'rgba(107, 114, 128, 0.6)', // Gray (HPP)
      ],
      borderColor: [
        '#ffffff',
        '#ffffff',
      ],
      borderWidth: 2,
    },
  ],
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%', // Membuat tampilan menjadi Donut
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                usePointStyle: true,
                padding: 20
            }
        },
        title: {
            display: true,
            text: 'Rasio Laba Kotor vs HPP'
        }
    }
};

const ProfitDistributionChart: React.FC = () => {
  return (
    <div className="h-72 w-full flex justify-center items-center">
        <Doughnut options={options} data={data} />
    </div>
  );
};

export default ProfitDistributionChart;