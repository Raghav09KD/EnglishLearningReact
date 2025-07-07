import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    grammarCount: 0,
    vocabCount: 0,
    storyCount: 0,
    pronunciationCount: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [grammarRes, vocabRes, storyRes, pronunciationRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/grammar'),
        axios.get('http://localhost:5000/api/vocabulary'),
        axios.get('http://localhost:5000/api/stories'),
        axios.get('http://localhost:5000/api/pronunciation'),
      ]);

      setStats({
        grammarCount: grammarRes.data.length,
        vocabCount: vocabRes.data.length,
        storyCount: storyRes.data.length,
        pronunciationCount: pronunciationRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

const chartData = {
  labels: ['Grammar', 'Vocabulary', 'Stories', 'Pronunciation'],
  datasets: [
    {
      label: 'Content Count',
      data: [
        stats.grammarCount,
        stats.vocabCount,
        stats.storyCount,
        stats.pronunciationCount,
      ],
      backgroundColor: ['#4a90e2', '#7ed6df', '#f6b93b', '#9b59b6'], // Muted pastels
      borderRadius: 12,
      barThickness: 40,
    },
  ],
};

const chartOptions = {
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#2f3640',
      bodyColor: '#2f3640',
      borderColor: '#dcdde1',
      borderWidth: 1,
      padding: 10,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: '#636e72',
        font: { size: 14 },
      },
      grid: {
        color: '#ecf0f1',
        borderDash: [4, 4],
      },
    },
    x: {
      ticks: {
        color: '#636e72',
        font: { size: 14 },
      },
      grid: {
        display: false,
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

  return (
    <div className="admin-dashboard">
      <h2>📊 Admin Dashboard</h2>

      <div className="dashboard-widgets">
        <div className="widget card-blue">
          <h4>📘 Grammar Lessons</h4>
          <p>{stats.grammarCount}</p>
        </div>
        <div className="widget card-green">
          <h4>📚 Vocabulary</h4>
          <p>{stats.vocabCount}</p>
        </div>
        <div className="widget card-orange">
          <h4>📖 Stories</h4>
          <p>{stats.storyCount}</p>
        </div>
        <div className="widget card-purple">
          <h4>🔊 Pronunciation</h4>
          <p>{stats.pronunciationCount}</p>
        </div>
      </div>

      <div className="dashboard-chart">
        <h3 className="mt-4 mb-3">📈 Content Overview</h3>
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
